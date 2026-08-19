'use client';
import React from 'react';
import { School, Award, Activity, Heart, ShieldCheck, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

const PARTNERS = [
  { name: 'Chennai Chess Academy', icon: Award },
  { name: 'Rhythm Dance Academy', icon: Heart },
  { name: 'Blue Wave Aquatics', icon: Activity },
  { name: 'Metropolitan Youth Sports Club', icon: ShieldCheck },
  { name: 'STEM Explorers Lab', icon: Flame },
  { name: 'Greenwood Elementary School', icon: School },
  { name: 'Riverside Academy', icon: School },
  { name: 'Dragon Dojo Martial Arts', icon: Award },
];

export function LogoLoop() {
  // Double the list to ensure there's enough content to loop seamlessly at -50% translation
  const list = [...PARTNERS, ...PARTNERS];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="py-8 bg-slate-900 border-t border-b border-slate-800 overflow-hidden relative w-full select-none"
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 mb-4 text-center">
        <p className="text-[10px] sm:text-xs font-black tracking-widest text-slate-400 uppercase">
          Trusted by local schools &amp; youth academies
        </p>
      </div>
      
      <div className="flex w-full overflow-hidden relative mask-gradient py-1.5">
        <div className="animate-marquee flex items-center gap-16 whitespace-nowrap">
          {list.map((partner, idx) => {
            const Icon = partner.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors duration-200 cursor-pointer font-bold text-sm sm:text-base tracking-wide"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/50 flex items-center justify-center text-purple-400">
                  <Icon className="w-5 h-5" />
                </div>
                <span>{partner.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
