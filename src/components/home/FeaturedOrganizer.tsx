'use client';
import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, Star, Sparkles, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const FEATURED_ORGS = [
  {
    id: 'org-youth-soccer',
    name: 'Metropolitan Youth Sports Club',
    type: 'Athletics & Clubs',
    logo: 'https://images.unsplash.com/photo-1518605368461-1ee7c5320746?w=200&auto=format&fit=crop&q=60',
    bio: 'Empowering children through grassroots sports, team building, and athletic excellence.',
    rating: '4.9',
    reviews: 42,
    address: '789 Stadium Way, Seattle, WA',
    bgClass: 'from-emerald-500/10 via-teal-500/5 to-white border-emerald-200/60 shadow-emerald-900/5',
    accentText: 'text-emerald-700',
    badgeBg: 'bg-emerald-500 text-white',
  },
  {
    id: 'org-dance-academy',
    name: 'Rhythm Dance Academy',
    type: 'Creative Arts & Dance',
    logo: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=200&auto=format&fit=crop&q=60',
    bio: 'Inspiring young dancers with expressive rhythm, movement, and creative performing arts.',
    rating: '4.8',
    reviews: 28,
    address: 'Studio 5, Creative Arts Center',
    bgClass: 'from-pink-500/10 via-purple-500/5 to-white border-pink-200/60 shadow-pink-900/5',
    accentText: 'text-pink-700',
    badgeBg: 'bg-pink-500 text-white',
  },
  {
    id: 'org-swimming-club',
    name: 'Blue Wave Aquatics',
    type: 'Water Sports & Safety',
    logo: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=200&auto=format&fit=crop&q=60',
    bio: 'Premier swimming instruction, water safety training, and competitive youth aquatic teams.',
    rating: '5.0',
    reviews: 35,
    address: 'Community Pool, Northgate',
    bgClass: 'from-blue-500/10 via-indigo-500/5 to-white border-blue-200/60 shadow-blue-900/5',
    accentText: 'text-blue-700',
    badgeBg: 'bg-blue-500 text-white',
  },
];

export function FeaturedOrganizer() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % FEATURED_ORGS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const org = FEATURED_ORGS[index];

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-mesh-purple-rich relative overflow-hidden border-b border-purple-100/50">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-12"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-micro font-bold bg-purple-100 text-purple-700 border border-purple-200/60 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 fill-purple-300 animate-spin-slow" />
            Organizer Spotlight
          </div>
          <h2 className="text-section-title font-bold text-slate-900 mb-3 tracking-tight">Featured Academy Partners</h2>
          <p className="text-slate-600 text-body">Meet the highly verified local academies building skills and smiles.</p>
        </motion.div>

        {/* Spotlight Card Wrapper */}
        <div className="max-w-4xl mx-auto relative min-h-[360px] md:min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={org.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className={`w-full rounded-[32px] border bg-gradient-to-br p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center gap-6 sm:gap-8 ${org.bgClass}`}
            >
              {/* Logo / Image */}
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden shrink-0 border-4 border-white shadow-lg bg-slate-50">
                <img src={org.logo} alt={org.name} className="w-full h-full object-cover" />
              </div>

              {/* Card Details */}
              <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${org.badgeBg}`}>
                    {org.type}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-100 border border-emerald-200/50 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 fill-emerald-600 text-white" /> Verified Partner
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
                  {org.name}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed mb-4 max-w-xl">
                  {org.bio}
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-1.5 text-xs text-slate-500 mb-5 font-semibold">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <strong className="text-slate-800">{org.rating}</strong> ({org.reviews} reviews)
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-purple-500" />
                    {org.address.split(',')[0]}
                  </span>
                </div>

                <Link
                  href={`/explore?q=${encodeURIComponent(org.name)}`}
                  className={`inline-flex items-center justify-center gap-2 font-black text-xs px-5 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-md hover:scale-105 active:scale-95 transition-all duration-300`}
                >
                  View Profile &amp; Events
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
