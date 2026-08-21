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
  Sparkles,
  Award,
  Clock,
  Gift,
  Check,
  Flame,
  Tent,
  Smile,
  Music,
  Atom,
  BookOpen,
  Mountain,
  MoreHorizontal,
  Palette,
  Trophy,
  Waves,
  Crown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { LocationSelector, useSelectedLocation } from '@/components/shared/LocationSelector';

// Hot Air Balloon Component (Floating Far-Left)
function HotAirBalloon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 130" fill="none">
      <defs>
        <linearGradient id="balloonStripe1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>
        <linearGradient id="balloonStripe2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#eab308" />
        </linearGradient>
        <linearGradient id="balloonStripe3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="balloonBasket" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
      </defs>
      {/* Balloon Envelope */}
      <path d="M50 8C26 8 10 28 10 50c0 18 16 38 32 50h16c16-12 32-32 32-50 0-22-16-42-40-42z" fill="url(#balloonStripe1)" />
      <path d="M50 8c-12 0-22 18-22 42 0 18 10 38 22 50 12-12 22-32 22-50 0-24-10-42-22-42z" fill="url(#balloonStripe2)" />
      <path d="M50 8c-6 0-11 18-11 42 0 18 5 38 11 50 6-12 11-32 11-50 0-24-5-42-11-42z" fill="url(#balloonStripe3)" />
      {/* Ropes */}
      <line x1="38" y1="100" x2="42" y2="114" stroke="#78350f" strokeWidth="1.5" />
      <line x1="62" y1="100" x2="58" y2="114" stroke="#78350f" strokeWidth="1.5" />
      <line x1="44" y1="100" x2="45" y2="114" stroke="#78350f" strokeWidth="1.5" />
      <line x1="56" y1="100" x2="55" y2="114" stroke="#78350f" strokeWidth="1.5" />
      {/* Basket */}
      <rect x="40" y="114" width="20" height="14" rx="3" fill="url(#balloonBasket)" stroke="#78350f" strokeWidth="1.5" />
      <line x1="40" y1="120" x2="60" y2="120" stroke="#78350f" strokeWidth="1" />
    </svg>
  );
}

// 3D Isometric & Glossy SVG Icons for the 5 Main Floating Cards
function Soccer3DIcon() {
  return (
    <svg className="w-11 h-11 drop-shadow-md" viewBox="0 0 64 64" fill="none">
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
    <svg className="w-11 h-11 drop-shadow-md" viewBox="0 0 64 64" fill="none">
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
    <svg className="w-11 h-11 drop-shadow-md" viewBox="0 0 64 64" fill="none">
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
    <svg className="w-11 h-11 drop-shadow-md" viewBox="0 0 64 64" fill="none">
      <circle cx="38" cy="18" r="6" fill="#38bdf8" />
      <path d="M10 36c5-3 11-3 16 0s11 3 16 0 11-3 16 0" stroke="#0284c7" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M6 46c5-3 11-3 16 0s11 3 16 0 11-3 16 0" stroke="#38bdf8" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M22 28c3-3 8-5 13-4l9 3c1.5.5 2.5 2 2 3.5s-2 2.5-3.5 2l-7-2.3-5 3.3-8 1.5c-1.6.3-3.2-.7-3.5-2.3-.3-1.6.7-3.2 2.3-3.5" fill="#0369a1" />
    </svg>
  );
}

function Chess3DIcon() {
  return (
    <svg className="w-11 h-11 drop-shadow-md" viewBox="0 0 64 64" fill="none">
      <path d="M26 12h4v-4h-4V4h-4v4h-4v4h4v4h4v-4z" fill="#1e293b" />
      <path d="M14 20c0-2 4-4 8-4s8 2 8 4-3 12-3 20h-10c0-8-3-18-3-20z" fill="#334155" />
      <path d="M11 44h22v6H11v-6z" fill="#1e293b" />
      <path d="M9 50h26v6H9v-6z" fill="#0f172a" />
      <circle cx="44" cy="24" r="6" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" />
      <path d="M38 32c0-2 3-3 6-3s6 1 6 3-2 10-2 16H39c0-6-1-14-1-16z" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
      <path d="M35 48h18v5H35v-5z" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" />
      <path d="M33 53h22v5H33v-5z" fill="#fcd34d" stroke="#b45309" strokeWidth="1.5" />
    </svg>
  );
}

