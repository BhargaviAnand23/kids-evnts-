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
  const metaRole = (user.user_metadata?.role as UserRole) || 'parent';
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
  if (adminProfile || metaRole === 'admin') {
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
    if (!isSupabaseConfigured()) return null

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    return resolveUserFromAuthUser(user)
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
          role,
          org_name: orgDetails?.name,
          org_type: orgDetails?.type
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

    // If session is active (auto-confirmed email), return session user immediately
    if (data.session) {
      return resolveUserFromAuthUser(data.user)
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

    return resolveUserFromAuthUser(data.user)
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
