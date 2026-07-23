'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { createClient } from '@/utils/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) { setError('Please enter your email address.'); return; }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (supabaseError) throw supabaseError;
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center py-8 sm:py-12 md:py-16 px-6 md:px-16 lg:px-24">
      <div className="w-full max-w-md">
        <Link href="/login" className="inline-flex items-center text-slate-500 hover:text-purple-600 text-sm font-medium mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Log in
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Forgot password?</h1>
          <p className="text-slate-500 text-sm md:text-base">No worries, we'll send you reset instructions.</p>
        </div>

        {sent ? (
          <Card className="border-none shadow-xl shadow-slate-200/50">
            <CardContent className="p-8 text-center">
              <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-900 mb-2">Check your email</h2>
              <p className="text-slate-500 text-sm mb-2">We sent a password reset link to</p>
              <p className="font-semibold text-purple-700 mb-6">{email}</p>
              <p className="text-slate-500 text-xs mb-8">
                Click the link in that email to reset your password. The link expires in 1 hour.
              </p>
              <Button asChild className="w-full">
                <Link href="/login">Back to Log In</Link>
              </Button>
              <button
                type="button"
                className="block w-full text-center text-sm text-purple-600 hover:underline mt-4"
                onClick={() => { setSent(false); setError(null); }}
              >
                Didn't receive it? Try again
              </button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-none shadow-xl shadow-slate-200/50">
            <CardContent className="p-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                  </div>
                )}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Email address</label>
                  <Input
                    type="email"
                    icon={<Mail className="w-4 h-4" />}
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending…</> : 'Send Reset Link'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
