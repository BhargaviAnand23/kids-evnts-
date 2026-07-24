import React from 'react';

export function MascotLoader({ message = 'Loading fun activities...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center" aria-label="Loading content">
      {/* Animated Mascot Character */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-4 animate-mascot-bounce pointer-events-none">
        <svg viewBox="0 0 120 120" fill="none" className="w-full h-full drop-shadow-lg">
          {/* Star Body Background Glow */}
          <circle cx="60" cy="60" r="48" className="fill-purple-100" />
          
          {/* Smiling Star Character */}
          <path
            d="M60 12 L73 45 L108 47 L81 70 L89 104 L60 85 L31 104 L39 70 L12 47 L47 45 Z"
            className="fill-amber-400 stroke-amber-500"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Cheerful Eyes */}
          <circle cx="48" cy="52" r="5" className="fill-slate-900" />
          <circle cx="72" cy="52" r="5" className="fill-slate-900" />
          <circle cx="50" cy="50" r="1.5" className="fill-white" />
          <circle cx="74" cy="50" r="1.5" className="fill-white" />

          {/* Rosy Cheeks */}
          <ellipse cx="42" cy="60" rx="4" ry="2.5" className="fill-pink-400 opacity-70" />
          <ellipse cx="78" cy="60" rx="4" ry="2.5" className="fill-pink-400 opacity-70" />

          {/* Big Happy Smile */}
          <path
            d="M48 64 Q60 76 72 64"
            stroke="#0f172a"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Waving Hand */}
          <g className="animate-mascot-wave">
            <path
              d="M95 62 Q108 55 106 44"
              stroke="#f59e0b"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="106" cy="44" r="4" className="fill-amber-400" />
          </g>
        </svg>

        {/* Little Floating Sparks */}
        <span className="absolute -top-1 right-2 text-sm animate-ping opacity-75">✨</span>
        <span className="absolute bottom-1 left-2 text-xs animate-bounce opacity-75">⭐</span>
      </div>

      {/* Loading Text */}
      <p className="text-slate-700 font-bold text-base sm:text-lg tracking-tight">
        {message}
      </p>
      <div className="flex items-center gap-1.5 mt-2">
        <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
