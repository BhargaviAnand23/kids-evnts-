import React from 'react';

export function WavyDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full overflow-hidden leading-none py-2 ${className}`} aria-hidden="true">
      <svg className="relative block w-full h-6 sm:h-8 text-purple-200/60" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,-20 1200,30 L1200,120 L0,120 Z" fill="currentColor" />
      </svg>
    </div>
  );
}

export function ZigzagDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full overflow-hidden leading-none py-2 ${className}`} aria-hidden="true">
      <svg className="relative block w-full h-5 sm:h-7 text-indigo-200/50" viewBox="0 0 1200 60" preserveAspectRatio="none">
        <path d="M0,30 L60,0 L120,30 L180,0 L240,30 L300,0 L360,30 L420,0 L480,30 L540,0 L600,30 L660,0 L720,30 L780,0 L840,30 L900,0 L960,30 L1020,0 L1080,30 L1140,0 L1200,30 L1200,60 L0,60 Z" fill="currentColor" />
      </svg>
    </div>
  );
}
