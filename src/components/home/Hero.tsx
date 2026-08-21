'use client';
import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  ArrowRight, 
  Play, 
  Grid, 
  ChevronDown, 
  ShieldCheck, 
  Lock, 
  Heart,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { LocationSelector, useSelectedLocation } from '@/components/shared/LocationSelector';

// 3D Isometric & Glossy SVG Icons for the 5 Category Cards
function Soccer3DIcon() {
  return (
    <svg className="w-12 h-12 drop-shadow-md" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="28" fill="url(#soccerBallGrad)" stroke="#e2e8f0" strokeWidth="2" />
      <polygon points="32,20 23,27 26,38 38,38 41,27" fill="#1e293b" />
      <polygon points="32,4 27,10 32,20 37,10" fill="#334155" opacity="0.9" />
      <polygon points="4,24 10,21 23,27 18,36" fill="#334155" opacity="0.9" />
      <polygon points="12,56 12,48 26,38 29,48" fill="#334155" opacity="0.9" />
      <polygon points="52,56 52,48 38,38 35,48" fill="#334155" opacity="0.9" />
      <polygon points="60,24 54,21 41,27 46,36" fill="#334155" opacity="0.9" />
      <defs>
        <radialGradient id="soccerBallGrad" cx="30%" cy="25%" r="75%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function Palette3DIcon() {
  return (
    <svg className="w-12 h-12 drop-shadow-md" viewBox="0 0 64 64" fill="none">
      <path 
        d="M32 6C17.6 6 6 17.6 6 32c0 14.4 11.6 26 26 26 5.8 0 9-4.2 9-8 0-3.2-2.2-5.4-2.2-8 0-3 2.5-5 5.5-5H52c6.6 0 12-5.4 12-12C64 15.6 49.6 6 32 6z" 
        fill="url(#paletteWoodGrad)" 
        stroke="#ea580c" 
        strokeWidth="1.5" 
      />
      <circle cx="20" cy="22" r="4.5" fill="#ef4444" />
      <circle cx="32" cy="16" r="4.5" fill="#f59e0b" />
      <circle cx="44" cy="22" r="4.5" fill="#10b981" />
      <circle cx="18" cy="36" r="4.5" fill="#3b82f6" />
      <circle cx="26" cy="46" r="4.5" fill="#8b5cf6" />
      {/* Wooden brush */}
      <path d="M48 36l10 16c1 1.6.5 3.6-1.1 4.6s-3.6.5-4.6-1.1L42 39l6-3z" fill="#78350f" />
      <path d="M57 53c1 1.6.5 3.6-1.1 4.6-1.6 1-3.6.5-4.6-1.1l2-2 3.7-1.5z" fill="#ec4899" />
      <defs>
        <linearGradient id="paletteWoodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffedd5" />
          <stop offset="100%" stopColor="#fed7aa" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Dance3DIcon() {
  return (
    <svg className="w-12 h-12 drop-shadow-md" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="12" r="7" fill="#a855f7" />
      <path d="M30 20c-4 0-8 3-8 8v6l-8-3c-1.5-.6-3 .2-3.6 1.7-.6 1.5.2 3 1.7 3.6l12 5c1 .4 2.1.2 2.9-.5l7-6v14l-8 10c-1 1.3-.8 3.2.5 4.2 1.3 1 3.2.8 4.2-.5l9.3-11.6L54 60c1 1.3 2.9 1.5 4.2.5 1.3-1 1.5-2.9.5-4.2l-10.7-14V28c0-4.4-3.6-8-8-8h-10z" fill="url(#dancePurpleGrad)" />
      <path d="M42 22l6-4c1.3-.9 3.1-.6 4 .7s.6 3.1-.7 4l-7 4.7-2.3-5.4z" fill="#c084fc" />
      <defs>
        <linearGradient id="dancePurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9333ea" />
          <stop offset="100%" stopColor="#7e22ce" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Swimming3DIcon() {
  return (
    <svg className="w-12 h-12 drop-shadow-md" viewBox="0 0 64 64" fill="none">
      <circle cx="38" cy="18" r="6" fill="#38bdf8" />
      <path d="M10 36c5-3 11-3 16 0s11 3 16 0 11-3 16 0" stroke="#0284c7" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M6 46c5-3 11-3 16 0s11 3 16 0 11-3 16 0" stroke="#38bdf8" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M22 28c3-3 8-5 13-4l9 3c1.5.5 2.5 2 2 3.5s-2 2.5-3.5 2l-7-2.3-5 3.3-8 1.5c-1.6.3-3.2-.7-3.5-2.3-.3-1.6.7-3.2 2.3-3.5" fill="#0369a1" />
    </svg>
  );
}

function Chess3DIcon() {
  return (
    <svg className="w-12 h-12 drop-shadow-md" viewBox="0 0 64 64" fill="none">
      {/* Dark King Piece */}
      <path d="M26 12h4v-4h-4V4h-4v4h-4v4h4v4h4v-4z" fill="#1e293b" />
      <path d="M14 20c0-2 4-4 8-4s8 2 8 4-3 12-3 20h-10c0-8-3-18-3-20z" fill="#334155" />
      <path d="M11 44h22v6H11v-6z" fill="#1e293b" />
      <path d="M9 50h26v6H9v-6z" fill="#0f172a" />
      {/* Light Wooden Pawn Piece */}
      <circle cx="44" cy="24" r="6" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" />
      <path d="M38 32c0-2 3-3 6-3s6 1 6 3-2 10-2 16H39c0-6-1-14-1-16z" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
      <path d="M35 48h18v5H35v-5z" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" />
      <path d="M33 53h22v5H33v-5z" fill="#fcd34d" stroke="#b45309" strokeWidth="1.5" />
    </svg>
  );
}

export function Hero() {
  const [searchValue, setSearchValue] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('All');
  const [selectedAge, setSelectedAge] = useState('All Ages');
  const [selectedDate, setSelectedDate] = useState('');
  const { selectedCity } = useSelectedLocation();
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchValue.trim()) params.set('q', searchValue.trim());
    if (selectedActivity && selectedActivity !== 'All') params.set('category', selectedActivity);
    if (selectedAge && selectedAge !== 'All Ages') params.set('age', selectedAge);
    if (selectedDate) params.set('date', selectedDate);
    if (selectedCity && selectedCity !== 'All') params.set('location', selectedCity);
    router.push(`/explore?${params.toString()}`);
  };

  const handleCategoryCardClick = (categoryName: string) => {
    router.push(`/explore?category=${encodeURIComponent(categoryName.toLowerCase())}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f9f8ff] via-[#f7f5ff] to-[#f1edff]/70 pt-6 pb-12 md:pt-10 md:pb-16 lg:pt-12 lg:pb-16">
      
      {/* ── Ambient Background Glow & Doodles ── */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[620px] bg-gradient-to-tr from-purple-100/30 via-pink-100/20 to-sky-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Decorative Star Doodle (Top Left) */}
      <div className="absolute top-10 left-[41%] text-amber-400 opacity-85 pointer-events-none hidden lg:block">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
        </svg>
      </div>

      {/* Decorative Dotted Grid Pattern (Top Center) */}
      <div className="absolute top-12 left-[48%] opacity-35 pointer-events-none hidden lg:block">
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          ))}
        </div>
      </div>

      {/* Decorative Paper Airplane Doodle (Top Right) */}
      <div className="absolute top-8 right-[24%] text-blue-400 opacity-70 pointer-events-none hidden lg:block">
        <svg className="w-14 h-14 rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeDasharray="3 3">
          <path d="M2 12l20-9-9 20-2-8-9-3z" />
        </svg>
      </div>

      {/* Decorative Sparkle Badge (Far Right) */}
      <div className="absolute top-14 right-[6%] text-amber-500 opacity-80 pointer-events-none hidden lg:block">
        <div className="w-10 h-10 rounded-full bg-amber-100/90 border border-amber-300 flex items-center justify-center text-amber-600 shadow-sm">
          <Sparkles className="w-5 h-5" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ── Main Top Row: Left Content + Right Visual ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center mb-8 lg:mb-10">
          
          {/* ── Left Column (5 Cols): Typography & CTA Buttons ── */}
          <div className="lg:col-span-5 text-center lg:text-left pt-2 lg:pt-0">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/90 border border-purple-200 text-purple-800 text-xs sm:text-sm font-bold mb-5 shadow-2xs">
              <span className="text-amber-500">✨</span>
              <span>The #1 Platform for Kids Activities & Events</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[50px] font-black text-slate-900 leading-[1.12] tracking-tight mb-5">
              <span>Discover. Book. Enjoy.</span>
              <span className="block text-purple-600 font-extrabold mt-1">
                Amazing Activities
              </span>
              <span className="relative inline-block mt-1">
                for Your Kids
                {/* Cute Pink Heart Doodle */}
                <span className="inline-block text-pink-500 font-normal ml-2 transform -rotate-12 text-3xl sm:text-4xl align-middle">
                  ♡
                </span>
                {/* Hand-drawn Yellow Underline Stroke */}
                <svg 
                  className="absolute -bottom-2.5 left-0 w-full h-3 text-amber-300 opacity-90 -z-10 pointer-events-none" 
                  viewBox="0 0 240 12" 
                  fill="none" 
                  preserveAspectRatio="none"
                >
                  <path 
                    d="M3 8.5C50 3.5 120 4 237 7.5" 
                    stroke="currentColor" 
                    strokeWidth="5" 
                    strokeLinecap="round" 
                  />
                </svg>
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-slate-600 text-base sm:text-lg mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Find the best events, classes, and activities that inspire, engage, and help your child grow.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => router.push('/explore')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-7 py-3.5 rounded-2xl shadow-lg shadow-purple-600/25 hover:shadow-purple-600/35 transition-all duration-200 flex items-center gap-2 text-base group cursor-pointer"
              >
                <span>Explore Activities</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => router.push('/how-it-works')}
                className="bg-white hover:bg-slate-50 text-slate-800 font-bold px-6 py-3.5 rounded-2xl border border-slate-200 shadow-sm hover:shadow transition-all duration-200 flex items-center gap-2.5 text-base cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full border-2 border-slate-700 flex items-center justify-center text-slate-700">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                <span>Watch How It Works</span>
              </button>
            </div>

          </div>

          {/* ── Right Column (7 Cols): Organic Hero Child Photo + 5 Floating Category Cards ── */}
          <div className="lg:col-span-7 relative flex items-center justify-center min-h-[460px] sm:min-h-[500px] lg:min-h-[520px]">
            
            {/* Visual Stage Container */}
            <div className="relative w-full max-w-[600px] h-[460px] sm:h-[500px] flex items-center justify-center">
              
              {/* Back Fluid Sky-Blue Organic Blob Ring */}
              <div 
                className="absolute inset-6 sm:inset-4 bg-gradient-to-tr from-sky-400/80 via-blue-400/80 to-purple-400/70 shadow-2xl opacity-85"
                style={{
                  borderRadius: '52% 48% 62% 38% / 45% 58% 42% 55%',
                  transform: 'scale(1.06) rotate(3deg)',
                }}
              />

              {/* Main Photo Mask with Organic Shape */}
              <div 
                className="relative w-[78%] sm:w-[82%] h-[78%] sm:h-[82%] overflow-hidden shadow-2xl z-10 border-4 border-white/95"
                style={{
                  borderRadius: '48% 52% 42% 58% / 54% 44% 56% 46%',
                }}
              >
                <img 
                  src="/images/hero-kid.jpg" 
                  alt="Joyful child celebrating activities"
                  className="w-full h-full object-cover object-[center_12%] scale-135 sm:scale-130"
                />
              </div>

              {/* ── 5 Floating Category Cards (Always Solid Opaque White & Floating) ── */}

              {/* 1. Sports Card (Top-Left of boy) */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                onClick={() => handleCategoryCardClick('sports')}
                className="absolute top-2 left-0 sm:left-2 z-30 bg-white px-4 py-3.5 rounded-3xl shadow-xl shadow-purple-950/10 border border-slate-100 hover:border-emerald-300 hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col items-center text-center w-32 sm:w-36 opacity-100"
              >
                <div className="mb-1">
                  <Soccer3DIcon />
                </div>
                <div className="font-extrabold text-slate-900 text-xs sm:text-sm">Sports</div>
                <div className="text-[11px] text-emerald-600 font-bold">Build Strength</div>
              </motion.div>

              {/* 2. Arts & Crafts Card (Bottom-Left of boy) */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                onClick={() => handleCategoryCardClick('arts-and-crafts')}
                className="absolute bottom-12 -left-2 sm:left-0 z-30 bg-white px-4 py-3.5 rounded-3xl shadow-xl shadow-purple-950/10 border border-slate-100 hover:border-amber-300 hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col items-center text-center w-36 sm:w-40 opacity-100"
              >
                <div className="mb-1">
                  <Palette3DIcon />
                </div>
                <div className="font-extrabold text-slate-900 text-xs sm:text-sm">Arts & Crafts</div>
                <div className="text-[11px] text-pink-600 font-bold">Unleash Creativity</div>
              </motion.div>

              {/* 3. Dance Card (Top-Right of boy) */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                onClick={() => handleCategoryCardClick('dance')}
                className="absolute top-4 right-0 sm:right-2 z-30 bg-white px-4 py-3.5 rounded-3xl shadow-xl shadow-purple-950/10 border border-slate-100 hover:border-purple-300 hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col items-center text-center w-32 sm:w-36 opacity-100"
              >
                <div className="mb-1">
                  <Dance3DIcon />
                </div>
                <div className="font-extrabold text-slate-900 text-xs sm:text-sm">Dance</div>
                <div className="text-[11px] text-purple-600 font-bold">Move & Groove</div>
              </motion.div>

              {/* 4. Swimming Card (Mid-Right of boy) */}
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                onClick={() => handleCategoryCardClick('swimming')}
                className="absolute top-40 -right-3 sm:-right-1 z-30 bg-white px-4 py-3.5 rounded-3xl shadow-xl shadow-purple-950/10 border border-slate-100 hover:border-sky-300 hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col items-center text-center w-32 sm:w-36 opacity-100"
              >
                <div className="mb-1">
                  <Swimming3DIcon />
                </div>
                <div className="font-extrabold text-slate-900 text-xs sm:text-sm">Swimming</div>
                <div className="text-[11px] text-sky-600 font-bold">Learn & Grow</div>
              </motion.div>

              {/* 5. Chess Card (Bottom-Right of boy) */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 1.6 }}
                onClick={() => handleCategoryCardClick('chess')}
                className="absolute -bottom-2 right-4 sm:right-6 z-30 bg-white px-4 py-3.5 rounded-3xl shadow-xl shadow-purple-950/10 border border-slate-100 hover:border-amber-400 hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col items-center text-center w-32 sm:w-36 opacity-100"
              >
                <div className="mb-1">
                  <Chess3DIcon />
                </div>
                <div className="font-extrabold text-slate-900 text-xs sm:text-sm">Chess</div>
                <div className="text-[11px] text-amber-700 font-bold">Think Smart</div>
              </motion.div>

            </div>

          </div>

        </div>

        {/* ── Bottom Section: 5-Field Search Bar (Matching Reference) ── */}
        <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-xl shadow-purple-900/5 border border-slate-100 mb-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
            
            {/* Field 1: Search text */}
            <div className="md:col-span-3 flex items-center px-3.5 py-2.5 bg-slate-50/70 rounded-2xl md:bg-transparent md:border-r border-slate-200">
              <Search className="w-5 h-5 text-slate-400 mr-2.5 shrink-0" />
              <input
                type="text"
                placeholder="Search activities, events..."
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                className="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>

            {/* Field 2: Activity Dropdown */}
            <div className="md:col-span-2 flex items-center px-3.5 py-2 bg-slate-50/70 rounded-2xl md:bg-transparent md:border-r border-slate-200">
              <Grid className="w-4 h-4 text-purple-600 mr-2 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Activity</div>
                <select
                  value={selectedActivity}
                  onChange={e => setSelectedActivity(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer truncate"
                >
                  <option value="All">All</option>
                  <option value="sports">Sports</option>
                  <option value="stem">STEM & Coding</option>
                  <option value="dance">Dance & Music</option>
                  <option value="arts">Arts & Crafts</option>
                  <option value="chess">Chess</option>
                  <option value="swimming">Swimming</option>
                </select>
              </div>
            </div>

            {/* Field 3: Age Dropdown */}
            <div className="md:col-span-2 flex items-center px-3.5 py-2 bg-slate-50/70 rounded-2xl md:bg-transparent md:border-r border-slate-200">
              <Users className="w-4 h-4 text-purple-600 mr-2 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Age</div>
                <select
                  value={selectedAge}
                  onChange={e => setSelectedAge(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer truncate"
                >
                  <option value="All Ages">All Ages</option>
                  <option value="toddlers_2_4">2–4 yrs (Toddlers)</option>
                  <option value="early_5_8">5–8 yrs (Early)</option>
                  <option value="kids_9_12">9–12 yrs (Tweens)</option>
                  <option value="teens_13_plus">13+ yrs (Teens)</option>
                </select>
              </div>
            </div>

            {/* Field 4: Date Picker */}
            <div className="md:col-span-2 flex items-center px-3.5 py-2 bg-slate-50/70 rounded-2xl md:bg-transparent md:border-r border-slate-200">
              <Calendar className="w-4 h-4 text-purple-600 mr-2 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Date</div>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Field 5: Location Picker & Search Button */}
            <div className="md:col-span-3 flex items-center justify-between gap-2 px-1">
              <div className="flex-1 min-w-0">
                <LocationSelector variant="searchBar" className="w-full" />
              </div>
              <button
                onClick={handleSearch}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl shadow-md shadow-purple-600/25 hover:shadow-purple-600/35 transition-all text-sm shrink-0 cursor-pointer"
              >
                Search
              </button>
            </div>

          </div>
        </div>

        {/* ── Bottom Stats & Trust Highlights Row (Matching Reference) ── */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-100 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            
            {/* Stat 1: 500+ Activities */}
            <div className="flex items-center gap-3.5 px-2 sm:px-4 py-1">
              <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">500+</div>
                <div className="text-xs text-slate-500 font-medium">Activities</div>
              </div>
            </div>

            {/* Stat 2: Verified Organizers */}
            <div className="flex items-center gap-3.5 px-2 sm:px-4 py-1 pt-3 md:pt-1">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">Verified</div>
                <div className="text-xs text-slate-500 font-medium">Organizers</div>
              </div>
            </div>

            {/* Stat 3: Safe & Secure Payments */}
            <div className="flex items-center gap-3.5 px-2 sm:px-4 py-1 pt-3 md:pt-1">
              <div className="w-11 h-11 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">Safe & Secure</div>
                <div className="text-xs text-slate-500 font-medium">Payments</div>
              </div>
            </div>

            {/* Stat 4: Loved by Parents */}
            <div className="flex items-center gap-3.5 px-2 sm:px-4 py-1 pt-3 md:pt-1">
              <div className="w-11 h-11 rounded-2xl bg-pink-100 text-pink-700 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">Loved by</div>
                <div className="text-xs text-slate-500 font-medium">Parents</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
