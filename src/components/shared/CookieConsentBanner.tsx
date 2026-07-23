'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('kidspire_cookie_consent');
    if (!consent) {
      // Show banner after short delay for smooth load
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('kidspire_cookie_consent', 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('kidspire_cookie_consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600/20 text-purple-400 rounded-2xl flex items-center justify-center shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">We Value Your Privacy</h4>
              <p className="text-xs text-slate-400">Cookie Preferences</p>
            </div>
          </div>
          <button
            onClick={handleDecline}
            className="text-slate-400 hover:text-white transition-colors p-1"
            aria-label="Close cookie banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
          We use cookies to improve your browsing experience, personalize content, and analyze platform traffic. Learn more in our{' '}
          <Link href="/privacy" className="text-purple-400 hover:underline font-semibold">
            Privacy Policy
          </Link>.
        </p>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            onClick={handleAccept}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold h-10 rounded-xl"
          >
            Accept All
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDecline}
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white font-medium h-10 rounded-xl"
          >
            Essential Only
          </Button>
        </div>
      </div>
    </div>
  );
}
