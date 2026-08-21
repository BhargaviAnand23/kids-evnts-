'use client';
import React, { useState, useRef } from 'react';
import { Search, MapPin, Calendar, Star, Map, Heart } from 'lucide-react';
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

  return (    <section
      ref={sectionRef}
      onMouseMove={handleMouseMoveSection}
      className="relative overflow-hidden pt-12 pb-6 md:pt-16 md:pb-8 lg:pt-20 lg:pb-10 bg-gradient-to-br from-violet-100 via-pink-50 to-orange-50/70"
    >
      {/* ── Background Grid & Decorative Elements ── */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      {/* ── Interactive Spotlight Glow (Desktop only) ── */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 hidden md:block"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.15), transparent 80%)`,
        }}
      />

      {/* ── Parallax Scattered decorative doodles ── */}
      <motion.div style={{ y: yFast }} className="pointer-events-none absolute inset-0">
        <StarDoodle   className="absolute top-8  left-8   w-6 h-6  text-purple-400/60  opacity-60 animate-drift-1" />
        <SparkDoodle  className="absolute top-24 right-32 w-7 h-7  text-amber-500/60   opacity-60 animate-drift-2" />
        <DotDoodle    className="absolute bottom-10 right-48 w-3 h-3 text-purple-300 opacity-60 animate-drift-4" />
      </motion.div>

      <motion.div style={{ y: ySlow }} className="pointer-events-none absolute inset-0">
        <SparkDoodle  className="absolute top-16 left-24  w-5 h-5  text-amber-400/70   opacity-70 animate-drift-3" />
        <SparkDoodle  className="absolute top-8  right-16 w-6 h-6  text-purple-500/50  opacity-50 animate-drift-1" />
        <StarDoodle   className="absolute bottom-24 left-12 w-5 h-5 text-purple-400/50 opacity-50 animate-drift-5" />
      </motion.div>

      <motion.div style={{ y: yMid }} className="pointer-events-none absolute inset-0">
        <DotDoodle    className="absolute top-6  left-48  w-3.5 h-3.5  text-pink-400/50    opacity-50 animate-drift-2" />
        <DotDoodle    className="absolute top-40 right-8  w-4.5 h-4.5  text-pink-500/50    opacity-50 animate-drift-4" />
        <SparkDoodle  className="absolute bottom-16 left-40 w-4 h-4 text-amber-400/60  opacity-60 animate-drift-3" />
        <StarDoodle   className="absolute bottom-32 right-24 w-6 h-6 text-amber-500/50 opacity-50 animate-drift-1" />
      </motion.div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* ── Left Column ── */}
          <div className="flex-1 text-center lg:text-left">

            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-4.5 py-2.5 rounded-full bg-white/70 backdrop-blur-md border border-purple-500/20 text-purple-800 text-caption font-bold mb-6 shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <span className="tracking-wide">THE #1 YOUTH ACTIVITY HUB</span>
            </div>

            {/* Word-by-Word Reveal Heading */}
            <h1 className="text-hero font-extrabold text-slate-900 leading-[1.12] tracking-tight mb-6 flex flex-wrap justify-center lg:justify-start gap-x-3 gap-y-1">
              {headingWords.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.12, ease: 'easeOut' }}
                  className={word.isGradient ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 font-black" : ""}
                >
                  {word.text}
                </motion.span>
              ))}
            </h1>

            <p className="text-slate-600 text-body-lg mb-8 max-w-2xl lg:max-w-3xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Discover, book, and track top-rated sports, arts, music, and learning programs designed for children of all ages — all in one seamless place.
            </p>

            {/* Search Bar */}
            <div className="bg-white/80 backdrop-blur-xl p-2.5 rounded-3xl md:rounded-full shadow-2xl shadow-purple-950/5 border border-white/60 flex flex-col md:flex-row items-stretch md:items-center gap-1.5 mb-10 max-w-xl lg:max-w-2xl mx-auto lg:mx-0 hover:border-purple-300 hover:shadow-purple-500/10 transition-all duration-300">
              <div className="flex items-center px-4 py-3 md:py-2 w-full md:w-auto flex-1 border-b md:border-b-0 md:border-r border-slate-100/80">
                <Search className="w-5 h-5 text-purple-600 mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="What activity is your child into?"
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  className="w-full bg-transparent text-sm md:text-base lg:text-lg focus:outline-none text-slate-800 placeholder-slate-400 font-semibold"
                />
              </div>
              <div className="flex items-center px-4 py-3 md:py-2 w-full md:w-auto shrink-0">
                <LocationSelector variant="searchBar" className="w-full md:w-auto" />
              </div>
              <div className="pt-2 md:pt-0 w-full md:w-auto shrink-0">
                <MagneticButton className="w-full md:w-auto shrink-0">
                  <Button
                    size="lg"
                    onClick={handleSearch}
                    className="w-full md:w-auto md:ml-2 rounded-2xl md:rounded-full h-12 md:h-14 px-8 text-sm md:text-base lg:text-lg font-bold shadow-lg bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-purple-500/25 transition-transform active:scale-95 duration-150"
                  >
                    Search
                  </Button>
                </MagneticButton>
              </div>
            </div>

            {/* Micro Stats as Pastel Cards */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 border-t border-slate-200/60 pt-6 max-w-lg mx-auto lg:mx-0">
              <div className="flex flex-col sm:flex-row items-center p-3 rounded-2xl bg-orange-50 border border-orange-100 shadow-sm text-center sm:text-left transition-all hover:scale-[1.03] duration-300">
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
              <div className="flex flex-col sm:flex-row items-center p-3 rounded-2xl bg-purple-50 border border-purple-100 shadow-sm text-center sm:text-left transition-all hover:scale-[1.03] duration-300">
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
              <div className="flex flex-col sm:flex-row items-center p-3 rounded-2xl bg-blue-50 border border-blue-100 shadow-sm text-center sm:text-left transition-all hover:scale-[1.03] duration-300">
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

          {/* ── Right Column — Custom SVG Illustration & Overlapping Cards ── */}
          <div className="w-full lg:w-1/2 relative h-[360px] sm:h-[450px] md:h-[500px] lg:h-[540px] xl:h-[600px] mt-6 lg:mt-0 pr-2 sm:pr-4 flex items-center justify-center">
            
            {/* Background Blob Glows */}
            <div className="absolute top-[10%] right-[-5%] w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] bg-pink-300/30 rounded-full blur-3xl -z-10 animate-pulse duration-[6000ms]" />
            <div className="absolute bottom-[5%] left-[-10%] w-[280px] sm:w-[400px] h-[280px] sm:h-[400px] bg-purple-300/25 rounded-full blur-3xl -z-10 animate-pulse duration-[8000ms]" />
            <div className="absolute top-[40%] left-[20%] w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-emerald-200/20 rounded-full blur-3xl -z-10" />

            {/* Custom SVG Illustration Container */}
            <div className="w-full h-full max-w-[450px] sm:max-w-[480px] lg:max-w-[500px] aspect-square relative z-10 flex items-center justify-center">
              <svg viewBox="0 0 500 500" className="w-full h-full select-none drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#FEF3C7" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="balloon-grad" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#FF8A8A" />
                    <stop offset="100%" stopColor="#F43F5E" />
                  </radialGradient>
                  <linearGradient id="hill-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#34D399" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="hill-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6EE7B7" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                  <linearGradient id="sky-grad" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#BAE6FD" />
                    <stop offset="50%" stopColor="#E0F2FE" />
                    <stop offset="100%" stopColor="#F0F9FF" />
                  </linearGradient>
                  <linearGradient id="rainbow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FB7185" stopOpacity="0.3" />
                    <stop offset="35%" stopColor="#F43F5E" stopOpacity="0.3" />
                    <stop offset="70%" stopColor="#C084FC" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.3" />
                  </linearGradient>
                  <filter id="illustration-shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#312E81" floodOpacity="0.15" />
                  </filter>
                </defs>

                {/* Sky background circle with outline */}
                <circle cx="250" cy="250" r="235" fill="url(#sky-grad)" stroke="#E2E8F0" strokeWidth="4" />
                {/* Dotted radial grid behind sky */}
                <circle cx="250" cy="250" r="210" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="6 8" opacity="0.5" />

                {/* Rainbow Arc in background */}
                <path d="M 75,320 A 190,190 0 0,1 425,320" stroke="url(#rainbow-grad)" strokeWidth="24" fill="none" strokeLinecap="round" />

                {/* Sun with radiating rays */}
                <circle cx="370" cy="120" r="60" fill="url(#sun-glow)" />
                <circle cx="370" cy="120" r="32" fill="#FBBF24" />
                <path d="M 370,80 L 370,72 M 370,160 L 370,168 M 330,120 L 322,120 M 410,120 L 418,120 M 342,92 L 336,86 M 398,148 L 404,154 M 342,148 L 336,154 M 398,92 L 404,86" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />

                {/* Stylized clouds with shadow */}
                <g filter="url(#illustration-shadow)" opacity="0.95">
                  <path d="M 100,150 Q 115,135 135,140 Q 150,125 170,135 Q 190,135 195,150 Q 210,155 205,170 Q 195,180 170,180 L 120,180 Q 95,180 100,150 Z" fill="#FFFFFF" />
                  <path d="M 380,200 Q 392,190 405,193 Q 418,180 430,190 Q 442,190 445,200 Q 455,205 450,215 Q 442,225 420,225 L 390,225 Q 375,225 380,200 Z" fill="#FFFFFF" opacity="0.85" />
                </g>

                {/* Distant mountains / Hills */}
                <path d="M -10,380 Q 140,230 290,300 T 510,330 L 510,510 L -10,510 Z" fill="url(#hill-grad-1)" />

                {/* Playground Slide */}
                <g strokeLinejoin="round" strokeLinecap="round">
                  {/* Slide Ladder/Poles */}
                  <path d="M 60,330 L 105,240 M 80,330 L 80,290 M 105,240 L 105,380" stroke="#94A3B8" strokeWidth="4" />
                  {/* Ladder Steps */}
                  <path d="M 70,310 L 82,310 M 78,290 L 90,290 M 87,270 L 98,270 M 96,250 L 106,250" stroke="#64748B" strokeWidth="3" />
                  {/* Slide Board */}
                  <path d="M 105,240 L 120,240 Q 165,310 200,380" stroke="#F43F5E" strokeWidth="12" fill="none" />
                  <path d="M 105,244 L 120,244 Q 165,314 200,384" stroke="#FB7185" strokeWidth="8" fill="none" />
                  <circle cx="105" cy="240" r="6" fill="#FBBF24" />
                </g>

                {/* Front Rolling Hills */}
                <path d="M -10,420 Q 170,290 330,340 T 510,400 L 510,510 L -10,510 Z" fill="url(#hill-grad-2)" />

                {/* Bouncing Ball */}
                <g filter="url(#illustration-shadow)">
                  <circle cx="340" cy="425" r="20" fill="#FB923C" />
                  <path d="M 324,417 A 20,20 0 0,0 356,433" stroke="#FFFFFF" strokeWidth="4.5" fill="none" />
                  <path d="M 330,410 Q 340,425 350,440" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="3 3" fill="none" />
                </g>

                {/* Stylized Flowers */}
                <g fill="#F43F5E">
                  <circle cx="70" cy="440" r="7" /> <circle cx="64" cy="445" r="5" /> <circle cx="76" cy="445" r="5" /> <circle cx="70" cy="450" r="5" />
                  <circle cx="70" cy="445" r="3" fill="#FBBF24" />
                </g>
                <g fill="#A855F7">
                  <circle cx="430" cy="430" r="7" /> <circle cx="424" cy="435" r="5" /> <circle cx="436" cy="435" r="5" /> <circle cx="430" cy="440" r="5" />
                  <circle cx="430" cy="435" r="3" fill="#FBBF24" />
                </g>

                {/* Balloon floating from hand */}
                <g filter="url(#illustration-shadow)">
                  {/* Balloon String */}
                  <path d="M 165,225 Q 150,170 135,110 Q 120,60 145,25" stroke="#94A3B8" strokeWidth="2.5" strokeDasharray="2 2" fill="none" />
                  {/* Balloon Connection */}
                  <path d="M 143,23 L 147,27 L 141,27 Z" fill="#F43F5E" />
                  {/* Balloon Body */}
                  <ellipse cx="145" cy="5" rx="20" ry="24" fill="url(#balloon-grad)" />
                  {/* Highlight */}
                  <ellipse cx="138" cy="-3" rx="5" ry="8" fill="#FFFFFF" opacity="0.4" transform="rotate(-15 138 -3)" />
                </g>

                {/* JOYFUL CHILD CHARACTER (Jumping in joy) */}
                <g filter="url(#illustration-shadow)">
                  {/* Motion lines behind character */}
                  <path d="M 230,420 L 230,435 M 270,420 L 270,435 M 250,425 L 250,440" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" opacity="0.6" />
                  {/* Shadow beneath character (Smaller because they are high in the air) */}
                  <ellipse cx="250" cy="440" rx="24" ry="6" fill="#065F46" opacity="0.3" />

                  {/* Left Leg (bent, jumping) */}
                  <path d="M 232,380 L 215,410 L 200,405" stroke="#FDBA74" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  {/* Left Shoe */}
                  <path d="M 200,405 L 192,408 C 187,410 185,402 192,398 L 202,398 Z" fill="#7C3AED" />

                  {/* Right Leg (extended, jumping) */}
                  <path d="M 268,380 L 285,415 L 302,420" stroke="#FDBA74" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  {/* Right Shoe */}
                  <path d="M 302,420 L 312,423 C 317,425 319,417 312,413 L 302,413 Z" fill="#7C3AED" />

                  {/* Torso (Jumping posture, pink hoodie) */}
                  <rect x="220" y="290" width="60" height="95" rx="22" fill="#FB7185" />
                  {/* Hoodie Pocket */}
                  <path d="M 230,350 L 270,350 L 265,370 L 235,370 Z" fill="#F43F5E" opacity="0.8" />
                  {/* Collar / Neck */}
                  <path d="M 238,290 C 238,298 262,298 262,290" stroke="#FDBA74" strokeWidth="4" fill="none" />

                  {/* Left Arm (Holding string) */}
                  <path d="M 220,310 Q 185,270 165,225" stroke="#FDBA74" strokeWidth="12" strokeLinecap="round" fill="none" />
                  {/* Left Hand */}
                  <circle cx="165" cy="225" r="8" fill="#FDBA74" />

                  {/* Right Arm (Raised high in triumph) */}
                  <path d="M 280,310 Q 320,260 335,215" stroke="#FDBA74" strokeWidth="12" strokeLinecap="round" fill="none" />
                  {/* Right Hand */}
                  <circle cx="335" cy="215" r="8" fill="#FDBA74" />

                  {/* Head */}
                  <circle cx="250" cy="235" r="32" fill="#FDBA74" />

                  {/* Rosy Cheeks */}
                  <circle cx="228" cy="242" r="5.5" fill="#F43F5E" opacity="0.6" />
                  <circle cx="272" cy="242" r="5.5" fill="#F43F5E" opacity="0.6" />

                  {/* Smile (Big joyful mouth showing teeth) */}
                  <path d="M 238,245 C 238,258 262,258 262,245 Z" fill="#4C1D95" />
                  <path d="M 242,246 C 242,250 258,250 258,246 Z" fill="#FFFFFF" />

                  {/* Eyes (Happy arch lines) */}
                  <path d="M 234,233 Q 240,229 242,235" stroke="#4C1D95" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                  <path d="M 258,233 Q 260,229 266,235" stroke="#4C1D95" strokeWidth="3.5" strokeLinecap="round" fill="none" />

                  {/* Messy Kid Hair & Cap */}
                  {/* Cap base */}
                  <path d="M 218,225 C 218,198 282,198 282,225 Z" fill="#8B5CF6" />
                  {/* Cap brim/visor */}
                  <path d="M 215,225 C 210,225 210,215 235,215 Z" fill="#7C3AED" />
                  {/* Cap button */}
                  <circle cx="250" cy="205" r="4.5" fill="#FBBF24" />
                  {/* Stylized messy hair peeking out */}
                  <path d="M 216,225 C 216,232 222,235 224,230" stroke="#4C1D95" strokeWidth="4" strokeLinecap="round" />
                  <path d="M 284,225 C 284,232 278,235 276,230" stroke="#4C1D95" strokeWidth="4" strokeLinecap="round" />
                </g>

                {/* JOYFUL PUPPY RUNNING ALONGSIDE */}
                <g filter="url(#illustration-shadow)">
                  {/* Puppy shadow */}
                  <ellipse cx="370" cy="442" rx="20" ry="5" fill="#065F46" opacity="0.3" />
                  
                  {/* Torso (Amber/Yellow body) */}
                  <rect x="350" y="405" width="36" height="24" rx="10" fill="#FBBF24" />
                  
                  {/* Legs */}
                  <path d="M 356,425 L 354,438 M 362,425 L 364,438 M 374,425 L 372,438 M 380,425 L 382,438" stroke="#FBBF24" strokeWidth="5.5" strokeLinecap="round" />
                  {/* Puppy Shoes / Paws */}
                  <circle cx="354" cy="438" r="3.5" fill="#4C1D95" />
                  <circle cx="364" cy="438" r="3.5" fill="#4C1D95" />
                  <circle cx="372" cy="438" r="3.5" fill="#4C1D95" />
                  <circle cx="382" cy="438" r="3.5" fill="#4C1D95" />

                  {/* Head */}
                  <circle cx="385" cy="400" r="13" fill="#FBBF24" />
                  
                  {/* Floppy Ear */}
                  <path d="M 378,395 Q 370,402 374,412" stroke="#D97706" strokeWidth="6" strokeLinecap="round" fill="none" />
                  
                  {/* Snout & Nose --> */}
                  <path d="M 390,402 Q 396,402 396,400" stroke="#4C1D95" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                  <circle cx="396" cy="400" r="2.5" fill="#4C1D95" />

                  {/* Eye (Happy arc) */}
                  <path d="M 382,396 Q 385,393 386,396" stroke="#4C1D95" strokeWidth="2" strokeLinecap="round" fill="none" />
                  
                  {/* Tail (Wagging, curved up) */}
                  <path d="M 350,410 Q 338,400 342,390" stroke="#FBBF24" strokeWidth="5.5" strokeLinecap="round" fill="none" />
                  {/* Wag lines */}
                  <path d="M 334,392 L 338,390 M 338,382 L 342,384" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                </g>

                {/* Stars & Confetti Celebrations */}
                <g fill="#FBBF24">
                  {/* Star 1 */}
                  <path d="M 250,60 L 253,67 L 260,68 L 255,73 L 256,80 L 250,76 L 244,80 L 245,73 L 240,68 L 247,67 Z" />
                  {/* Star 2 */}
                  <path d="M 90,260 L 92,264 L 97,265 L 93,269 L 94,274 L 90,271 L 86,274 L 87,269 L 83,265 L 88,264 Z" />
                  {/* Star 3 */}
                  <path d="M 400,280 L 402,284 L 407,285 L 403,289 L 404,294 L 400,291 L 396,294 L 397,289 L 393,285 L 398,284 Z" opacity="0.8" />
                </g>
                <g fill="#F43F5E">
                  {/* Confetti Dot 1 */}
                  <circle cx="180" cy="100" r="4.5" />
                  {/* Confetti Dot 2 */}
                  <circle cx="310" cy="70" r="4" />
                </g>
                <g fill="#10B981">
                  {/* Confetti Dot 3 */}
                  <circle cx="280" cy="180" r="5" />
                  {/* Confetti Dot 4 */}
                  <circle cx="200" cy="270" r="4" />
                </g>
                <g fill="#38BDF8">
                  {/* Confetti Dot 5 */}
                  <circle cx="330" cy="260" r="4.5" />
                </g>
              </svg>
            </div>

            {/* Overlapping Floating sticker cards */}
            
            {/* Floating card 1 — Hip Hop Dance */}
            <div className="absolute left-[-16px] sm:left-0 top-[8%] sm:top-[12%] w-40 sm:w-48 bg-white rounded-2xl overflow-hidden shadow-2xl z-20 animate-card-float-1 rotate-[-6deg] hover:rotate-0 hover:scale-105 transition-all duration-300 border border-white/80 backdrop-blur-md">
              <button className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors z-30">
                <Heart className="w-3.5 h-3.5 fill-current" />
              </button>
              <div className="w-full h-24 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1547153760-18fc86324498?w=400&auto=format&fit=crop&q=70"
                  alt="Hip Hop Dance"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">Hip Hop Dance</h4>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px] sm:text-xs text-purple-600 font-bold">This Weekend</p>
                  <span className="text-[9px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded-full font-bold">★ 4.8</span>
                </div>
              </div>
            </div>

            {/* Floating card 2 — Chess Championship */}
            <div className="absolute left-[-10px] bottom-[3%] sm:bottom-[6%] w-44 sm:w-52 bg-white rounded-2xl overflow-hidden shadow-2xl z-20 animate-card-float-2 rotate-[4deg] hover:rotate-0 hover:scale-105 transition-all duration-300 border border-white/80 backdrop-blur-md">
              <button className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors z-30">
                <Heart className="w-3.5 h-3.5 fill-current" />
              </button>
              <div className="w-full h-24 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400&auto=format&fit=crop&q=70"
                  alt="Chess Championship"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2.5">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">Chess Tournament</h4>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px] sm:text-xs text-amber-600 font-bold">Register Now</p>
                  <span className="text-[9px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-full font-bold">★ 4.9</span>
                </div>
              </div>
            </div>

            {/* Floating card 3 — Swim Lessons */}
            <div className="hidden sm:block absolute right-[-10px] sm:right-0 top-[38%] w-32 sm:w-36 bg-white rounded-2xl overflow-hidden shadow-2xl z-20 animate-card-float-3 rotate-[8deg] hover:rotate-0 hover:scale-105 transition-all duration-300 border border-white/80 backdrop-blur-md">
              <button className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors z-30">
                <Heart className="w-3.5 h-3.5 fill-current" />
              </button>
              <div className="w-full h-20 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&auto=format&fit=crop&q=70"
                  alt="Swim Lessons"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2">
                <h4 className="font-bold text-[11px] sm:text-xs text-slate-900 leading-tight">Swim Lessons</h4>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[9px] sm:text-[10px] text-blue-600 font-bold">Weekly</p>
                  <span className="text-[8px] bg-blue-50 text-blue-700 px-1 py-0.5 rounded-full font-bold">★ 4.7</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
