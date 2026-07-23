import React from 'react';
import { Tag } from 'lucide-react';

interface AdBannerProps {
  slot?: string;
  format?: 'horizontal' | 'rectangle' | 'vertical';
  className?: string;
}

export function AdBanner({ slot = 'general', format = 'horizontal', className = '' }: AdBannerProps) {
  const formatStyles = {
    horizontal: 'w-full py-4 min-h-[110px] px-6',
    rectangle: 'w-full min-h-[200px] p-4',
    vertical: 'w-full min-h-[240px] p-4'
  };

  return (
    <div className={`w-full bg-slate-50 border border-slate-200/80 rounded-2xl overflow-hidden relative shadow-sm ${className}`}>
      {/* Visual Header / Label with flex-wrap and gap to prevent overlap */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-2 bg-slate-100/80 border-b border-slate-200/60 text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
        <span className="flex items-center gap-1.5 shrink-0">
          <Tag className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <span>Advertisement</span>
        </span>
        <span className="text-[10px] text-slate-400 font-mono truncate max-w-[180px]">
          Ad Slot: {slot}
        </span>
      </div>

      {/* Ad Unit Container */}
      <div className={`flex flex-col items-center justify-center text-center ${formatStyles[format]}`}>
        {/* Placeholder Ad Creative */}
        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-r from-purple-500/5 via-indigo-500/5 to-purple-500/5 border border-dashed border-purple-200/80 w-full h-full min-h-[120px]">
          <p className="text-sm font-semibold text-purple-900/80 mb-1">
            🌟 Discover Top Local Kids Clubs & Academies
          </p>
          <p className="text-xs text-slate-500 max-w-md leading-relaxed">
            Sponsored placement for certified youth activity organizers. Book verified camps, sports & hobby classes.
          </p>
        </div>
      </div>
    </div>
  );
}