// 3D Gift Box SVG Icon
function Gift3DIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-14 h-14 drop-shadow-lg"} viewBox="0 0 64 64" fill="none">
      <rect x="12" y="24" width="40" height="32" rx="4" fill="url(#giftBoxGradHero)" />
      <rect x="8" y="16" width="48" height="12" rx="3" fill="#38bdf8" />
      <rect x="28" y="16" width="8" height="40" fill="#ef4444" />
      <rect x="8" y="20" width="48" height="4" fill="#ef4444" opacity="0.3" />
      <path d="M24 16c-4-8-12-6-10 0 2 6 14 0 14 0s12 6 14 0c2-6-6-8-10 0" stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="16" r="3" fill="#dc2626" />
      <defs>
        <linearGradient id="giftBoxGradHero" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Hero() {
  const [searchValue, setSearchValue] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('All');
  const [selectedAge, setSelectedAge] = useState('All Ages');
  const [selectedDate, setSelectedDate] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState('All Activities');
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

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategoryTab(categoryName);
    if (categoryName === 'All Activities') {
      router.push('/explore');
    } else {
      router.push(`/explore?category=${encodeURIComponent(categoryName.toLowerCase())}`);
    }
  };

  const popularCategoriesList = [
    { name: 'All Activities', icon: Grid, color: 'text-purple-600' },
    { name: 'Sports', icon: Trophy, color: 'text-emerald-600' },
    { name: 'Dance', icon: Sparkles, color: 'text-purple-600' },
    { name: 'Swimming', icon: Waves, color: 'text-sky-600' },
    { name: 'Arts & Crafts', icon: Palette, color: 'text-pink-600' },
    { name: 'Music', icon: Music, color: 'text-amber-600' },
    { name: 'STEM', icon: Atom, color: 'text-indigo-600' },
    { name: 'Academic', icon: BookOpen, color: 'text-blue-600' },
    { name: 'Adventure', icon: Mountain, color: 'text-emerald-600' },
    { name: 'Chess', icon: Crown, color: 'text-amber-700' },
    { name: 'Others', icon: MoreHorizontal, color: 'text-slate-600' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f5eaff] via-[#f7f2fe] to-[#ebe1fc]/80 pt-6 pb-8 md:pt-8 md:pb-12 lg:pt-10 lg:pb-14">
      
      {/* ── Ambient Background Glow & Decorative Gradients ── */}
      <div className="absolute -top-16 -left-16 w-[420px] h-[420px] bg-purple-300/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 -right-16 w-[460px] h-[460px] bg-pink-300/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[500px] h-[300px] bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* ── Hot Air Balloon (Floating Far-Left with smooth bobbing & sway) ── */}
      <motion.div
        animate={{ 
          y: [0, -14, 0],
          rotate: [-2, 2, -2]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-12 left-3 sm:left-6 z-20 pointer-events-none hidden sm:block"
      >
        <HotAirBalloon className="w-16 h-20 drop-shadow-xl" />
      </motion.div>

      {/* ── Golden Twinkle Stars ── */}
      <motion.div
        animate={{ scale: [1, 1.25, 1], rotate: [0, 15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-16 left-5 sm:left-8 text-amber-400 z-20 pointer-events-none hidden sm:block"
      >
        <span className="text-2xl drop-shadow-md">⭐</span>
      </motion.div>

      {/* Decorative Star Doodle Under Header */}
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-28 left-[40%] text-amber-400 opacity-90 pointer-events-none hidden lg:block"
      >
        <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
        </svg>
      </motion.div>

      {/* Dotted Grid Pattern (Top Center) */}
      <div className="absolute top-6 left-[48%] opacity-35 pointer-events-none hidden lg:block">
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          ))}
        </div>
      </div>

      {/* Paper Airplane with Flight Trail (Top-Right) */}
      <motion.div
        animate={{ y: [0, -8, 0], x: [0, 4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-6 right-[26%] text-purple-500 opacity-85 pointer-events-none hidden lg:block"
      >
        <svg className="w-16 h-16 rotate-12 drop-shadow-md" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M8 32l48-24-20 48-6-20-22-4z" />
          <path d="M30 36l26-28" />
        </svg>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ── Main Top Row: Left Content + Center Photo Blob + Right Promo Card ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-2 items-center mb-6 lg:mb-8">
          
          {/* ── Left Column (5 Cols): Typography, Value Props & CTA Buttons ── */}
          <div className="lg:col-span-5 text-center lg:text-left pt-2 lg:pt-0">
            
            {/* Top Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-purple-200/80 text-purple-900 text-xs sm:text-sm font-bold mb-4 shadow-sm"
            >
              <span className="text-amber-500 animate-pulse">✨</span>
              <span>The #1 Platform for Kids Activities & Events</span>
            </motion.div>

            {/* Main Headline with Smooth Animated Entrance */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-4xl sm:text-5xl lg:text-[46px] font-black text-slate-900 leading-[1.12] tracking-tight mb-4"
            >
              <span className="block">Discover. Book. Enjoy.</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 font-extrabold mt-1">
                Amazing Activities
              </span>
              <span className="relative inline-block mt-1">
                for Your Kids
                <motion.span 
                  animate={{ scale: [1, 1.25, 1, 1.15, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-block text-pink-500 font-normal ml-2 transform -rotate-12 text-3xl sm:text-4xl align-middle"
                >
                  ♡
                </motion.span>
                {/* Yellow Hand-drawn Underline Stroke */}
                <svg 
                  className="absolute -bottom-2 left-0 w-full h-3 text-amber-300 opacity-90 -z-10 pointer-events-none" 
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
            </motion.h1>

            {/* Subtext */}
            <p className="text-slate-600 text-sm sm:text-base mb-6 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Find the best events, classes, and activities that inspire, engage, and help your child grow.
            </p>

            {/* ── 4 Mini Value Props Row ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-start gap-2">
                <div className="p-1.5 rounded-xl bg-purple-100/90 text-purple-700 shrink-0 mt-0.5 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 leading-tight">Trusted & Safe</div>
                  <div className="text-[10px] text-slate-500">Verified organizers</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="p-1.5 rounded-xl bg-pink-100/90 text-pink-700 shrink-0 mt-0.5 shadow-2xs">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 leading-tight">Quality Activities</div>
                  <div className="text-[10px] text-slate-500">Curated with care</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="p-1.5 rounded-xl bg-indigo-100/90 text-indigo-700 shrink-0 mt-0.5 shadow-2xs">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 leading-tight">Easy Booking</div>
                  <div className="text-[10px] text-slate-500">Quick & hassle-free</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="p-1.5 rounded-xl bg-amber-100/90 text-amber-700 shrink-0 mt-0.5 shadow-2xs">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 leading-tight">Loved by Parents</div>
                  <div className="text-[10px] text-slate-500">4.8 ⭐ rating</div>
                </div>
              </div>
            </div>

            {/* ── Action Buttons with Micro-Animations ── */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.4)" }}
                whileTap={{ scale: 0.96 }}
                onClick={() => router.push('/explore')}
                className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white font-bold px-7 py-3.5 rounded-2xl shadow-lg shadow-purple-600/30 transition-all duration-200 flex items-center gap-2 text-sm sm:text-base group cursor-pointer"
              >
                {/* Shimmer sweep effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span>Explore Activities</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: "#ffffff" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push('/how-it-works')}
                className="bg-white/95 hover:bg-white text-slate-800 font-bold px-6 py-3.5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow transition-all duration-200 flex items-center gap-2.5 text-sm sm:text-base cursor-pointer"
              >
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-purple-400 opacity-30" />
                  <div className="w-6 h-6 rounded-full border-2 border-purple-700 flex items-center justify-center text-purple-700 bg-purple-50">
                    <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                  </div>
                </div>
                <span>Watch How It Works</span>
              </motion.button>
            </div>

          </div>

          {/* ── Right Column (7 Cols): Hero Child Photo with Vibrant Purple/Fuchsia Halo + 5 Category Cards + 20% First Booking Promo Card ── */}
          <div className="lg:col-span-7 relative flex items-center justify-center min-h-[460px] sm:min-h-[480px] lg:min-h-[500px]">
            
            <div className="relative w-full max-w-[620px] h-[450px] sm:h-[480px] flex items-center justify-center">
              
              {/* Back Vibrant Magenta / Fuchsia Halo Ring (From Reference) */}
              <div 
                className="absolute inset-4 sm:inset-2 bg-gradient-to-tr from-fuchsia-500/90 via-purple-600/90 to-pink-500/85 shadow-2xl opacity-90"
                style={{
                  borderRadius: '50% 50% 50% 50% / 50% 50% 50% 50%',
                  transform: 'scale(1.05)',
                }}
              />

              {/* Main Photo Mask with Crisp Circular Frame (Zoomed in on smiling boy & raised fist) */}
              <div 
                className="relative w-[78%] sm:w-[80%] h-[78%] sm:h-[80%] overflow-hidden shadow-2xl z-10 border-4 border-white/95 rounded-full"
              >
                <img 
                  src="/images/hero-kid.jpg" 
                  alt="Joyful child celebrating activities"
                  className="w-full h-full object-cover object-[center_12%] scale-135 sm:scale-130"
                />
              </div>

              {/* ── 5 Floating Category Cards (Solid Opaque White with Micro-Animations) ── */}

              {/* 1. Sports Card (Top-Left of boy) */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.08, y: -8 }}
                onClick={() => handleCategoryClick('Sports')}
                className="absolute top-2 left-0 sm:left-2 z-30 bg-white px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-3xl shadow-xl shadow-purple-950/10 border border-slate-100 hover:border-emerald-300 transition-all duration-300 cursor-pointer flex flex-col items-center text-center w-30 sm:w-34 opacity-100"
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
                whileHover={{ scale: 1.08, y: -8 }}
                onClick={() => handleCategoryClick('Arts & Crafts')}
                className="absolute bottom-10 -left-2 sm:left-0 z-30 bg-white px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-3xl shadow-xl shadow-purple-950/10 border border-slate-100 hover:border-amber-300 transition-all duration-300 cursor-pointer flex flex-col items-center text-center w-34 sm:w-38 opacity-100"
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
                whileHover={{ scale: 1.08, y: -8 }}
                onClick={() => handleCategoryClick('Dance')}
                className="absolute top-2 right-32 sm:right-36 z-30 bg-white px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-3xl shadow-xl shadow-purple-950/10 border border-slate-100 hover:border-purple-300 transition-all duration-300 cursor-pointer flex flex-col items-center text-center w-28 sm:w-32 opacity-100"
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
                whileHover={{ scale: 1.08, y: -8 }}
                onClick={() => handleCategoryClick('Swimming')}
                className="absolute top-36 right-32 sm:right-36 z-30 bg-white px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-3xl shadow-xl shadow-purple-950/10 border border-slate-100 hover:border-sky-300 transition-all duration-300 cursor-pointer flex flex-col items-center text-center w-28 sm:w-32 opacity-100"
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
                whileHover={{ scale: 1.08, y: -8 }}
                onClick={() => handleCategoryClick('Chess')}
                className="absolute -bottom-2 right-32 sm:right-36 z-30 bg-white px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-3xl shadow-xl shadow-purple-950/10 border border-slate-100 hover:border-amber-400 transition-all duration-300 cursor-pointer flex flex-col items-center text-center w-28 sm:w-32 opacity-100"
              >
                <div className="mb-1">
                  <Chess3DIcon />
                </div>
                <div className="font-extrabold text-slate-900 text-xs sm:text-sm">Chess</div>
                <div className="text-[11px] text-amber-700 font-bold">Think Smart</div>
              </motion.div>

              {/* ── Right-Side 20% First Booking Promo Card (From Reference) ── */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => router.push('/explore?offer=first-booking')}
                className="absolute top-16 -right-2 sm:-right-4 z-40 bg-gradient-to-b from-purple-700 via-indigo-700 to-purple-900 text-white p-3.5 sm:p-4 rounded-3xl shadow-2xl border border-purple-400/30 flex flex-col items-center text-center w-34 sm:w-38 cursor-pointer hidden md:flex"
              >
                <div className="text-[11px] font-bold text-purple-200 mb-0.5">Get Up to</div>
                <div className="text-xl sm:text-2xl font-black text-amber-300 leading-none mb-1">20% OFF</div>
                <div className="text-[10px] text-purple-100 font-medium mb-2.5">on your first booking!</div>
                
                <div className="w-full py-1 px-2 rounded-xl bg-amber-400 text-slate-950 font-black text-[11px] shadow-sm mb-2 hover:bg-amber-300 transition-colors">
                  Use Code: KID20
                </div>

                <div className="relative">
                  <Gift3DIcon className="w-10 h-10" />
                </div>
              </motion.div>

            </div>

          </div>

        </div>

        {/* ── Section 1: Popular Categories Horizontal Quick Strip ── */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-1.5">
              <span>Popular Categories</span>
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
            </h2>
            <button
              onClick={() => router.push('/categories')}
              className="text-xs sm:text-sm font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer group"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-0.5">
            {popularCategoriesList.map((cat, idx) => {
              const isActive = activeCategoryTab === cat.name;
              const IconComponent = cat.icon;
              return (
                <motion.button
                  key={idx}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`flex flex-col items-center justify-center px-3 py-2.5 rounded-2xl min-w-[92px] sm:min-w-[102px] h-[78px] transition-all duration-200 border cursor-pointer shrink-0 ${
                    isActive 
                      ? 'bg-purple-100/90 border-purple-400 shadow-md text-purple-950 font-extrabold' 
                      : 'bg-white hover:bg-slate-50 border-slate-100 hover:border-purple-200 text-slate-700 font-bold shadow-2xs hover:shadow-sm'
                  }`}
                >
                  <div className="mb-1.5 flex items-center justify-center">
                    <IconComponent className={`w-5 h-5 ${cat.color || 'text-purple-600'}`} />
                  </div>
                  <span className="text-[11px] font-bold text-center leading-tight whitespace-nowrap">
                    {cat.name}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── Section 2: Interactive Promo & Value Banner Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 mb-6">
          
          {/* Promo Card 1: Weekend Fun 10% OFF */}
          <motion.div 
            whileHover={{ scale: 1.02, y: -3 }}
            onClick={() => router.push('/explore?offer=weekend')}
            className="md:col-span-3 rounded-3xl p-4 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer relative overflow-hidden flex items-center justify-between min-h-[120px] group"
          >
            <div className="z-10 max-w-[62%]">
              <div className="flex items-center gap-1 text-[11px] font-extrabold text-amber-300 mb-1">
                <Flame className="w-3.5 h-3.5" />
                <span>Weekend Fun</span>
              </div>
              <div className="text-base sm:text-lg font-black leading-tight mb-0.5">10% OFF</div>
              <div className="text-[10px] text-purple-200 font-medium mb-1.5 leading-tight">On selected activities</div>
              <span className="inline-block px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[10px] font-extrabold tracking-wider border border-white/20">
                Use code: FUN10
              </span>
            </div>
            {/* Cutout Photo */}
            <div className="absolute right-0 top-0 bottom-0 w-[42%] overflow-hidden">
              <img 
                src="/images/promo-climbing.jpg" 
                alt="Weekend rock climbing fun" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-transparent to-transparent" />
            </div>
          </motion.div>

          {/* Promo Card 2: Summer Camp Special Up to 20% OFF */}
          <motion.div 
            whileHover={{ scale: 1.02, y: -3 }}
            onClick={() => router.push('/explore?offer=summer-camp')}
            className="md:col-span-3 rounded-3xl p-4 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer relative overflow-hidden flex items-center justify-between min-h-[120px] group"
          >
            <div className="z-10 max-w-[62%]">
              <div className="flex items-center gap-1 text-[11px] font-extrabold text-yellow-200 mb-1">
                <Tent className="w-3.5 h-3.5" />
                <span>Summer Camp Special</span>
              </div>
              <div className="text-base sm:text-lg font-black leading-tight mb-0.5">Up to 20% OFF</div>
              <div className="text-[10px] text-amber-100 font-medium mb-1.5 leading-tight">Early bird offers!</div>
              <span className="inline-block px-2 py-0.5 rounded-md bg-white/25 backdrop-blur-md text-[10px] font-extrabold tracking-wider border border-white/20">
                Limited time only
              </span>
            </div>
            {/* Cutout Photo */}
            <div className="absolute right-0 top-0 bottom-0 w-[42%] overflow-hidden">
              <img 
                src="/images/promo-camp.jpg" 
                alt="Summer camp kids" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-transparent to-transparent" />
            </div>
          </motion.div>

          {/* Promo Card 3: Refer & Earn Get ₹100 */}
          <motion.div 
            whileHover={{ scale: 1.02, y: -3 }}
            onClick={() => router.push('/dashboard/parent/profile')}
            className="md:col-span-3 rounded-3xl p-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer relative overflow-hidden flex items-center justify-between min-h-[120px] group"
          >
            <div className="z-10 max-w-[65%]">
              <div className="flex items-center gap-1 text-[11px] font-extrabold text-sky-100 mb-1">
                <Users className="w-3.5 h-3.5" />
                <span>Refer & Earn</span>
              </div>
              <div className="text-base sm:text-lg font-black leading-tight mb-0.5">Get ₹100 Credit</div>
              <div className="text-[10px] text-sky-100 font-medium leading-tight">
                Refer a friend & both get the reward!
              </div>
            </div>
            {/* 3D Gift Box Icon */}
            <div className="relative pr-1 group-hover:scale-110 transition-transform duration-300">
              <Gift3DIcon className="w-14 h-14" />
            </div>
          </motion.div>

          {/* Value Card 4: Why Parents Love Kidspire */}
          <motion.div 
            whileHover={{ scale: 1.02, y: -3 }}
            className="md:col-span-3 rounded-3xl p-4 bg-gradient-to-br from-purple-700 via-indigo-700 to-violet-900 text-white shadow-md relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-300 mb-2">
                <span>🎉</span>
                <span>Why Parents Love Kidspire</span>
              </div>
              <ul className="space-y-1 text-[11px] text-purple-100 font-medium">
                <li className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-white/20 flex items-center justify-center text-[9px] text-emerald-300 font-bold shrink-0">✓</span>
                  <span>Curated activities for every age</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-white/20 flex items-center justify-center text-[9px] text-emerald-300 font-bold shrink-0">✓</span>
                  <span>Safe & verified organizers</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-white/20 flex items-center justify-center text-[9px] text-emerald-300 font-bold shrink-0">✓</span>
                  <span>Easy booking & secure payments</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-white/20 flex items-center justify-center text-[9px] text-emerald-300 font-bold shrink-0">✓</span>
                  <span>Real reviews from real parents</span>
                </li>
              </ul>
            </div>

            {/* Bottom Rating Pill + Avatar Stack */}
            <div className="pt-2.5 border-t border-white/10 flex items-center justify-between mt-2">
              <div className="flex -space-x-1.5 overflow-hidden">
                <div className="w-5 h-5 rounded-full ring-1 ring-white bg-amber-400 text-slate-900 font-bold text-[8px] flex items-center justify-center">M</div>
                <div className="w-5 h-5 rounded-full ring-1 ring-white bg-pink-400 text-white font-bold text-[8px] flex items-center justify-center">P</div>
                <div className="w-5 h-5 rounded-full ring-1 ring-white bg-emerald-400 text-white font-bold text-[8px] flex items-center justify-center">A</div>
                <div className="w-5 h-5 rounded-full ring-1 ring-white bg-sky-400 text-white font-bold text-[8px] flex items-center justify-center">S</div>
              </div>
              <div className="flex items-center gap-1 bg-amber-400/95 text-slate-900 px-2 py-0.5 rounded-full font-black text-[10px]">
                <span>⭐ 4.8/5</span>
              </div>
            </div>
          </motion.div>

        </div>

        {/* ── Section 3: 5-Field Search Bar ── */}
        <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-xl shadow-purple-900/10 border border-purple-100/60 max-w-6xl mx-auto">
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
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 8px 20px -4px rgba(124, 58, 237, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSearch}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-md shadow-purple-600/30 transition-all text-sm shrink-0 cursor-pointer"
              >
                Search
              </motion.button>
            </div>

          </div>
        </div>

      </div>

      {/* ── Flowing Bottom Wavy Ribbon (From Reference) ── */}
      <div className="w-full overflow-hidden leading-none mt-6 pointer-events-none">
        <svg className="relative block w-full h-8 sm:h-12 text-purple-700/85" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 C150,90 350,-40 500,60 C650,140 900,10 1200,40 L1200,120 L0,120 Z" fill="currentColor" opacity="0.9" />
          <path d="M0,20 C200,100 450,10 700,70 C950,130 1100,30 1200,50 L1200,120 L0,120 Z" fill="#8b5cf6" opacity="0.4" />
        </svg>
      </div>

    </section>
  );
}
