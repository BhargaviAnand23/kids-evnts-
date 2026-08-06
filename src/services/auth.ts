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

async function resolveUserFromAuthUser(user: any): Promise<SessionUser> {
  const userEmail = (user.email || '').toLowerCase().trim();
  const userId = user.id;
  const userName = (user.user_metadata?.name as string | undefined) || userEmail.split('@')[0] || 'User';
  const rawMetaRole = (user.user_metadata?.role as string) || 'parent';
  const isOrganizerRole = rawMetaRole === 'admin' || rawMetaRole === 'organizer';
  const metaOrgName = user.user_metadata?.org_name;
  const metaOrgType = user.user_metadata?.org_type || 'club';

  const isAllowlistedAdmin = ADMIN_ALLOWLIST.includes(userEmail);

  // 1. Check if super admin
  const superAdminProfile = await dbService.getSuperAdminProfile(userId).catch(() => null);
  if (isAllowlistedAdmin || superAdminProfile) {
    return {
      id: userId,
      email: userEmail,
      role: 'super_admin',
      name: superAdminProfile?.name || userName || 'Platform Administrator',
      is_super_admin: true,
    };
  }

  // 2. Check if organization admin
  let adminProfile = await dbService.getOrganizationAdminProfile(userId).catch(() => null);
  if (adminProfile || isOrganizerRole) {
    let orgId = adminProfile?.organization_id;

    if (!orgId) {
      const orgs = await dbService.getOrganizations().catch(() => []);
      let matchedOrg = orgs.find((o) => o.contact_email?.toLowerCase() === userEmail);

      if (!matchedOrg) {
        try {
          matchedOrg = await dbService.createOrganization({
            name: metaOrgName || `${userName}'s Academy`,
            type: metaOrgType,
            contact_email: userEmail,
            logo_url: null,
            address: null,
          });
        } catch (err) {
          console.warn('[auth] Organization creation fallback note:', err);
          matchedOrg = {
            id: `org-${userId.substring(0, 8)}`,
            name: metaOrgName || `${userName}'s Academy`,
            type: metaOrgType,
            contact_email: userEmail,
            logo_url: null,
            address: null,
            verified: false,
            created_at: new Date().toISOString(),
          };
        }
      }

      orgId = matchedOrg.id;

      try {
        adminProfile = await dbService.createOrganizationAdminProfile({
          auth_user_id: userId,
          organization_id: orgId,
          name: adminProfile?.name || userName,
          role: 'admin',
        });
      } catch (err) {
        console.warn('[auth] Organization admin profile fallback note:', err);
        adminProfile = {
          id: `admin-${userId.substring(0, 8)}`,
          auth_user_id: userId,
          organization_id: orgId,
          name: userName,
          role: 'admin',
          created_at: new Date().toISOString(),
        };
      }
    }

    return {
      id: userId,
      email: userEmail,
      role: 'admin',
      name: adminProfile?.name || userName || 'Organizer',
      organization_id: orgId,
    };
  }

  // 3. Check if parent
  const parentProfile = await dbService.getParentProfile(userId).catch(() => null);
  return {
    id: userId,
    email: userEmail,
    role: 'parent',
    name: parentProfile?.name || userName,
  };
}

export const authService = {
  async getCurrentUser(): Promise<SessionUser | null> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const resolved = await resolveUserFromAuthUser(user)
          if (typeof window !== 'undefined' && resolved) {
            localStorage.setItem('kids_event_current_user', JSON.stringify(resolved))
          }
          return resolved
        }
      } catch (err) {
        console.warn('[auth] getCurrentUser Supabase check note:', err)
      }
    }

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kids_event_current_user')
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch {}
      }
    }
    return null
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

    // Send 'organizer' as metadata role for admin signups because Supabase database triggers fail with 500 if metadata role is 'admin'
    const metaRole = role === 'admin' ? 'organizer' : role
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          name: name.trim(),
          role: metaRole,
          org_name: orgDetails?.name,
          org_type: orgDetails?.type
        }
      }
    })

    if (error) {
      const errorMsg = typeof error.message === 'string' && error.message.trim() ? error.message : ''
      const msg = errorMsg.toLowerCase()
      if (
        msg.includes('already registered') ||
        msg.includes('already exists') ||
        msg.includes('email_exists') ||
        msg.includes('user_already_exists')
      ) {
        throw new Error('This email is already registered. Please log in instead.')
      }
      throw new Error(errorMsg || 'Sign up failed. Please try again.')
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

    // Resolve session user
    const sessionUser = await resolveUserFromAuthUser(data.user)

    // Save active user in localStorage so application guards recognize the user instantly
    if (typeof window !== 'undefined' && sessionUser) {
      localStorage.setItem('kids_event_current_user', JSON.stringify(sessionUser))
    }

    // If session is active or user resolved, return session user
    if (data.session || sessionUser) {
      return sessionUser
    }

    // Return null to require email confirmation if user was not resolvable
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

    const sessionUser = await resolveUserFromAuthUser(data.user)
    if (typeof window !== 'undefined' && sessionUser) {
      localStorage.setItem('kids_event_current_user', JSON.stringify(sessionUser))
    }
    return sessionUser
  },

  async signInWithGoogle(): Promise<{ error?: string }> {
    if (!isSupabaseConfigured()) {
      return { error: 'Supabase is not configured with environment variables.' }
    }

    const supabase = createClient()
    const getRedirectUrl = () => {
      let baseUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        (typeof window !== 'undefined' ? window.location.origin : 'https://school-evnts.vercel.app')
      baseUrl = baseUrl.includes('http') ? baseUrl : `https://${baseUrl}`
      return baseUrl.endsWith('/') ? `${baseUrl}dashboard/parent` : `${baseUrl}/dashboard/parent`
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getRedirectUrl(),
      },
    })

    if (error) {
      return { error: error.message }
    }
    return {}
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
