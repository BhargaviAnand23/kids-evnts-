'use client';
import React, { useState } from 'react';
import { Search, MapPin, Calendar, Star, Map } from 'lucide-react';
import { Button } from '../ui/Button';
import { CountUp } from '@/components/animations/CountUp';
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
  const [locationValue, setLocationValue] = useState('Chennai');
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchValue.trim()) params.set('q', searchValue.trim());
    router.push(`/explore?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden py-12 md:py-16 lg:py-20"
      style={{ background: 'linear-gradient(135deg, #ede9fe 0%, #fce7f3 40%, #fff7ed 100%)' }}>

      {/* ── Scattered decorative doodles ── */}
      <StarDoodle   className="absolute top-8  left-8   w-5 h-5  text-purple-400  opacity-50 rotate-12" />
      <SparkDoodle  className="absolute top-16 left-24  w-4 h-4  text-amber-400   opacity-60 -rotate-6" />
      <DotDoodle    className="absolute top-6  left-48  w-3 h-3  text-pink-400    opacity-40" />
      <StarDoodle   className="absolute top-24 right-32 w-6 h-6  text-amber-500   opacity-50 rotate-45" />
      <SparkDoodle  className="absolute top-8  right-16 w-5 h-5  text-purple-500  opacity-40 rotate-12" />
      <DotDoodle    className="absolute top-40 right-8  w-4 h-4  text-pink-500    opacity-35" />
      <StarDoodle   className="absolute bottom-24 left-12 w-4 h-4 text-purple-400 opacity-40 -rotate-12" />
      <SparkDoodle  className="absolute bottom-16 left-40 w-3 h-3 text-amber-400  opacity-50" />
      <DotDoodle    className="absolute bottom-10 right-48 w-3 h-3 text-purple-300 opacity-45" />
      <StarDoodle   className="absolute bottom-32 right-24 w-5 h-5 text-amber-500 opacity-40 rotate-20" />

      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* ── Left Column ── */}
          <div className="flex-1 text-center lg:text-left">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100/80 text-purple-700 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
              <SparkDoodle className="w-4 h-4 text-purple-500" />
              <span>The #1 Youth Activity Platform</span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-[1.15] tracking-tight mb-6">
              Make Every{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-500">
                Weekend
              </span>{' '}
              Special!
            </h1>

            <p className="text-slate-600 text-base md:text-lg mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Discover, book, and track top-rated sports, arts, music, and learning programs designed for children of all ages — all in one seamless place.
            </p>

            {/* Search Bar — unchanged */}
            <div className="bg-white p-2 md:p-3 rounded-full shadow-lg border border-slate-100 flex flex-col md:flex-row items-center gap-2 mb-10 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center px-4 w-full md:w-auto flex-1 py-2 border-b md:border-b-0 md:border-r border-slate-100">
                <Search className="w-5 h-5 text-purple-600 mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="What activity is your child into?"
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  className="w-full bg-transparent text-sm md:text-base focus:outline-none text-slate-800 placeholder-slate-400"
                />
              </div>
              <div className="flex items-center px-4 w-full md:w-auto flex-1 py-2">
                <MapPin className="w-5 h-5 text-purple-600 mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="City or postal code"
                  value={locationValue}
                  onChange={e => setLocationValue(e.target.value)}
                  className="w-full bg-transparent text-sm md:text-base focus:outline-none text-slate-800 placeholder-slate-400"
                />
              </div>
              <Button
                size="lg"
                onClick={handleSearch}
                className="w-full md:w-auto md:ml-2 rounded-full h-12 md:h-14 px-8 text-sm md:text-base shrink-0 mt-2 md:mt-0 shadow-md shadow-purple-500/25"
              >
                Search
              </Button>
            </div>

            {/* Stats Row — unchanged */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 md:gap-12 text-slate-700">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-600 mr-3">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-lg md:text-xl leading-none mb-1">
                    <CountUp end={500} suffix="+" duration={1500} />
                  </div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Events</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-600 mr-3">
                  <Map className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-lg md:text-xl leading-none mb-1">
                    <CountUp end={120} suffix="+" duration={1500} />
                  </div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Venues</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 mr-3">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-lg md:text-xl leading-none mb-1">
                    <CountUp end={4.9} decimals={1} suffix="/5" duration={1500} />
                  </div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column — Photo collage ── */}
          <div className="w-full lg:w-1/2 relative h-[380px] sm:h-[460px] md:h-[520px] lg:h-[560px] mt-6 lg:mt-0 pr-2 sm:pr-4">

            {/* Main large photo */}
            <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-4/5 h-[85%] rounded-[40px] overflow-visible z-10 rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="w-full h-full rounded-[40px] overflow-hidden shadow-2xl shadow-slate-900/20 border-8 border-white/60">
                <img
                  src="https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800&auto=format&fit=crop&q=70"
                  alt="Child playing soccer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Floating card 1 — Hip Hop Dance */}
            <div className="absolute left-0 top-[10%] sm:top-[15%] w-44 sm:w-52 bg-white rounded-2xl overflow-hidden shadow-xl z-20 -rotate-6 hover:-translate-y-2 transition-transform duration-300">
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
            <div className="absolute left-[5%] sm:left-[8%] bottom-[5%] sm:bottom-[8%] w-48 sm:w-56 bg-white rounded-2xl overflow-hidden shadow-xl z-20 rotate-3 hover:-translate-y-2 transition-transform duration-300">
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
            <div className="hidden sm:block absolute right-0 bottom-[20%] w-36 bg-white rounded-2xl overflow-hidden shadow-xl z-20 rotate-6 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-full h-24 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&auto=format&fit=crop&q=70"
                  alt="Swim Lessons"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2.5">
                <h4 className="font-bold text-xs text-slate-900 leading-tight">Swim Lessons</h4>
                <p className="text-[10px] text-purple-600 font-semibold mt-0.5">Few seats left!</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
