'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, AlertCircle, Loader2, CheckCircle2, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { authService } from '@/services/auth';
import { dbService } from '@/services/db';
import type { OrganizationType } from '@/types';

type Role = 'parent' | 'admin';

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>('parent');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Organizer-specific fields
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState<OrganizationType>('club');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (role === 'admin' && !orgName.trim()) {
      setError('Please enter your organization or academy name.');
      return;
    }
    if (!termsAccepted) {
      setError('You must agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }

    setLoading(true);
    try {
      const user = await authService.signUp(
        email,
        password,
        name,
        role,
        undefined,
        undefined,
        role === 'admin' ? { name: orgName.trim(), type: orgType } : undefined
      );
      if (!user) {
        // null = Supabase email confirmation required — session not yet granted
        setAwaitingConfirmation(true);
        return;
      }
      if (user.role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/parent');
      }
    } catch (err: any) {
      setError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Email confirmation pending screen ────────────────────────────────────────
  if (awaitingConfirmation) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-xl border border-slate-100 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Check your email</h1>
          <p className="text-slate-500 mb-1">We sent a confirmation link to</p>
          <p className="font-semibold text-purple-700 mb-6">{email}</p>
          <p className="text-slate-500 text-sm mb-8">
            Click the link in that email to activate your account, then come back here to log in.
          </p>
          <Button asChild className="w-full">
            <Link href="/login">Go to Log In</Link>
          </Button>
        </div>
      </div>
    );
  }

  // ── Signup form ──────────────────────────────────────────────────────────────
  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center py-8 sm:py-12 md:py-16 px-6 md:px-16 lg:px-24 relative overflow-hidden">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-purple-900/5 border border-slate-100 relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-purple-600 tracking-tight mb-2 block">
            Kidspire
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Create an account</h1>
          <p className="text-slate-500 text-sm md:text-base">Join thousands of parents making weekends special</p>
        </div>

        <Card className="border-none shadow-2xl shadow-orange-900/10 mb-6">
          <CardContent className="p-8">
            {/* Role toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setRole('parent')}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                  role === 'parent'
                    ? 'bg-white shadow-sm text-slate-900'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Parent
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  role === 'admin'
                    ? 'bg-white shadow-sm text-slate-900'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Organizer
              </button>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="signup-name" className="text-sm font-semibold text-slate-700 mb-2 block">Full Name</label>
                <Input
                  id="signup-name"
                  type="text"
                  icon={<User className="w-4 h-4" />}
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              {/* Organizer-only fields */}
              {role === 'admin' && (
                <>
                  <div>
                    <label htmlFor="signup-org-name" className="text-sm font-semibold text-slate-700 mb-2 block">Organization / Academy Name</label>
                    <Input
                      id="signup-org-name"
                      type="text"
                      icon={<Building2 className="w-4 h-4" />}
                      placeholder="e.g. Metro Youth Sports Club"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="signup-org-type" className="text-sm font-semibold text-slate-700 mb-2 block">Organization Type</label>
                    <select
                      id="signup-org-type"
                      value={orgType}
                      onChange={(e) => setOrgType(e.target.value as OrganizationType)}
                      disabled={loading}
                      className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="club">Sports Club</option>
                      <option value="sports_academy">Sports Academy</option>
                      <option value="arts_studio">Arts Studio</option>
                      <option value="school">School</option>
                      <option value="college">College</option>
                      <option value="camp">Camp / Workshop</option>
                      <option value="independent">Independent Coach</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label htmlFor="signup-email" className="text-sm font-semibold text-slate-700 mb-2 block">Email address</label>
                <Input
                  id="signup-email"
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
                <label htmlFor="signup-password" className="text-sm font-semibold text-slate-700 mb-2 block">Password</label>
                <Input
                  id="signup-password"
                  type="password"
                  icon={<Lock className="w-4 h-4" />}
                  placeholder="Create a strong password (min 6 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              {/* Terms & Privacy acceptance — required */}
              <div className="flex items-start gap-3 pt-1">
                <input
                  id="terms-checkbox"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={e => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer shrink-0"
                />
                <label htmlFor="terms-checkbox" className="text-sm text-slate-600 cursor-pointer leading-relaxed">
                  I agree to Kidspire's{' '}
                  <Link href="/terms" target="_blank" className="text-purple-600 hover:underline font-medium">Terms of Service</Link>{' '}and{' '}
                  <Link href="/privacy" target="_blank" className="text-purple-600 hover:underline font-medium">Privacy Policy</Link>.
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full h-12 text-base" disabled={loading || !termsAccepted}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account…
                    </>
                  ) : (
                    <>
                      Sign Up <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500 mb-4">Or sign up with</p>
              <div className="flex gap-4">
                <Button variant="outline" className="w-full font-medium" type="button">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" /> Google
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-400">
          Your data is protected under our{' '}
          <Link href="/privacy" className="text-purple-500 hover:underline">Privacy Policy</Link>.
        </p>
        <p className="text-center text-slate-600 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-purple-600 hover:text-purple-700">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
