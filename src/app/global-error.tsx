'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 min-h-screen flex items-center justify-center font-sans antialiased text-slate-900 p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-600 font-bold text-2xl">
            ⚠️
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Application Error</h1>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            A critical error occurred. Please click below to reload the page.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => reset()}
              className="w-full py-3 px-6 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors text-sm shadow-md shadow-purple-600/20"
            >
              Reload Application
            </button>
            <a
              href="/"
              className="block w-full text-center py-2.5 px-6 rounded-full border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors text-xs"
            >
              Back to Homepage
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
