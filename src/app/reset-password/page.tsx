'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: supabaseError } = await supabase.auth.updateUser({ password: newPassword });
      if (supabaseError) throw supabaseError;
      setSuccess(true);
      // Auto redirect after 2s
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Your reset link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center py-8 sm:py-12 md:py-16 px-6 md:px-16 lg:px-24">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Set new password</h1>
          <p className="text-slate-500 text-sm md:text-base">Your new password must be different to previously used passwords.</p>
        </div>

        <Card className="border-none shadow-xl shadow-slate-200/50">
          <CardContent className="p-8">
            {success ? (
              <div className="text-center py-4">
                <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-slate-900 mb-2">Password updated!</h2>
                <p className="text-slate-500 text-sm mb-6">Redirecting you to login…</p>
                <Button asChild className="w-full">
                  <Link href="/login">Go to Log In</Link>
                </Button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <div>
                      <p>{error}</p>
                      {error.toLowerCase().includes('expired') && (
                        <Link href="/forgot-password" className="font-semibold underline mt-1 block">
                          Request a new reset link →
                        </Link>
                      )}
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">New Password</label>
                  <Input
                    type="password"
                    icon={<Lock className="w-4 h-4" />}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                  <p className="text-xs text-slate-500 mt-2">Must be at least 8 characters.</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Confirm Password</label>
                  <Input
                    type="password"
                    icon={<Lock className="w-4 h-4" />}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
                  {loading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating…</>
                  ) : (
                    <>Reset Password <ArrowRight className="w-4 h-4 ml-2" /></>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
