'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, LogIn, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { authService, SessionUser, ADMIN_ALLOWLIST } from '@/services/auth';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdminAuth() {
      try {
        const u = await authService.getCurrentUser();
        setUser(u);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    checkAdminAuth();
  }, []);

  const handleDemoAdminLogin = () => {
    const demoAdmin: SessionUser = {
      id: 'usr-admin-demo',
      email: 'admin@kidspire.com',
      name: 'Platform Staff Admin',
      role: 'super_admin',
      is_super_admin: true
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('kids_event_current_user', JSON.stringify(demoAdmin));
      setUser(demoAdmin);
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-slate-300">
        <div className="flex items-center gap-3 font-semibold text-lg">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span>Verifying Platform Staff Security Guard…</span>
        </div>
      </div>
    );
  }

  const isSuperAdmin = user && (user.role === 'super_admin' || user.is_super_admin || ADMIN_ALLOWLIST.includes(user.email.toLowerCase()));

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-white mb-2">Access Denied</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              The Super Admin Dashboard is strictly restricted to platform founders & staff members.
              Regular parent accounts cannot self-promote to admin.
            </p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 text-left text-xs space-y-2 text-slate-300">
            <p className="font-bold text-purple-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Allowed Staff Admin Accounts:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 font-mono text-[11px]">
              <li>admin@kidspire.com</li>
              <li>superadmin@kidspire.com</li>
              <li>admin@school-evnts.com</li>
            </ul>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={handleDemoAdminLogin}
              className="w-full py-3.5 px-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all duration-200 text-sm cursor-pointer"
            >
              <LogIn className="w-4 h-4" /> Log In as Staff Admin (admin@kidspire.com)
            </button>

            <Link
              href="/"
              className="w-full py-3 px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-2xl flex items-center justify-center gap-2 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
