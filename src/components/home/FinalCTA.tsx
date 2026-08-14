'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function FinalCTA() {
  return (
    <section className="py-16 md:py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="relative rounded-[40px] bg-gradient-to-r from-purple-800 via-pink-700 to-amber-600 p-8 sm:p-14 md:p-20 text-center text-white overflow-hidden shadow-2xl shadow-purple-900/30 border border-white/20">
          
          {/* Decorative Doodles & Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-caption font-black uppercase tracking-wider border border-white/30 shadow-sm">
              <Heart className="w-4 h-4 fill-current text-pink-300" />
              <span>Give Them Unforgettable Moments</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Every Child Has Something Amazing to Discover ✨
            </h2>

            <p className="text-purple-100 text-body-lg max-w-2xl mx-auto font-bold leading-relaxed">
              Find an experience they'll remember forever — from stage confidence in drama to teamwork in soccer and innovation in coding.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/explore">
                <Button size="lg" className="h-14 px-10 rounded-full bg-white text-purple-950 hover:bg-gradient-to-r hover:from-amber-400 hover:to-orange-500 hover:text-slate-950 font-black text-lg shadow-2xl shadow-purple-950/40 transition-all duration-300">
                  Explore All Experiences <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            <p className="text-caption text-purple-100/90 pt-3 font-extrabold">
              ✓ Instant Booking Confirmation • ✓ Verified Safe Venues • ✓ 100% Parent Guarantee
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
