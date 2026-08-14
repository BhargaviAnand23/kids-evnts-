'use client';
import React from 'react';
import { ShieldCheck, Zap, RefreshCw, Star, Heart, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const TRUST_PILLARS = [
  {
    icon: ShieldCheck,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100/80',
    title: '100% Verified Organizers',
    subtitle: 'Background-checked coaches & certified safe venues',
  },
  {
    icon: Zap,
    color: 'text-amber-500',
    bgColor: 'bg-amber-100/80',
    title: 'Instant E-Tickets & Reminders',
    subtitle: 'Instant booking confirmation with automated calendar sync',
  },
  {
    icon: RefreshCw,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100/80',
    title: 'Parent-Friendly Refunds',
    subtitle: 'Hassle-free cancellations and easy reschedule options',
  },
  {
    icon: Star,
    color: 'text-violet-600',
    bgColor: 'bg-violet-100/80',
    title: 'Real Parent Reviews',
    subtitle: 'Authenticated ratings & photo stories from verified families',
  },
];

export function ParentTrustBar() {
  return (
    <section className="bg-white py-8 border-y border-slate-100 shadow-sm relative z-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">

        {/* Header Ribbon */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Heart className="w-4 h-4 text-purple-600 fill-purple-600" />
          <span className="text-micro font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
            Why 10,000+ Parents Trust Kidspire
          </span>
          <Heart className="w-4 h-4 text-purple-600 fill-purple-600" />
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/60 border border-slate-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all duration-200"
              >
                <div className={`p-3 rounded-2xl ${pillar.bgColor} ${pillar.color} shrink-0 shadow-sm`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-body flex items-center gap-1.5">
                    {pillar.title}
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  </h3>
                  <p className="text-caption text-slate-500 mt-0.5 leading-snug">
                    {pillar.subtitle}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
