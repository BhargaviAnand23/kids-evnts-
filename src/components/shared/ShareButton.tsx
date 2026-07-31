'use client';

import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
  className?: string;
  iconOnly?: boolean;
}

export function ShareButton({ title, text, url, className = '', iconOnly = true }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    const shareTitle = title || 'Check out this activity on Kidspire!';
    const shareText = text || 'Discover top-rated sports, arts, and learning activities for kids on Kidspire.';

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // User cancelled native share sheet or share failed — fall back to clipboard
        if ((err as Error)?.name === 'AbortError') return;
      }
    }

    // Fallback: Copy link to clipboard
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  if (iconOnly) {
    return (
      <div className="relative inline-flex items-center">
        <button
          onClick={handleShare}
          className={`p-2 text-slate-400 hover:text-purple-600 rounded-full hover:bg-slate-50 transition-colors flex items-center justify-center cursor-pointer ${className}`}
          title="Share Event"
          aria-label="Share Event"
        >
          {copied ? <Check className="w-5 h-5 text-emerald-600 animate-in zoom-in-50" /> : <Share2 className="w-5 h-5" />}
        </button>
        {copied && (
          <div className="absolute right-0 top-full mt-1.5 px-3 py-1 bg-slate-900 text-white text-micro font-medium rounded-lg shadow-lg whitespace-nowrap z-50 animate-in fade-in slide-in-from-top-1">
            Link copied to clipboard!
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={handleShare}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-caption font-semibold bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 transition-colors cursor-pointer ${className}`}
      >
        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-purple-600" />}
        <span>{copied ? 'Link Copied!' : 'Share'}</span>
      </button>
      {copied && (
        <div className="absolute right-0 top-full mt-1.5 px-3 py-1 bg-slate-900 text-white text-micro font-medium rounded-lg shadow-lg whitespace-nowrap z-50 animate-in fade-in slide-in-from-top-1">
          Link copied to clipboard!
        </div>
      )}
    </div>
  );
}
