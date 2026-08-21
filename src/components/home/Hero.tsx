'use client';
import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Star, 
  Map, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Flame, 
  CheckCircle2 
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Button } from '../ui/Button';
import { CountUp } from '@/components/animations/CountUp';
import { LocationSelector, useSelectedLocation } from '@/components/shared/LocationSelector';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { useRouter } from 'next/navigation';

// Decorative SVG doodles
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

interface HeroDeckEvent {
  id: string;
  category: string;
  categoryIcon: string;
  badge: string;
  badgeBg: string;
  title: string;
  subtitle: string;
  organizer: string;
  organizerInitial: string;
  rating: number;
  reviewsCount: number;
  time: string;
  location: string;
  age: string;
  price: string;
  originalPrice?: string;
  spotsLeft: number;
  gradientTheme: string;
  accentBg: string;
  accentText: string;
  imageThumbnail: string;
}

const HERO_DECK_EVENTS: HeroDeckEvent[] = [
  {
    id: 'evt-robotics',
    category: 'Robotics & STEM',
    categoryIcon: '🤖',
    badge: '🚀 Top Rated STEM',
    badgeBg: 'bg-violet-500/15 text-violet-700 border-violet-300/40',
    title: 'Junior Robotics & AI Creators Lab',
    subtitle: 'Hands-on sensor coding, autonomous bots & logic puzzles',
    organizer: 'TechTinkers Academy',
    organizerInitial: 'TT',
    rating: 4.9,
    reviewsCount: 148,
    time: 'Sat & Sun, 10:30 AM',
    location: 'Koramangala Hub',
    age: '7–12 yrs',
    price: '₹750',
    originalPrice: '₹1,200',
    spotsLeft: 3,
    gradientTheme: 'from-violet-600 via-purple-600 to-indigo-700',
    accentBg: 'bg-violet-50',
    accentText: 'text-violet-700',
    imageThumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=60',
  },
  {
    id: 'evt-soccer',
    category: 'Sports & Fitness',
    categoryIcon: '⚽',
    badge: '🏆 Bestseller',
    badgeBg: 'bg-emerald-500/15 text-emerald-800 border-emerald-300/40',
    title: 'Premier Youth Soccer Camp & League',
    subtitle: 'Pro coaching, footwork drills, agility & mini tournament',
    organizer: 'Metropolitan Sports Club',
    organizerInitial: 'MS',
    rating: 4.9,
    reviewsCount: 224,
    time: 'Every Weekend, 8:00 AM',
    location: 'Indiranagar Arena',
    age: '5–14 yrs',
    price: '₹599',
    originalPrice: '₹999',
    spotsLeft: 4,
    gradientTheme: 'from-emerald-600 via-teal-600 to-cyan-700',
    accentBg: 'bg-emerald-50',
    accentText: 'text-emerald-700',
    imageThumbnail: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=400&auto=format&fit=crop&q=60',
  },
  {
    id: 'evt-dance',
    category: 'Dance & Rhythm',
    categoryIcon: '💃',
    badge: '✨ Trending Now',
    badgeBg: 'bg-pink-500/15 text-pink-700 border-pink-300/40',
    title: 'Kids Hip-Hop & Breakdance Groove',
    subtitle: 'Dynamic beat choreography, body balance & stage confidence',
    organizer: 'Rhythm Dance Studio',
    organizerInitial: 'RD',
    rating: 4.8,
    reviewsCount: 112,
    time: 'Sat, 4:00 PM',
    location: 'HSR Studio Space',
    age: '6–13 yrs',
    price: '₹499',
    originalPrice: '₹850',
    spotsLeft: 2,
    gradientTheme: 'from-pink-500 via-rose-500 to-orange-500',
    accentBg: 'bg-pink-50',
    accentText: 'text-pink-700',
    imageThumbnail: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=400&auto=format&fit=crop&q=60',
  },
  {
    id: 'evt-arts',
    category: 'Arts & Crafts',
    categoryIcon: '🎨',
    badge: '🌟 Creative Masterclass',
    badgeBg: 'bg-amber-500/15 text-amber-800 border-amber-300/40',
    title: 'Pottery Wheel & Canvas Painting Fiesta',
    subtitle: 'Ceramic sculpting, acrylic blending & takeaway keepsake',
    organizer: 'Artisan Kids Collective',
    organizerInitial: 'AK',
    rating: 5.0,
    reviewsCount: 94,
    time: 'Sun, 11:00 AM',
    location: 'Whitefield Arts Center',
    age: '4–11 yrs',
    price: '₹650',
    originalPrice: '₹1,050',
    spotsLeft: 5,
    gradientTheme: 'from-amber-500 via-orange-500 to-rose-500',
    accentBg: 'bg-amber-50',
    accentText: 'text-amber-700',
    imageThumbnail: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&auto=format&fit=crop&q=60',
  },
  {
    id: 'evt-chess',
    category: 'Chess Tactics',
    categoryIcon: '♟️',
    badge: '🧠 Strategic Mind',
    badgeBg: 'bg-blue-500/15 text-blue-700 border-blue-300/40',
    title: 'Junior Grandmaster Tactics & Blitz Cup',
    subtitle: 'Opening repertoire, endgame strategy & blitz tournaments',
    organizer: 'Chennai Chess Academy',
    organizerInitial: 'CC',
    rating: 4.9,
    reviewsCount: 176,
    time: 'Sat & Sun, 3:30 PM',
    location: 'Online + In-Person Hub',
    age: '6–15 yrs',
    price: '₹450',
    originalPrice: '₹750',
    spotsLeft: 6,
    gradientTheme: 'from-blue-600 via-indigo-600 to-violet-700',
    accentBg: 'bg-blue-50',
    accentText: 'text-blue-700',
    imageThumbnail: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400&auto=format&fit=crop&q=60',
  },
];

