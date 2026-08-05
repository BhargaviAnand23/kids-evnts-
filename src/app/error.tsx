'use client';

import React, { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <div className="bg-slate-50 min-h-[75vh] flex flex-col items-center justify-center py-16 px-6 md:px-16 lg:px-24 text-center">
      <div className="w-20 h-20 bg-purple-100 rounded-3xl flex items-center justify-center mb-6 text-purple-600 shadow-sm border border-purple-200/60 text-3xl">
        ⚠️
      </div>
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
        Something went wrong
      </h1>
      <p className="text-slate-600 text-sm md:text-base mb-8 max-w-md mx-auto leading-relaxed">
        An unexpected error occurred while loading this page. Don't worry, your data is safe.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={() => reset()}
          className="w-full sm:w-auto h-12 px-6 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors text-sm shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 cursor-pointer"
        >
          Try Again
        </button>
        <a
          href="/"
          className="w-full sm:w-auto h-12 px-6 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition-colors text-sm flex items-center justify-center gap-2"
        >
          Go to Homepage
        </a>
      </div>
    </div>
  );
}
