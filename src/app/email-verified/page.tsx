'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { authService } from '@/services/auth';

export default function EmailVerifiedPage() {
  const [checking, setChecking] = useState(true);
  const [role, setRole] = useState<'parent' | 'admin' | null>(null);

  useEffect(() => {
    const check = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) setRole(user.role);
      } catch {
        // No session yet — still show page
      } finally {
        setChecking(false);
      }
    };
    check();
  }, []);

  const dashboardHref = role === 'admin' ? '/dashboard/admin' : role === 'parent' ? '/dashboard/parent' : '/login';
  const dashboardLabel = role === 'admin' ? 'Go to Partner Dashboard' : role === 'parent' ? 'Go to My Dashboard' : 'Log In';

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center px-6 py-16">
      <div className="max-w-md w-full text-center">
        {/* Success icon */}
        <div className="relative inline-flex mb-8">
          <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-14 h-14 text-green-500" />
          </div>
          <div className="absolute -top-1 -right-1 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <Mail className="w-5 h-5 text-white" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Email Verified!</h1>
        <p className="text-slate-600 text-lg mb-2">Your email address has been successfully confirmed.</p>
        <p className="text-slate-500 text-sm mb-10">
          Your Kidspire account is now active. You can explore events, book activities for your children, and manage everything from your dashboard.
        </p>

        {checking ? (
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="h-13" asChild>
              <Link href={dashboardHref}>
                {dashboardLabel} <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-13" asChild>
              <Link href="/explore">Browse Events</Link>
            </Button>
          </div>
        )}

        <p className="text-xs text-slate-400 mt-8">
          Having trouble?{' '}
          <Link href="/contact" className="text-purple-600 hover:underline">Contact support</Link>
        </p>
      </div>
    </div>
  );
}
