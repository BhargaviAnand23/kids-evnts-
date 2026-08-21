'use client';
import React, { useState, useRef } from 'react';
import { Search, MapPin, Calendar, Star, Map } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '../ui/Button';
import { CountUp } from '@/components/animations/CountUp';
import { LocationSelector, useSelectedLocation } from '@/components/shared/LocationSelector';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { useRouter } from 'next/navigation';

// Decorative SVG doodles — inline, no external images needed
function StarDoodle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}
function SparkDoodle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0l1.5 9.5L23 12l-9.5 1.5L12 24l-1.5-10.5L0 12l10.5-1.5z" />
    </svg>
  );
}
function DotDoodle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

export function Hero() {
  const [searchValue, setSearchValue] = useState('');
  const { selectedCity } = useSelectedLocation();
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const sectionRef = useRef<HTMLElement>(null);
  const router = useRouter();

  // Parallax Scroll Y Offsets
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  });

  const yFast = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const ySlow = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const yMid = useTransform(scrollYProgress, [0, 1], [0, -70]);

  const handleMouseMoveSection = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchValue.trim()) params.set('q', searchValue.trim());
    if (selectedCity && selectedCity !== 'All') params.set('location', selectedCity);
    router.push(`/explore?${params.toString()}`);
  };

  const headingWords = [
    { text: "Make", isGradient: false },
    { text: "Every", isGradient: false },
    { text: "Weekend", isGradient: true },
    { text: "Special!", isGradient: false },
  ];

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMoveSection}
      className="relative overflow-hidden pt-12 pb-6 md:pt-16 md:pb-8 lg:pt-20 lg:pb-10"
      style={{ background: 'linear-gradient(135deg, #ede9fe 0%, #fce7f3 40%, #fff7ed 100%)' }}
    >
      {/* ── Interactive Spotlight Glow (Desktop only) ── */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 hidden md:block"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(168, 85, 247, 0.15), transparent 80%)`,
        }}
      />

      {/* ── Parallax Scattered decorative doodles ── */}
      <motion.div style={{ y: yFast }} className="pointer-events-none absolute inset-0">
        <StarDoodle   className="absolute top-8  left-8   w-5 h-5  text-purple-400  opacity-50 animate-drift-1" />
        <SparkDoodle  className="absolute top-24 right-32 w-6 h-6  text-amber-500   opacity-50 animate-drift-2" />
        <DotDoodle    className="absolute bottom-10 right-48 w-3 h-3 text-purple-300 opacity-45 animate-drift-4" />
      </motion.div>

      <motion.div style={{ y: ySlow }} className="pointer-events-none absolute inset-0">
        <SparkDoodle  className="absolute top-16 left-24  w-4 h-4  text-amber-400   opacity-60 animate-drift-3" />
        <SparkDoodle  className="absolute top-8  right-16 w-5 h-5  text-purple-500  opacity-40 animate-drift-1" />
        <StarDoodle   className="absolute bottom-24 left-12 w-4 h-4 text-purple-400 opacity-40 animate-drift-5" />
      </motion.div>

      <motion.div style={{ y: yMid }} className="pointer-events-none absolute inset-0">
        <DotDoodle    className="absolute top-6  left-48  w-3 h-3  text-pink-400    opacity-40 animate-drift-2" />
        <DotDoodle    className="absolute top-40 right-8  w-4 h-4  text-pink-500    opacity-35 animate-drift-4" />
        <SparkDoodle  className="absolute bottom-16 left-40 w-3 h-3 text-amber-400  opacity-50 animate-drift-3" />
        <StarDoodle   className="absolute bottom-32 right-24 w-5 h-5 text-amber-500 opacity-40 animate-drift-1" />
      </motion.div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* ── Left Column ── */}
          <div className="flex-1 text-center lg:text-left">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100/80 text-purple-700 text-caption font-semibold mb-6 shadow-sm">
              <SparkDoodle className="w-4 h-4 text-purple-500" />
              <span>The #1 Youth Activity Platform</span>
            </div>

            {/* Word-by-Word Reveal Heading */}
            <h1 className="text-hero font-extrabold text-slate-900 leading-[1.15] tracking-tight mb-6 flex flex-wrap justify-center lg:justify-start gap-x-3 gap-y-1">
              {headingWords.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.12, ease: 'easeOut' }}
                  className={word.isGradient ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-500" : ""}
                >
                  {word.text}
                </motion.span>
              ))}
            </h1>

            <p className="text-slate-600 text-body-lg mb-8 max-w-2xl lg:max-w-3xl mx-auto lg:mx-0 leading-relaxed">
              Discover, book, and track top-rated sports, arts, music, and learning programs designed for children of all ages — all in one seamless place.
            </p>

            {/* Search Bar */}
            <div className="bg-white p-3 md:p-3 rounded-2xl md:rounded-full shadow-lg border border-slate-100 flex flex-col md:flex-row items-stretch md:items-center gap-0 md:gap-2 mb-10 max-w-xl lg:max-w-2xl mx-auto lg:mx-0">
              <div className="flex items-center px-4 py-3 md:py-2 w-full md:w-auto flex-1 border-b md:border-b-0 md:border-r border-slate-100">
                <Search className="w-5 h-5 text-purple-600 mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="What activity is your child into?"
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  className="w-full bg-transparent text-sm md:text-base lg:text-lg focus:outline-none text-slate-800 placeholder-slate-400"
                />
              </div>
              <div className="flex items-center px-4 py-3 md:py-2 w-full md:w-auto shrink-0 border-b md:border-b-0 border-slate-100">
                <LocationSelector variant="searchBar" className="w-full md:w-auto" />
              </div>
              <div className="pt-2 md:pt-0 w-full md:w-auto shrink-0">
                <MagneticButton className="w-full md:w-auto shrink-0">
                  <Button
                    size="lg"
                    onClick={handleSearch}
                    className="w-full md:w-auto md:ml-2 rounded-xl md:rounded-full h-12 md:h-14 px-8 text-sm md:text-base lg:text-lg shadow-md shadow-purple-500/25"
                  >
                    Search
                  </Button>
                </MagneticButton>
              </div>
            </div>

            {/* Micro Stats as Pastel Cards */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 border-t border-slate-200/60 pt-6 max-w-lg mx-auto lg:mx-0">
              <div className="flex flex-col sm:flex-row items-center p-3 rounded-2xl bg-orange-50 border border-orange-100 shadow-sm text-center sm:text-left">
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-orange-100 text-orange-700 mb-2 sm:mb-0 sm:mr-3 shrink-0">
                  <Calendar className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-sm sm:text-base lg:text-lg text-orange-950 leading-none mb-1">
                    <CountUp end={500} suffix="+" duration={1500} />
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-orange-700 font-bold uppercase tracking-wider">Events</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center p-3 rounded-2xl bg-purple-50 border border-purple-100 shadow-sm text-center sm:text-left">
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-100 text-purple-700 mb-2 sm:mb-0 sm:mr-3 shrink-0">
                  <Map className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-sm sm:text-base lg:text-lg text-purple-950 leading-none mb-1">
                    <CountUp end={120} suffix="+" duration={1500} />
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-purple-700 font-bold uppercase tracking-wider">Venues</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center p-3 rounded-2xl bg-blue-50 border border-blue-100 shadow-sm text-center sm:text-left">
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-100 text-blue-700 mb-2 sm:mb-0 sm:mr-3 shrink-0">
                  <Star className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-sm sm:text-base lg:text-lg text-blue-950 leading-none mb-1">
                    <CountUp end={4.9} decimals={1} suffix="/5" duration={1500} />
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-blue-700 font-bold uppercase tracking-wider">Rating</div>
                </div>
              </div>
            </div>

            {/* Trust Line */}
            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-500 justify-center lg:justify-start">
              <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-100">
                <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                100% Verified Organizers
              </span>
              <span className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-100">
                <svg className="w-3.5 h-3.5 text-indigo-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Secure Booking
              </span>
              <span className="flex items-center gap-1.5 bg-pink-50 text-pink-700 px-2.5 py-1 rounded-full border border-pink-100">
                <svg className="w-3.5 h-3.5 text-pink-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Flexible Cancellation
              </span>
            </div>

          </div>

          {/* ── Right Column — Photo collage ── */}
          <div className="w-full lg:w-1/2 relative h-[340px] sm:h-[420px] md:h-[480px] lg:h-[520px] xl:h-[580px] 2xl:h-[620px] mt-6 lg:mt-0 pr-2 sm:pr-4">

            {/* Main large photo */}
            <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-4/5 h-[85%] rounded-[40px] overflow-visible z-10 rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="w-full h-full rounded-[40px] overflow-hidden shadow-2xl shadow-slate-900/20 border-8 border-white/60">
                <img
                  src="https://images.unsplash.com/photo-1560184611-ff3e53f00e8f?w=1200&auto=format&fit=crop&q=80"
                  alt="Children playing in a park"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Floating card 1 — Hip Hop Dance */}
            <div className="absolute left-0 top-[10%] sm:top-[15%] w-44 sm:w-52 bg-white rounded-2xl overflow-hidden shadow-xl z-20 animate-card-float-1">
              <div className="w-full h-28 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1547153760-18fc86324498?w=400&auto=format&fit=crop&q=70"
                  alt="Hip Hop Dance"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h4 className="font-bold text-sm text-slate-900 leading-tight">Hip Hop Dance</h4>
                <p className="text-xs text-purple-600 font-semibold mt-0.5">This Weekend</p>
              </div>
            </div>

            {/* Floating card 2 — Chess Championship */}
            <div className="absolute left-[5%] sm:left-[8%] bottom-[5%] sm:bottom-[8%] w-48 sm:w-56 bg-white rounded-2xl overflow-hidden shadow-xl z-20 animate-card-float-2">
              <div className="w-full h-28 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400&auto=format&fit=crop&q=70"
                  alt="Chess Championship"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 leading-tight">Chess Championship</h4>
                  <p className="text-xs text-purple-600 font-semibold mt-0.5">Register Now</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center shrink-0 ml-2">
                  <Star className="w-4 h-4 text-white fill-current" />
                </div>
              </div>
            </div>

            {/* Floating card 3 — Swim Lessons */}
            <div className="hidden sm:block absolute right-0 bottom-[20%] w-36 bg-white rounded-2xl overflow-hidden shadow-xl z-20 animate-card-float-3">
              <div className="w-full h-24 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&auto=format&fit=crop&q=70"
                  alt="Swim Lessons"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2.5">
                <h4 className="font-bold text-xs text-slate-900 leading-tight">Swim Lessons</h4>
                <p className="text-[10px] text-purple-600 font-semibold mt-0.5">Weekly Program</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
