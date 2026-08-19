"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { EventCard } from '@/components/shared/EventCard';
import { dbService as db, SEED_EVENTS } from '@/services/db';
import { Event } from '@/types';


import { motion } from 'framer-motion';
import { ZigzagDivider } from '@/components/ui/SectionDividers';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: 'easeOut' as const }
  },
};

import { useSelectedLocation } from '@/components/shared/LocationSelector';

export function TrendingEvents() {
  const { selectedCity } = useSelectedLocation();
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'This Weekend', 'Sports', 'Arts & Crafts', 'Music'];
  const [events, setEvents] = useState<Event[]>(() =>
    SEED_EVENTS.filter(e => e && e.status === 'approved').slice(0, 8)
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const [visibleCount, setVisibleCount] = useState(1);

  React.useEffect(() => {
    setCurrentIndex(0);
  }, [activeTab, selectedCity]);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setVisibleCount(4);
      } else if (window.innerWidth >= 1024) {
        setVisibleCount(3);
      } else if (window.innerWidth >= 640) {
        setVisibleCount(2);
      } else {
        setVisibleCount(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, events.length - visibleCount);

  const handleNext = React.useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const handlePrev = React.useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto rotation every 4.5 seconds
  React.useEffect(() => {
    if (isHovered || maxIndex === 0) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(interval);
  }, [isHovered, maxIndex, handleNext]);

  // Touch handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsHovered(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
    if (!touchStart || !touchEnd) return;
    const diff = touchStart - touchEnd;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  React.useEffect(() => {
    async function loadEvents() {
      try {
        const allApproved = await db.getEvents({ status: 'approved' });
        const validApproved = (allApproved || []).filter(e => e && e.id);

        let fetched = validApproved;
        if (selectedCity && selectedCity !== 'All') {
          const locTarget = selectedCity.toLowerCase().trim();
          const cityMatches = validApproved.filter(e => {
            if (locTarget === 'online') {
              return e.is_online || (e.location || '').toLowerCase().includes('online');
            }
            if (e.is_online) return true;
            const loc = (e.location || '').toLowerCase();
            return loc.includes(locTarget) || locTarget.includes(loc.split(',')[0].trim());
          });
          if (cityMatches.length > 0) {
            fetched = cityMatches;
          }
        }

        let filtered = fetched;
        if (activeTab === 'Sports') {
          const sportsCats = ['football', 'sports', 'basketball', 'swimming', 'cricket', 'skating', 'martial arts', 'cycling'];
          filtered = fetched.filter(e => sportsCats.some(cat => e.category.toLowerCase().includes(cat)));
        } else if (activeTab === 'Arts & Crafts') {
          filtered = fetched.filter(e => ['arts', 'dance', 'crafts', 'drawing', 'painting'].some(cat => e.category.toLowerCase().includes(cat)));
        } else if (activeTab === 'Music') {
          filtered = fetched.filter(e => ['music', 'dance', 'singing'].some(cat => e.category.toLowerCase().includes(cat)));
        } else if (activeTab === 'This Weekend') {
          const now = new Date();
          const weekendEnd = new Date(now);
          weekendEnd.setDate(now.getDate() + 7);
          filtered = fetched.filter(e => {
            const d = new Date(e.event_date);
            return d >= now && d <= weekendEnd;
          });
        }

        const validEvents: Event[] = [];
        const seenIds = new Set<string>();
        for (const item of filtered) {
          if (item && item.id && !seenIds.has(item.id)) {
            seenIds.add(item.id);
            validEvents.push(item);
          }
        }

        if (activeTab === 'All' && validEvents.length < 8) {
          for (const item of validApproved) {
            if (item && item.id && !seenIds.has(item.id)) {
              seenIds.add(item.id);
              validEvents.push(item);
            }
            if (validEvents.length >= 8) break;
          }
        }

        setEvents(validEvents.slice(0, 8));
      } catch (err) {
        console.error('Error loading trending events:', err);
        setEvents(SEED_EVENTS.filter(e => e && e.id).slice(0, 8));
      }
    }
    loadEvents();
  }, [activeTab, selectedCity]);

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-mesh-blue-rich relative border-b border-blue-100/50">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mb-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12"
        >
          <div>
            <h2 className="text-section-title font-bold text-slate-900 mb-3 tracking-tight">Trending Activities</h2>
            <p className="text-slate-600 text-body">Discover the most popular events and classes happening around you.</p>
          </div>
          <Link href="/explore" className="mt-4 md:mt-0 flex items-center text-purple-600 font-semibold hover:text-purple-700 group text-body">
            View All Activities
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto pb-4 mb-8 space-x-2 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-350 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Event Cards Carousel */}
        {events.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm max-w-md mx-auto">
            <p className="text-slate-600 font-semibold text-sm">No activities found for "{activeTab}".</p>
            <p className="text-slate-400 text-xs mt-1">Try selecting 'All' to view all available activities.</p>
          </div>
        ) : (
          <div
            className="relative overflow-hidden w-full px-1 py-4"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="overflow-hidden">
              <motion.div
                className="flex transition-transform duration-500 ease-out animate-none"
                style={{
                  transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
                }}
              >
                {events.filter(e => e && e.id).map((event) => (
                  <div
                    key={event.id}
                    className="shrink-0 px-3 h-full"
                    style={{ width: `${100 / visibleCount}%` }}
                  >
                    <EventCard event={event} />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Left & Right navigation arrows */}
            {maxIndex > 0 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-slate-800 p-3 rounded-full shadow-lg border border-slate-100 hover:scale-110 transition-all z-20 cursor-pointer"
                  aria-label="Previous event"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-slate-800 p-3 rounded-full shadow-lg border border-slate-100 hover:scale-110 transition-all z-20 cursor-pointer"
                  aria-label="Next event"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Dot indicators */}
            {maxIndex > 0 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      currentIndex === idx ? 'bg-purple-600 w-6' : 'bg-slate-350 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <ZigzagDivider className="text-purple-200/40" />
    </section>
  );
}
