'use client';
import React from 'react';
import { Award, Users, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { CountUp } from '@/components/animations/CountUp';

export function StatsHighlights() {
  const stats = [
    {
      value: 50,
      suffix: '+',
      label: 'Verified Organizers',
      desc: 'Top-tier schools & academies',
      icon: Award,
      bgClass: 'bg-emerald-50/70 border-emerald-100/80 text-emerald-800 shadow-emerald-900/5',
      iconClass: 'bg-emerald-500 text-white shadow-emerald-500/30',
    },
    {
      value: 10000,
      suffix: '+',
      label: 'Happy Families',
      desc: 'Enrolled children & parents',
      icon: Users,
      bgClass: 'bg-rose-50/70 border-rose-100/80 text-rose-800 shadow-rose-900/5',
      iconClass: 'bg-rose-500 text-white shadow-rose-500/30',
    },
    {
      value: 4.9,
      suffix: '★',
      decimals: 1,
      label: 'Average Rating',
      desc: 'Based on parent reviews',
      icon: Star,
      bgClass: 'bg-amber-50/70 border-amber-100/80 text-amber-800 shadow-amber-900/5',
      iconClass: 'bg-amber-500 text-white shadow-amber-500/30',
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="py-10 bg-white border-t border-b border-slate-100"
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className={`flex items-center p-5 rounded-3xl border transition-all duration-300 hover:scale-[1.03] hover:shadow-lg ${stat.bgClass}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${stat.iconClass}`}>
                  <Icon className="w-5.5 h-5.5 animate-pulse" />
                </div>
                <div className="ml-5">
                  <div className="text-2xl sm:text-3xl font-black tracking-tight leading-none mb-1 text-slate-900">
                    <CountUp end={stat.value} suffix={stat.suffix} decimals={stat.decimals} duration={1200} />
                  </div>
                  <div className="text-sm font-bold text-slate-800 leading-tight">{stat.label}</div>
                  <div className="text-xs text-slate-500 mt-1">{stat.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