export function Hero() {
  const [searchValue, setSearchValue] = useState('');
  const { selectedCity } = useSelectedLocation();
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [activeDeckIndex, setActiveDeckIndex] = useState(0);
  const [isHoveredDeck, setIsHoveredDeck] = useState(false);
  const [likedEvents, setLikedEvents] = useState<Record<string, boolean>>({});
  const [cardTilt, setCardTilt] = useState({ rotateX: 0, rotateY: 0 });
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

  // Auto-cycle deck every 4.5 seconds if not hovered
  useEffect(() => {
    if (isHoveredDeck) return;
    const interval = setInterval(() => {
      setActiveDeckIndex(prev => (prev + 1) % HERO_DECK_EVENTS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isHoveredDeck]);

  const handleMouseMoveSection = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleDeckMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Subtle 3D tilt calculation
    const rotY = (x / (rect.width / 2)) * 6;
    const rotX = -(y / (rect.height / 2)) * 6;
    setCardTilt({ rotateX: rotX, rotateY: rotY });
  };

  const handleDeckMouseLeave = () => {
    setCardTilt({ rotateX: 0, rotateY: 0 });
    setIsHoveredDeck(false);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchValue.trim()) params.set('q', searchValue.trim());
    if (selectedCity && selectedCity !== 'All') params.set('location', selectedCity);
    router.push(`/explore?${params.toString()}`);
  };

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikedEvents(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const activeEvent = HERO_DECK_EVENTS[activeDeckIndex];

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
      className="relative overflow-hidden pt-10 pb-8 md:pt-14 md:pb-12 lg:pt-16 lg:pb-16 bg-gradient-to-br from-violet-100/90 via-pink-50/70 to-amber-50/70"
    >
      {/* ── Background Dynamic Mesh Pattern ── */}
      <div className="absolute inset-0 bg-[radial-gradient(#7c3aed18_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60" />
      
      {/* ── Ambient Floating Glow Blobs ── */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-300/35 rounded-full blur-3xl pointer-events-none animate-pulse duration-[7000ms]" />
      <div className="absolute top-1/3 -right-24 w-[28rem] h-[28rem] bg-pink-300/30 rounded-full blur-3xl pointer-events-none animate-pulse duration-[9000ms]" />
      <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-emerald-200/25 rounded-full blur-3xl pointer-events-none" />

      {/* ── Interactive Spotlight Glow (Desktop) ── */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 hidden md:block"
        style={{
          background: `radial-gradient(750px circle at ${mousePos.x}px ${mousePos.y}px, rgba(124, 58, 237, 0.12), transparent 75%)`,
        }}
      />

      {/* ── Parallax Scattered decorative doodles ── */}
      <motion.div style={{ y: yFast }} className="pointer-events-none absolute inset-0">
        <StarDoodle   className="absolute top-6  left-10  w-6 h-6  text-purple-500/50 opacity-60 animate-drift-1" />
        <SparkDoodle  className="absolute top-20 right-28 w-7 h-7  text-amber-500/50  opacity-60 animate-drift-2" />
        <DotDoodle    className="absolute bottom-8 right-44 w-3.5 h-3.5 text-purple-400 opacity-60 animate-drift-4" />
      </motion.div>

      <motion.div style={{ y: ySlow }} className="pointer-events-none absolute inset-0">
        <SparkDoodle  className="absolute top-14 left-20  w-5 h-5  text-amber-400/60  opacity-70 animate-drift-3" />
        <SparkDoodle  className="absolute top-10 right-12 w-6 h-6  text-purple-600/40 opacity-50 animate-drift-1" />
        <StarDoodle   className="absolute bottom-20 left-8  w-5 h-5  text-pink-400/50   opacity-50 animate-drift-5" />
      </motion.div>

      <motion.div style={{ y: yMid }} className="pointer-events-none absolute inset-0">
        <DotDoodle    className="absolute top-4  left-44  w-3.5 h-3.5 text-pink-400/40   opacity-50 animate-drift-2" />
        <DotDoodle    className="absolute top-36 right-6  w-4 h-4  text-purple-400/40 opacity-50 animate-drift-4" />
        <SparkDoodle  className="absolute bottom-12 left-36 w-4 h-4  text-amber-400/50  opacity-60 animate-drift-3" />
        <StarDoodle   className="absolute bottom-28 right-20 w-6 h-6  text-amber-500/40  opacity-50 animate-drift-1" />
      </motion.div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12 xl:gap-16">

          {/* ── Left Column: Value Proposition & Search ── */}
          <div className="flex-1 text-center lg:text-left">

            {/* Live Active Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-purple-300/40 text-purple-900 text-xs sm:text-sm font-bold mb-5 shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/50 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-600"></span>
              </span>
              <span className="tracking-wide">🔥 OVER 10,000+ KIDS BOOKED THIS MONTH</span>
            </div>

            {/* Animated Reveal Heading */}
            <h1 className="text-hero font-extrabold text-slate-900 leading-[1.12] tracking-tight mb-5 flex flex-wrap justify-center lg:justify-start gap-x-3 gap-y-1">
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

            <p className="text-slate-600 text-body-lg mb-7 max-w-2xl lg:max-w-3xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Discover, book, and track top-rated sports camps, robotics labs, performing arts, and creative workshops designed for kids ages 4–16.
            </p>

            {/* Glassmorphic Search Bar */}
            <div className="bg-white/90 backdrop-blur-xl p-2 rounded-3xl md:rounded-full shadow-2xl shadow-purple-950/10 border border-white/80 flex flex-col md:flex-row items-stretch md:items-center gap-1.5 mb-8 max-w-xl lg:max-w-2xl mx-auto lg:mx-0 hover:border-purple-300 hover:shadow-purple-500/15 transition-all duration-300">
              <div className="flex items-center px-4 py-3 md:py-2 w-full md:w-auto flex-1 border-b md:border-b-0 md:border-r border-slate-200/70">
                <Search className="w-5 h-5 text-purple-600 mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Try 'Robotics', 'Soccer', 'Chess', 'Dance'..."
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  className="w-full bg-transparent text-sm md:text-base focus:outline-none text-slate-800 placeholder-slate-400 font-semibold"
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
                    className="w-full md:w-auto md:ml-1 rounded-2xl md:rounded-full h-12 md:h-13 px-7 text-sm md:text-base font-bold shadow-lg bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-purple-500/25 transition-transform active:scale-95 duration-150"
                  >
                    Explore
                  </Button>
                </MagneticButton>
              </div>
            </div>

            {/* Key Platform Stats */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 border-t border-purple-200/50 pt-5 max-w-lg mx-auto lg:mx-0">
              <div className="flex flex-col sm:flex-row items-center p-2.5 sm:p-3 rounded-2xl bg-orange-50/80 border border-orange-100 shadow-sm text-center sm:text-left transition-all hover:scale-[1.03] duration-300">
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-orange-100 text-orange-700 mb-1.5 sm:mb-0 sm:mr-3 shrink-0">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-sm sm:text-base lg:text-lg text-orange-950 leading-none mb-1">
                    <CountUp end={500} suffix="+" duration={1500} />
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-orange-700 font-bold uppercase tracking-wider">Events</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center p-2.5 sm:p-3 rounded-2xl bg-purple-50/80 border border-purple-100 shadow-sm text-center sm:text-left transition-all hover:scale-[1.03] duration-300">
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-100 text-purple-700 mb-1.5 sm:mb-0 sm:mr-3 shrink-0">
                  <Map className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-sm sm:text-base lg:text-lg text-purple-950 leading-none mb-1">
                    <CountUp end={120} suffix="+" duration={1500} />
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-purple-700 font-bold uppercase tracking-wider">Venues</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center p-2.5 sm:p-3 rounded-2xl bg-blue-50/80 border border-blue-100 shadow-sm text-center sm:text-left transition-all hover:scale-[1.03] duration-300">
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-100 text-blue-700 mb-1.5 sm:mb-0 sm:mr-3 shrink-0">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-sm sm:text-base lg:text-lg text-blue-950 leading-none mb-1">
                    <CountUp end={4.9} decimals={1} suffix="/5" duration={1500} />
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-blue-700 font-bold uppercase tracking-wider">Rating</div>
                </div>
              </div>
            </div>

            {/* Trust Pill Row */}
            <div className="mt-6 flex flex-wrap items-center gap-x-3.5 gap-y-2 text-xs font-semibold text-slate-500 justify-center lg:justify-start">
              <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200/70 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                100% Verified Academies
              </span>
              <span className="flex items-center gap-1.5 bg-indigo-50 text-indigo-800 px-3 py-1 rounded-full border border-indigo-200/70 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                Instant Seat Confirmation
              </span>
              <span className="flex items-center gap-1.5 bg-pink-50 text-pink-800 px-3 py-1 rounded-full border border-pink-200/70 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                Easy Free Cancellation
              </span>
            </div>

          </div>

          {/* ── Right Column: Interactive 3D Category & Event Deck ── */}
          <div className="w-full lg:w-1/2 relative flex flex-col items-center justify-center">
            
            {/* Interactive Category Selector Tabs */}
            <div className="w-full max-w-[480px] mb-3 flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar py-1 px-1 bg-white/70 backdrop-blur-md rounded-2xl border border-white/80 shadow-sm">
              {HERO_DECK_EVENTS.map((item, index) => {
                const isActive = index === activeDeckIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveDeckIndex(index)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 relative ${
                      isActive 
                        ? 'text-white shadow-md shadow-purple-600/20' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeCategoryPill"
                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl -z-10"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span>{item.categoryIcon}</span>
                    <span className="hidden sm:inline">{item.category}</span>
                  </button>
                );
              })}
            </div>

            {/* 3D Card Stack Container with Interactive Tilt */}
            <div 
              className="w-full max-w-[480px] h-[460px] sm:h-[480px] relative perspective-[1200px]"
              onMouseMove={handleDeckMouseMove}
              onMouseEnter={() => setIsHoveredDeck(true)}
              onMouseLeave={handleDeckMouseLeave}
            >
              {/* Floating Live Enrolled Pill (Top Right) */}
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-2 sm:-right-4 z-40 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-2.5 pointer-events-none"
              >
                <div className="flex -space-x-2 overflow-hidden">
                  <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-purple-500 text-white text-[9px] font-extrabold flex items-center justify-center">A</div>
                  <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-pink-500 text-white text-[9px] font-extrabold flex items-center justify-center">S</div>
                  <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-amber-500 text-white text-[9px] font-extrabold flex items-center justify-center">R</div>
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-extrabold text-slate-900 leading-tight">1,240+ Enrolled</div>
                  <div className="text-[9px] text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Live Booking Fast
                  </div>
                </div>
              </motion.div>

              {/* Floating Verified Coach Badge (Bottom Left) */}
              <motion.div 
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-2 sm:-left-4 z-40 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-2 pointer-events-none"
              >
                <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                  ★
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-bold text-slate-900 leading-tight">4.9 / 5.0 Rating</div>
                  <div className="text-[9px] text-slate-500 font-semibold">from 1,800+ Parents</div>
                </div>
              </motion.div>

              {/* Stack Background Layer 2 (Deepest) */}
              <div 
                className="absolute inset-x-8 top-10 bottom-0 rounded-3xl bg-purple-200/40 backdrop-blur-sm border border-white/40 transform scale-[0.88] translate-y-6 -rotate-3 transition-transform duration-500 -z-10 shadow-lg pointer-events-none"
              />

              {/* Stack Background Layer 1 (Middle) */}
              <div 
                className="absolute inset-x-4 top-5 bottom-2 rounded-3xl bg-white/60 backdrop-blur-md border border-white/60 transform scale-[0.94] translate-y-3 rotate-2 transition-transform duration-500 z-10 shadow-xl pointer-events-none"
              />

              {/* Active Foreground 3D Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeEvent.id}
                  initial={{ opacity: 0, scale: 0.95, rotateY: -12, y: 15 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    rotateY: cardTilt.rotateY, 
                    rotateX: cardTilt.rotateX, 
                    y: 0 
                  }}
                  exit={{ opacity: 0, scale: 0.95, rotateY: 12, y: -15 }}
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="absolute inset-0 bg-white rounded-3xl shadow-2xl shadow-purple-900/15 border-2 border-white/90 overflow-hidden flex flex-col justify-between z-20 transition-shadow duration-300"
                >
                  {/* Card Visual Header with Thumbnail & Badges */}
                  <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-900">
                    <img 
                      src={activeEvent.imageThumbnail} 
                      alt={activeEvent.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
                    />
                    
                    {/* Gradient scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

                    {/* Top Badges Row */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border backdrop-blur-md ${activeEvent.badgeBg}`}>
                        {activeEvent.badge}
                      </span>
                      
                      {/* Heart Wishlist Button */}
                      <button
                        onClick={(e) => toggleLike(e, activeEvent.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
                          likedEvents[activeEvent.id]
                            ? 'bg-rose-500 text-white scale-110'
                            : 'bg-white/80 hover:bg-white text-slate-700 backdrop-blur-sm'
                        }`}
                        title="Save to Wishlist"
                      >
                        <Heart className={`w-4 h-4 ${likedEvents[activeEvent.id] ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Urgent Spots Banner */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white z-10">
                      <div className="flex items-center gap-1.5 text-xs font-bold bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{activeEvent.time}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-extrabold bg-rose-500/90 text-white px-2.5 py-1 rounded-lg shadow-sm">
                        <Flame className="w-3.5 h-3.5 animate-bounce" />
                        <span>{activeEvent.spotsLeft} spots left</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Category & Rating */}
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className={`font-extrabold uppercase tracking-wider text-[10px] ${activeEvent.accentText}`}>
                          {activeEvent.categoryIcon} {activeEvent.category}
                        </span>
                        <div className="flex items-center gap-1 font-bold text-slate-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                          <span>{activeEvent.rating}</span>
                          <span className="text-slate-400 text-[10px]">({activeEvent.reviewsCount})</span>
                        </div>
                      </div>

                      {/* Event Title */}
                      <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-snug line-clamp-1 mb-1">
                        {activeEvent.title}
                      </h3>

                      {/* Subtitle */}
                      <p className="text-xs text-slate-500 line-clamp-1 mb-3">
                        {activeEvent.subtitle}
                      </p>

                      {/* Location & Age metadata chips */}
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 mb-3">
                        <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md font-semibold">
                          <MapPin className="w-3 h-3 text-purple-600" />
                          {activeEvent.location}
                        </span>
                        <span className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-semibold">
                          <Users className="w-3 h-3 text-purple-600" />
                          {activeEvent.age}
                        </span>
                        <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                          Verified Coach ✓
                        </span>
                      </div>
                    </div>

                    {/* Price & Action Row */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Per Child</div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg sm:text-xl font-black text-slate-900">{activeEvent.price}</span>
                          {activeEvent.originalPrice && (
                            <span className="text-xs text-slate-400 line-through font-semibold">{activeEvent.originalPrice}</span>
                          )}
                        </div>
                      </div>

                      <Button
                        onClick={() => router.push(`/explore?q=${encodeURIComponent(activeEvent.title)}`)}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold px-4 sm:px-5 py-2.5 rounded-xl shadow-md shadow-purple-600/20 text-xs sm:text-sm flex items-center gap-1.5 group cursor-pointer"
                      >
                        <span>Book Pass</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows for Card Deck */}
              <button
                onClick={() => setActiveDeckIndex(prev => (prev - 1 + HERO_DECK_EVENTS.length) % HERO_DECK_EVENTS.length)}
                className="absolute -left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white/90 shadow-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-white hover:scale-110 transition-all cursor-pointer"
                title="Previous Activity"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveDeckIndex(prev => (prev + 1) % HERO_DECK_EVENTS.length)}
                className="absolute -right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white/90 shadow-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-white hover:scale-110 transition-all cursor-pointer"
                title="Next Activity"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Deck Progress Dots Indicator */}
            <div className="flex items-center gap-1.5 mt-4">
              {HERO_DECK_EVENTS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveDeckIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeDeckIndex 
                      ? 'w-6 bg-purple-600' 
                      : 'w-2 bg-purple-200 hover:bg-purple-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
