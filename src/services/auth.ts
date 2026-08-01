'use client'

import { createClient } from '@/utils/supabase/client'
import { dbService } from './db'
import type { OrganizationType } from '@/types'

const isSupabaseConfigured = (): boolean => {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

export type UserRole = 'parent' | 'admin' | 'super_admin';

export const ADMIN_ALLOWLIST = [
  'admin@kidspire.com',
  'superadmin@kidspire.com',
  'founder@kidspire.com',
  'staff@kidspire.com',
  'admin@school-evnts.com',
  'demo.admin@kidspire.com'
];

export interface SessionUser {
  id: string
  email: string
  role: UserRole
  name: string
  school_id?: string
  organization_id?: string
  is_super_admin?: boolean
}

export const authService = {
  async getCurrentUser(): Promise<SessionUser | null> {
    if (!isSupabaseConfigured()) return null

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const userEmail = (user.email || '').toLowerCase().trim()
    const isAllowlistedAdmin = ADMIN_ALLOWLIST.includes(userEmail)

    // 1. Check if super admin
    const superAdminProfile = await dbService.getSuperAdminProfile(user.id)
    if (isAllowlistedAdmin || superAdminProfile) {
      return {
        id: user.id,
        email: user.email || '',
        role: 'super_admin',
        name: superAdminProfile?.name || user.user_metadata?.name || 'Platform Administrator',
        is_super_admin: true
      }
    }

    // 2. Check if organization admin
    let adminProfile = await dbService.getOrganizationAdminProfile(user.id)
    if (adminProfile || user.user_metadata?.role === 'admin') {
      let orgId = adminProfile?.organization_id

      if (!orgId) {
        const orgs = await dbService.getOrganizations()
        let matchedOrg = orgs.find(o => o.contact_email?.toLowerCase() === userEmail)

        if (!matchedOrg) {
          matchedOrg = await dbService.createOrganization({
            name: user.user_metadata?.name ? `${user.user_metadata.name}'s Academy` : 'Partner Organization',
            type: 'club',
            contact_email: userEmail,
            logo_url: null,
            address: null,
          })
        }

        orgId = matchedOrg.id

        adminProfile = await dbService.createOrganizationAdminProfile({
          auth_user_id: user.id,
          organization_id: orgId,
          name: adminProfile?.name || user.user_metadata?.name || userEmail.split('@')[0],
          role: 'admin',
        })
      }

      return {
        id: user.id,
        email: user.email || '',
        role: 'admin',
        name: adminProfile?.name || user.user_metadata?.name || 'Organizer',
        organization_id: orgId
      }
    }

    // 3. Check if parent
    const parentProfile = await dbService.getParentProfile(user.id)
    if (parentProfile) {
      return {
        id: user.id,
        email: user.email || '',
        role: 'parent',
        name: parentProfile.name
      }
    }

    // 4. Fallback for newly confirmed user before profile trigger query settles
    return {
      id: user.id,
      email: user.email || '',
      role: (user.user_metadata?.role as UserRole) || 'parent',
      name: user.user_metadata?.name || (user.email || '').split('@')[0] || 'User'
    }
  },

  async signUp(
    email: string,
    password: string,
    name: string,
    role: 'parent' | 'admin',
    organizationId?: string,
    schoolId?: string,
    orgDetails?: { name: string; type: OrganizationType }
  ): Promise<SessionUser | null> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase services are currently unavailable. Please check configuration.')
    }

    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          name: name.trim(),
          role
        }
      }
    })

    if (error) {
      const msg = error.message?.toLowerCase() || ''
      if (
        msg.includes('already registered') ||
        msg.includes('already exists') ||
        msg.includes('email_exists') ||
        msg.includes('user_already_exists')
      ) {
        throw new Error('This email is already registered. Please log in instead.')
      }
      throw new Error(error.message || 'Sign up failed. Please try again.')
    }

    // Supabase returns an empty identities array if an account with this email already exists
    if (data.user?.identities && data.user.identities.length === 0) {
      throw new Error('This email is already registered. Please log in instead.')
    }

    if (!data.user) {
      throw new Error('Sign up failed. Please try again.')
    }

    // Handle new organization creation & profile linking for admins if specified
    if (role === 'admin') {
      try {
        let targetOrgId = organizationId
        if (!targetOrgId && orgDetails) {
          const newOrg = await dbService.createOrganization({
            name: orgDetails.name,
            type: orgDetails.type,
            contact_email: email.trim(),
            logo_url: null,
            address: null,
          })
          targetOrgId = newOrg.id
        }

        if (targetOrgId) {
          await dbService.createOrganizationAdminProfile({
            auth_user_id: data.user.id,
            organization_id: targetOrgId,
            name: name.trim(),
            role: 'admin',
          })
        }
      } catch (orgErr) {
        console.warn('[auth] Organization creation note:', orgErr)
      }
    }

    // Return null to require email confirmation — no active session or direct dashboard bypass
    return null
  },

  async login(email: string, password: string): Promise<SessionUser> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase services are currently unavailable. Please check configuration.')
    }

    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    })

    if (error) {
      const msg = error.message?.toLowerCase() || ''
      if (msg.includes('invalid login credentials')) {
        throw new Error('Invalid email or password.')
      }
      if (msg.includes('email not confirmed')) {
        throw new Error('Please confirm your email address before logging in. Check your inbox for the confirmation link.')
      }
      throw new Error(error.message || 'Login failed. Please try again.')
    }

    if (!data.user) {
      throw new Error('Login failed. Please try again.')
    }

    const userId = data.user.id
    const userEmail = data.user.email || email
    const userName: string =
      (data.user.user_metadata?.name as string | undefined) ||
      userEmail.split('@')[0]

    const isAllowlistedAdmin = ADMIN_ALLOWLIST.includes(userEmail.toLowerCase().trim())
    const superAdminProfile = await dbService.getSuperAdminProfile(userId)
    if (isAllowlistedAdmin || superAdminProfile) {
      return {
        id: userId,
        email: userEmail,
        role: 'super_admin',
        name: superAdminProfile?.name || userName || 'Platform Administrator',
        is_super_admin: true
      }
    }

    const adminProfile = await dbService.getOrganizationAdminProfile(userId)
    if (adminProfile) {
      return {
        id: userId,
        email: userEmail,
        role: 'admin',
        name: adminProfile.name,
        organization_id: adminProfile.organization_id
      }
    }

    const parentProfile = await dbService.getParentProfile(userId)

    return {
      id: userId,
      email: userEmail,
      role: 'parent',
      name: parentProfile?.name || userName
    }
  },

  async logout(): Promise<void> {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      await supabase.auth.signOut()
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kids_event_current_user')
    }
  }
}
