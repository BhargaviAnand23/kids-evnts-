"use client";
import type { AuthChangeEvent } from '@supabase/supabase-js';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Heart, Bell, MapPin, Menu, LogOut, LayoutDashboard, ChevronDown, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { createClient } from '@/utils/supabase/client';
import { authService } from '@/services/auth';
import { dbService } from '@/services/db';
import { LocationSelector } from '@/components/shared/LocationSelector';
import type { SessionUser } from '@/services/auth';

// ── Avatar initials helper ────────────────────────────────────────────────────
function getInitials(name: string): string {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ── Profile dropdown ──────────────────────────────────────────────────────────
function ProfileMenu({ user, onLogout }: { user: SessionUser; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const dashboardHref = user.role === 'admin' ? '/dashboard/admin' : '/dashboard/parent';

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 border border-slate-200 bg-white hover:border-purple-300 hover:shadow-sm transition-all"
        aria-label="Profile menu"
      >
        {/* Avatar circle */}
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {getInitials(user.name)}
        </div>
        <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate hidden xl:block">
          {user.name.split(' ')[0]}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          {/* User info */}
          <div className="px-4 py-3 border-b border-slate-100 mb-1">
            <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
            <span className="inline-block mt-1.5 text-[10px] font-semibold uppercase tracking-wide bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
              {user.role === 'admin' ? 'Organizer' : 'Parent'}
            </span>
          </div>

          <Link
            href={dashboardHref}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            My Dashboard
          </Link>

          <button
            onClick={() => { setOpen(false); onLogout(); }}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Header ───────────────────────────────────────────────────────────────
export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notif dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const loadNotifications = useCallback(async (currentUser: SessionUser | null) => {
    if (!currentUser || currentUser.role !== 'parent') { setNotifications([]); return; }
    try {
      const profile = await dbService.getParentProfile(currentUser.id);
      if (!profile) return;
      const notifs = await dbService.getNotifications(profile.id);
      setNotifications(notifs.filter((n: any) => !n.read).slice(0, 5));
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    const supabase = createClient();

    // Load the current user immediately on mount
    authService.getCurrentUser().then(u => {
      setUser(u);
      setAuthReady(true);
      loadNotifications(u);
    });

    if (!supabase) {
      setAuthReady(true);
      return;
    }

    // Subscribe to Supabase auth state changes for immediate reactivity
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const u = await authService.getCurrentUser();
        setUser(u);
        loadNotifications(u);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setNotifications([]);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadNotifications]);

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    router.push('/');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full h-20 shrink-0 border-b border-slate-100 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo and Tagline */}
        <div className="flex flex-col shrink-0">
          <Link href="/" className="text-2xl font-bold text-purple-600 tracking-tight">
            Kidspire
          </Link>
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold -mt-0.5">
            Play &middot; Explore &middot; Shine
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center space-x-4 xl:space-x-7 shrink-0">
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-purple-600 transition-colors whitespace-nowrap">Home</Link>
          <Link href="/explore" className="text-sm font-medium text-slate-600 hover:text-purple-600 transition-colors whitespace-nowrap">Explore</Link>
          <Link href="/categories" className="text-sm font-medium text-slate-600 hover:text-purple-600 transition-colors whitespace-nowrap">Categories</Link>
          <Link href="/how-it-works" className="text-sm font-medium text-slate-600 hover:text-purple-600 transition-colors whitespace-nowrap">How It Works</Link>
          <Link href="/list-your-event" className="text-sm font-medium text-slate-600 hover:text-purple-600 transition-colors whitespace-nowrap">List Your Event</Link>
          <Link href="/contact" className="text-sm font-medium text-slate-600 hover:text-purple-600 transition-colors whitespace-nowrap">Contact</Link>
        </nav>

        {/* Right side actions */}
        <div className="hidden lg:flex items-center space-x-3 xl:space-x-5 shrink-0">
          {/* Location Selector Component */}
          <LocationSelector />

          {/* Icons Group — Search, Wishlist Heart, Notification Bell aligned on exact horizontal flex baseline */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 text-slate-500 shrink-0">
            <Link
              href="/explore"
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 hover:text-purple-600 transition-colors"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </Link>
            <Link
              href="/dashboard/parent/saved"
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-rose-50 hover:text-heart-active transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
            </Link>
            {/* Notification Bell — real data for logged-in parents */}
            <div ref={notifRef} className="relative flex items-center justify-center">
              <button
                onClick={() => setNotifOpen(v => !v)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 hover:text-purple-600 transition-colors relative"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white border-2 border-white">
                    {notifications.length > 9 ? '9+' : notifications.length}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              {notifOpen && (
                <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <p className="font-semibold text-slate-900 text-sm">Notifications</p>
                    {notifications.length > 0 && (
                      <Link href="/dashboard/parent" onClick={() => setNotifOpen(false)}
                        className="text-xs text-purple-600 font-medium hover:underline">
                        View all
                      </Link>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-slate-400 text-sm">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      {user ? 'No new notifications' : 'Log in to see notifications'}
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
                      {notifications.map((n: any) => (
                        <div key={n.id} className={`px-4 py-3 text-sm ${
                          n.type === 'success' ? 'bg-green-50/60' : 'bg-white'
                        }`}>
                          <p className="font-semibold text-slate-900 text-xs">{n.title}</p>
                          <p className="text-slate-500 text-xs mt-0.5 line-clamp-2">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Auth section — skeleton during hydration to avoid layout shift */}
          <div className="flex items-center border-l border-slate-200 pl-4 shrink-0">
            {!authReady ? (
              // Skeleton placeholder — same width as logged-out buttons
              <div className="flex items-center gap-3">
                <div className="h-4 w-12 bg-slate-100 rounded animate-pulse" />
                <div className="h-9 w-20 bg-slate-100 rounded-full animate-pulse" />
              </div>
            ) : user ? (
              <ProfileMenu user={user} onLogout={handleLogout} />
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-purple-600 transition-colors whitespace-nowrap">
                  Log In
                </Link>
                <Button size="sm" className="whitespace-nowrap" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <button className="lg:hidden text-slate-600 p-2 rounded-lg hover:bg-slate-100">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
