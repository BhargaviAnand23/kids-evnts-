'use client';
import React from 'react';
import { Trophy, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function MegaEventBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
      className="py-6 lg:py-8 bg-mesh-purple-rich relative overflow-hidden border-b border-purple-100/40"
    >
      {/* Soft abstract glow overlay for the section wrapper */}
      <div className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none">
        <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-purple-400 filter blur-3xl"></div>
        <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-indigo-400 filter blur-3xl"></div>
      </div>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="relative w-full rounded-[32px] overflow-hidden min-h-[280px] sm:min-h-[320px] md:min-h-[360px] flex items-end shadow-2xl shadow-purple-900/20">

          {/* ── Background photo ── */}
          <img
            src="/images/sports-hub.jpg"
            alt="Kids Sports Festival"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* ── Purple gradient overlay — left-heavy for text readability ── */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-purple-800/70 to-purple-600/30" />
          {/* Bottom vignette for extra legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-950/60 via-transparent to-transparent" />

          {/* ── Card content ── */}
          <div className="relative z-10 w-full p-7 sm:p-10 md:p-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">

            {/* Left — text block */}
            <div className="max-w-lg">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-caption font-bold mb-4 backdrop-blur-sm">
                <Trophy className="w-3.5 h-3.5" />
                Upcoming Mega Events
              </div>

              {/* Title */}
              <h2 className="text-hero font-extrabold text-white mb-2 leading-tight tracking-tight drop-shadow-md">
                Kids Sports Festival 2025
              </h2>

              {/* Activity tags */}
              <p className="text-purple-200 text-body font-medium mb-5">
                Football&nbsp;•&nbsp;Basketball&nbsp;•&nbsp;Fun&nbsp;Games
              </p>

              {/* Meta — date + location */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-white/80 text-caption">
                  <Calendar className="w-4 h-4 text-purple-300 shrink-0" />
                  <span>Sep 10 – Sep 12, 2025</span>
                </div>
                <div className="flex items-center gap-2 text-white/80 text-caption">
                  <MapPin className="w-4 h-4 text-purple-300 shrink-0" />
                  <span>Chennai Stadium, Chennai</span>
                </div>
              </div>
            </div>

            {/* Right — CTA */}
            <div className="shrink-0">
              <a
                href="#"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-purple-700 font-bold text-body hover:bg-purple-50 active:scale-95 transition-all duration-150 shadow-lg shadow-purple-900/30 hover-lift"
              >
                Know More
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
