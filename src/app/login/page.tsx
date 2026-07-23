'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
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

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const user = await authService.login(email, password);
      // Redirect based on role
      if (user.role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/parent');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials and try again.');
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
          <Link href="/" className="text-3xl font-bold text-purple-600 tracking-tight mb-2 block">
            Kidspire
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Welcome back</h1>
          <p className="text-slate-500 text-sm md:text-base">Log in to manage your bookings and saved events</p>
        </div>

        <Card className="border-none shadow-2xl shadow-purple-900/10 mb-6">
          <CardContent className="p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <div>
                <label htmlFor="login-email" className="text-sm font-semibold text-slate-700 mb-2 block">Email address</label>
                <Input
                  id="login-email"
                  type="email"
                  icon={<Mail className="w-4 h-4" />}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="login-password" className="text-sm font-semibold text-slate-700">Password</label>
                  <Link href="/forgot-password" className="text-xs font-semibold text-purple-600 hover:text-purple-700">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="login-password"
                  type="password"
                  icon={<Lock className="w-4 h-4" />}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Logging in…
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
                <Button variant="outline" className="w-full font-medium" type="button">
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
