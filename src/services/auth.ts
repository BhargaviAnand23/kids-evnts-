'use client'

import { createClient } from '@/utils/supabase/client'
import { dbService } from './db'
import type { OrganizationType } from '@/types'

const isSupabaseConfigured = (): boolean => {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

export interface SessionUser {
  id: string
  email: string
  role: 'parent' | 'admin'
  name: string
  school_id?: string // legacy child/parent dashboard school
  organization_id?: string // for admins
}

export const authService = {
  async getCurrentUser(): Promise<SessionUser | null> {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Check if admin
        const adminProfile = await dbService.getOrganizationAdminProfile(user.id)
        if (adminProfile) {
          return {
            id: user.id,
            email: user.email || '',
            role: 'admin',
            name: adminProfile.name,
            organization_id: adminProfile.organization_id
          }
        }
        
        // Otherwise, parent
        const parentProfile = await dbService.getParentProfile(user.id)
        if (parentProfile) {
          return {
            id: user.id,
            email: user.email || '',
            role: 'parent',
            name: parentProfile.name
          }
        }
      }
    }

    // Local Storage Mock Session
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kids_event_current_user')
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch {
          return null
        }
      }
    }
    return null
  },

  async recoverProfile(userId: string): Promise<SessionUser | null> {
    const adminProfile = await dbService.getOrganizationAdminProfile(userId)
    if (adminProfile) {
      return {
        id: userId,
        email: '', // Best effort
        role: 'admin',
        name: adminProfile.name,
        organization_id: adminProfile.organization_id
      }
    }
    const parentProfile = await dbService.getParentProfile(userId)
    if (parentProfile) {
      return {
        id: userId,
        email: '',
        role: 'parent',
        name: parentProfile.name
      }
    }
    return null
  },

  async signUp(
    email: string,
    password: string,
    name: string,
    role: 'parent' | 'admin',
    organizationId?: string, // Required if role is admin and linking to existing org
    schoolId?: string, // legacy for child
    orgDetails?: { name: string; type: OrganizationType }
  ): Promise<SessionUser | null> {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      })
      
      if (error) throw error
      if (!data.user) throw new Error('Sign up failed')
      if (data.user.identities && data.user.identities.length === 0) {
        throw new Error('User already registered')
      }

      const userId = data.user.id
      let finalOrgId = organizationId

      try {
        if (role === 'admin') {
          if (!finalOrgId && orgDetails) {
            // Step 1: Create organization first as an authenticated user
            const newOrg = await dbService.createOrganization({
              name: orgDetails.name,
              type: orgDetails.type,
              contact_email: email,
              logo_url: null,
              address: null,
            })
            finalOrgId = newOrg.id
          }

          if (!finalOrgId) throw new Error('Organization is required for admins')

          // Step 2: Link user to organization in organization_admins
          await dbService.createOrganizationAdminProfile({
            auth_user_id: userId,
            organization_id: finalOrgId,
            name,
            role: 'admin'
          })
        } else {
          await dbService.createParentProfile({
            auth_user_id: userId,
            name,
            email,
            phone: ''
          })
        }
      } catch (e) {
        console.warn('Profile creation failed:', e)
      }

      if (!data.session) return null // Email confirmation pending

      return {
        id: userId,
        email,
        role,
        name,
        organization_id: finalOrgId
      }
    }

    // Local Storage Mock Auth
    if (typeof window !== 'undefined') {
      const usersKey = 'kids_event_mock_users'
      const users = JSON.parse(localStorage.getItem(usersKey) || '[]')
      
      if (users.find((u: any) => u.email === email)) {
        throw new Error('User already exists')
      }

      let finalOrgId = organizationId
      if (role === 'admin' && !finalOrgId && orgDetails) {
        const newOrg = await dbService.createOrganization({
          name: orgDetails.name,
          type: orgDetails.type,
          contact_email: email,
          logo_url: null,
          address: null,
        })
        finalOrgId = newOrg.id
      }

      const mockUserId = crypto.randomUUID()
      const newUser = { id: mockUserId, email, password, name, role, organizationId: finalOrgId, schoolId }
      users.push(newUser)
      localStorage.setItem(usersKey, JSON.stringify(users))

      const sessionUser: SessionUser = {
        id: mockUserId,
        email,
        role,
        name,
        organization_id: finalOrgId,
        school_id: schoolId
      }

      // Automatically create the profiles in local storage tables
      if (role === 'admin') {
        if (!finalOrgId) throw new Error('Organization is required for admins')
        await dbService.createOrganizationAdminProfile({
          auth_user_id: mockUserId,
          organization_id: finalOrgId,
          name,
          role: 'admin'
        })
      } else {
        await dbService.createParentProfile({
          auth_user_id: mockUserId,
          name,
          email,
          phone: ''
        })
      }

      localStorage.setItem('kids_event_current_user', JSON.stringify(sessionUser))
      return sessionUser
    }

    throw new Error('Window undefined')
  },

  async login(email: string, password: string): Promise<SessionUser> {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      if (!data.user) throw new Error('Login failed')

      const userId = data.user.id
      const userEmail = data.user.email || email
      const userName: string =
        (data.user.user_metadata?.name as string | undefined) ||
        userEmail.split('@')[0]

      // Check admin profile first
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

      // Check parent profile
      let parentProfile = await dbService.getParentProfile(userId)

      // Self-heal: if no parent profile exists (user signed up before trigger was deployed,
      // or email was confirmed before trigger ran), create the profile now on first login.
      if (!parentProfile) {
        console.warn('[auth] No parent profile found — attempting self-heal insert')
        try {
          parentProfile = await dbService.createParentProfile({
            auth_user_id: userId,
            name: userName,
            email: userEmail,
            phone: ''
          })
        } catch (healErr: any) {
          console.error('[auth] Self-heal failed:', healErr?.message)
          throw new Error(
            'Account found but profile is missing. ' +
            'Please run the SQL fix in your Supabase dashboard (fix_auth_trigger.sql).'
          )
        }
      }

      return {
        id: userId,
        email: userEmail,
        role: 'parent',
        name: parentProfile.name
      }
    }

    // Local Storage Mock login
    if (typeof window !== 'undefined') {
      const usersKey = 'kids_event_mock_users'
      const users = JSON.parse(localStorage.getItem(usersKey) || '[]')
      const user = users.find((u: any) => u.email === email && u.password === password)

      if (!user) {
        throw new Error('Invalid email or password')
      }

      const sessionUser: SessionUser = {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        organization_id: user.organizationId,
        school_id: user.schoolId
      }

      localStorage.setItem('kids_event_current_user', JSON.stringify(sessionUser))
      return sessionUser
    }

    throw new Error('Window undefined')
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
