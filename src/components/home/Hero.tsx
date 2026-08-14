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

import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Hero() {
  const [searchValue, setSearchValue] = useState('');
  const { selectedCity } = useSelectedLocation();
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const sectionRef = useRef<HTMLElement>(null);
  const router = useRouter();

  // Featured Spotlight Carousel Slides
  const spotlightSlides = [
    {
      id: 'spotlight-soccer',
      title: 'Youth Soccer Academy',
      tag: '⚽ Active Sports',
      badge: 'Popular',
      badgeBg: 'bg-emerald-600',
      timing: 'Saturdays & Sundays',
      img: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=1000&auto=format&fit=crop&q=80',
    },
    {
      id: 'spotlight-hiphop',
      title: 'Hip Hop Dance Workshop',
      tag: '🎵 Performing Arts',
      badge: 'Trending',
      badgeBg: 'bg-rose-500',
      timing: 'This Weekend',
      img: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=1000&auto=format&fit=crop&q=80',
    },
    {
      id: 'spotlight-chess',
      title: 'Junior Chess Championship',
      tag: '♟️ Mind Sports',
      badge: '🔥 Hot',
      badgeBg: 'bg-amber-500',
      timing: 'Register Now',
      img: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=1000&auto=format&fit=crop&q=80',
    },
    {
      id: 'spotlight-swim',
      title: 'Swim & Water Safety',
      tag: '🏊 Swimming',
      badge: 'Weekly',
      badgeBg: 'bg-teal-600',
      timing: 'Weekly Program',
      img: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1000&auto=format&fit=crop&q=80',
    },
  ];

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  React.useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % spotlightSlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, spotlightSlides.length]);

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
      className="relative overflow-hidden py-14 md:py-20 lg:py-24"
      style={{ background: 'linear-gradient(135deg, #ede9fe 0%, #f472b6 35%, #fed7aa 75%, #fef08a 100%)' }}
    >
      {/* ── Interactive Spotlight Glow (Desktop only) ── */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 hidden md:block"
        style={{
          background: `radial-gradient(750px circle at ${mousePos.x}px ${mousePos.y}px, rgba(217, 70, 239, 0.2), transparent 80%)`,
        }}
      />

      {/* ── Parallax Scattered decorative doodles ── */}
      <motion.div style={{ y: yFast }} className="pointer-events-none absolute inset-0">
        <StarDoodle   className="absolute top-8  left-8   w-6 h-6  text-purple-500  opacity-60 rotate-12" />
        <SparkDoodle  className="absolute top-24 right-32 w-7 h-7  text-amber-500   opacity-65 rotate-45" />
        <DotDoodle    className="absolute bottom-10 right-48 w-4 h-4 text-purple-400 opacity-55" />
      </motion.div>

      <motion.div style={{ y: ySlow }} className="pointer-events-none absolute inset-0">
        <SparkDoodle  className="absolute top-16 left-24  w-5 h-5  text-orange-500  opacity-70 -rotate-6" />
        <SparkDoodle  className="absolute top-8  right-16 w-6 h-6  text-purple-600  opacity-50 rotate-12" />
        <StarDoodle   className="absolute bottom-24 left-12 w-5 h-5 text-rose-500   opacity-50 -rotate-12" />
      </motion.div>

      <motion.div style={{ y: yMid }} className="pointer-events-none absolute inset-0">
        <DotDoodle    className="absolute top-6  left-48  w-4 h-4  text-pink-500    opacity-50" />
        <DotDoodle    className="absolute top-40 right-8  w-4 h-4  text-amber-500   opacity-45" />
        <SparkDoodle  className="absolute bottom-16 left-40 w-4 h-4 text-amber-500  opacity-60" />
        <StarDoodle   className="absolute bottom-32 right-24 w-6 h-6 text-orange-500 opacity-55 rotate-20" />
      </motion.div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">

          {/* ── Left Column (58% on desktop) ── */}
          <div className="w-full lg:w-[58%] text-center lg:text-left">

            {/* Parent Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-purple-800 text-caption font-extrabold mb-6 shadow-md border border-white/60">
              <SparkDoodle className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>The #1 Youth Activity Marketplace</span>
              <span className="hidden sm:inline text-purple-300">•</span>
              <span className="hidden sm:inline text-emerald-700 font-extrabold">✓ 100% Verified Organizers</span>
            </div>

            {/* Word-by-Word Reveal Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.08] tracking-tight mb-6 flex flex-wrap justify-center lg:justify-start gap-x-3.5 gap-y-1">
              <motion.span
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
              >
                Find Their Next
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.22, ease: 'easeOut' }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-pink-600 to-orange-500 font-black drop-shadow-xs"
              >
                Big Adventure
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.34, ease: 'easeOut' }}
              >
                ✨
              </motion.span>
            </h1>

            <p className="text-slate-800 text-body-lg mb-8 max-w-2xl lg:max-w-2xl mx-auto lg:mx-0 leading-relaxed font-semibold">
              Discover, book, and track verified sports, arts, music, STEM courses, and competitions designed for your child’s unique journey.
            </p>

            {/* Search Bar + Location */}
            <div className="bg-white/95 backdrop-blur-md p-2.5 md:p-3 rounded-2xl md:rounded-full shadow-2xl shadow-purple-900/15 border border-white flex flex-col md:flex-row items-stretch md:items-center gap-0 md:gap-2 mb-6 max-w-xl lg:max-w-2xl mx-auto lg:mx-0">
              <div className="flex items-center px-4 py-3 md:py-2 w-full md:w-auto flex-1 border-b md:border-b-0 md:border-r border-slate-100">
                <Search className="w-5 h-5 text-purple-600 mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search sports, arts, coding, swimming..."
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  className="w-full bg-transparent text-sm md:text-base lg:text-lg focus:outline-none text-slate-900 placeholder-slate-400 font-bold"
                />
              </div>
              <div className="flex items-center px-4 py-3 md:py-2 w-full md:w-auto shrink-0 border-b md:border-b-0 border-slate-100">
                <LocationSelector variant="searchBar" className="w-full md:w-auto" />
              </div>
              <div className="pt-2 md:pt-0 w-full md:w-auto shrink-0">
                <Button
                  size="lg"
                  onClick={handleSearch}
                  className="w-full md:w-auto md:ml-1 rounded-xl md:rounded-full h-12 md:h-13 px-8 text-sm md:text-base lg:text-base font-black bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-amber-500 hover:to-rose-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-amber-500/30 transition-all duration-300 cursor-pointer"
                >
                  Explore
                </Button>
              </div>
            </div>

            {/* CTAs & Quick Age Filter Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/categories')}
                className="rounded-full border-purple-300 bg-white/80 hover:bg-purple-600 hover:text-white text-purple-800 font-extrabold px-4 py-2 text-micro shadow-xs transition-all"
              >
                Browse Categories →
              </Button>
              <div className="h-4 w-px bg-slate-400/50 hidden sm:block" />
              <span className="text-micro font-extrabold text-slate-700 uppercase tracking-wider hidden sm:inline">Age:</span>
              {[
                { label: 'All Ages', val: '' },
                { label: '2-5 yrs', val: 'early_years' },
                { label: '6-10 yrs', val: 'kids' },
                { label: '11-16 yrs', val: 'teens' },
              ].map(pill => (
                <button
                  key={pill.label}
                  onClick={() => router.push(pill.val ? `/explore?age_bracket=${pill.val}` : '/explore')}
                  className="px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-gradient-to-r hover:from-purple-600 hover:to-amber-500 hover:text-white text-slate-800 text-micro font-extrabold border border-purple-200/60 shadow-xs transition-all duration-200 cursor-pointer"
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* ── Stats Highlight Bar with Animated CountUp ── */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 pt-6 border-t border-purple-900/10 max-w-xl mx-auto lg:mx-0">
              <div className="bg-white/85 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/90 shadow-lg shadow-purple-500/10 flex flex-col items-center lg:items-start group hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">
                    <CountUp end={500} suffix="+" />
                  </span>
                </div>
                <span className="text-micro font-extrabold text-purple-900 uppercase tracking-wider">Active Events</span>
              </div>

              <div className="bg-white/85 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/90 shadow-lg shadow-amber-500/10 flex flex-col items-center lg:items-start group hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-xs">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">
                    <CountUp end={120} suffix="+" />
                  </span>
                </div>
                <span className="text-micro font-extrabold text-amber-950 uppercase tracking-wider">Top Venues</span>
              </div>

              <div className="bg-white/85 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/90 shadow-lg shadow-emerald-500/10 flex flex-col items-center lg:items-start group hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-xs">
                    <Star className="w-4 h-4 fill-white text-white" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">
                    4.9<span className="text-emerald-600 text-lg sm:text-xl font-black">★</span>
                  </span>
                </div>
                <span className="text-micro font-extrabold text-emerald-950 uppercase tracking-wider">Parent Rating</span>
              </div>
            </div>

          </div>

          {/* ── Right Column (42% on desktop) ── */}
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="w-full lg:w-[42%] relative h-[420px] sm:h-[500px] md:h-[540px] lg:h-[580px] xl:h-[620px] mt-6 lg:mt-0 group/hero-carousel px-2 sm:px-0"
          >
            {/* 1. Main Hero Spotlight Card */}
            <div className="w-full h-full rounded-[36px] overflow-hidden shadow-2xl shadow-purple-950/40 border-[8px] border-white relative z-10 bg-slate-900">
              {/* Background Image with Fade Transition */}
              <div key={activeSlide} className="w-full h-full relative transition-opacity duration-500">
                <img
                  src={spotlightSlides[activeSlide].img}
                  alt={spotlightSlides[activeSlide].title}
                  className="w-full h-full object-cover"
                />

                {/* Top Category Badge */}
                <div className="absolute top-5 left-5 z-20">
                  <span className={`px-3.5 py-1.5 rounded-full text-white text-xs font-black uppercase tracking-wider shadow-lg ${spotlightSlides[activeSlide].badgeBg}`}>
                    {spotlightSlides[activeSlide].badge}
                  </span>
                </div>

                {/* Bottom Content Gradient Banner */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-6 sm:p-8 text-white z-20">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300 mb-1.5 block">
                    {spotlightSlides[activeSlide].tag}
                  </span>
                  <h3 className="font-black text-xl sm:text-2xl text-white leading-tight mb-1">
                    {spotlightSlides[activeSlide].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-semibold">
                    {spotlightSlides[activeSlide].timing}
                  </p>
                </div>
              </div>

              {/* Navigation Left Arrow */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSlide(prev => (prev === 0 ? spotlightSlides.length - 1 : prev - 1));
                }}
                aria-label="Previous Spotlight Slide"
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/80 text-white hover:bg-purple-600 hover:scale-110 flex items-center justify-center transition-all opacity-80 sm:opacity-0 group-hover/hero-carousel:opacity-100 cursor-pointer shadow-lg border border-white/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Navigation Right Arrow */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSlide(prev => (prev + 1) % spotlightSlides.length);
                }}
                aria-label="Next Spotlight Slide"
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/80 text-white hover:bg-purple-600 hover:scale-110 flex items-center justify-center transition-all opacity-80 sm:opacity-0 group-hover/hero-carousel:opacity-100 cursor-pointer shadow-lg border border-white/20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Slide Dot Indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-slate-950/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-md">
                {spotlightSlides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      activeSlide === idx ? 'w-6 bg-amber-400' : 'w-2 bg-white/50 hover:bg-white'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* 2. Floating "Up Next" Dynamic Accent Card (Positioned top-left, zero text overlap) */}
            <div
              onClick={() => setActiveSlide((activeSlide + 1) % spotlightSlides.length)}
              className="absolute -left-3 sm:-left-8 top-6 sm:top-8 z-30 w-52 sm:w-60 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-white shadow-2xl cursor-pointer hover:scale-105 transition-all duration-300 group/upnext"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 relative border border-slate-200">
                  <img
                    src={spotlightSlides[(activeSlide + 1) % spotlightSlides.length].img}
                    alt="Up Next Event"
                    className="w-full h-full object-cover group-hover/upnext:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600">Up Next</span>
                    <span className="text-[10px] text-amber-500 font-black">▶</span>
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-900 truncate leading-tight mt-0.5">
                    {spotlightSlides[(activeSlide + 1) % spotlightSlides.length].title}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-500 truncate mt-0.5">
                    {spotlightSlides[(activeSlide + 1) % spotlightSlides.length].timing}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
