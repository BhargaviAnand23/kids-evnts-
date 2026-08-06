'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { FormError } from '@/components/ui/FormError';
import { authService } from '@/services/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const user = await authService.login(email.trim(), password);
      // Redirect based on role
      if (user.role === 'super_admin' || user.is_super_admin) {
        router.push('/dashboard/super-admin');
      } else if (user.role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/parent');
      }
    } catch (err: any) {
      const msg = typeof err?.message === 'string' && err.message.trim()
        ? err.message.trim()
        : 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await authService.signInWithGoogle();
      if (res?.error) {
        setError(res.error);
      }
    } catch (err: any) {
      setError(err?.message || 'Google login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center py-8 sm:py-12 md:py-16 px-6 md:px-16 lg:px-24 relative overflow-hidden">
      {/* Decorative bg */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-purple-100 to-transparent -z-10"></div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-section-title font-bold text-purple-600 tracking-tight mb-2 block">
            Kidspire
          </Link>
          <h1 className="text-page-title font-bold text-slate-900">Welcome back</h1>
          <p className="text-slate-600 text-body mt-1">Sign in to your account</p>
        </div>

        <Card>
          <CardContent className="p-6 md:p-8">
            <FormError message={error} />

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-caption font-medium text-slate-700 mb-1 block">Email</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-caption font-medium text-slate-700 mb-1 block">Password</label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Link
                  href="/forgot-password"
                  className="text-caption font-semibold text-purple-600 hover:text-purple-700"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...
                  </>
                ) : (
                  <>
                    Log In <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500 mb-4">Or continue with</p>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="w-full font-medium"
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" /> Google
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-slate-600">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-semibold text-purple-600 hover:text-purple-700">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
