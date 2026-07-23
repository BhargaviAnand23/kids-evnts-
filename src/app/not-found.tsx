import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="bg-slate-50 min-h-[80vh] flex flex-col items-center justify-center py-20 px-6 md:px-16 lg:px-24 text-center">
      <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mb-8">
        <span className="text-4xl sm:text-5xl font-bold text-purple-600">404</span>
      </div>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Page not found</h1>
      <p className="text-slate-600 text-base mb-10 max-w-md mx-auto">
        Oops! The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <Button size="lg" className="h-14 px-8" asChild>
        <Link href="/">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Home
        </Link>
      </Button>
    </div>
  );
}
