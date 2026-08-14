"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { EventCard } from '@/components/shared/EventCard';
import { HorizontalCarousel } from '@/components/ui/HorizontalCarousel';
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

// ── Main TrendingEvents section ──
import { useSelectedLocation } from '@/components/shared/LocationSelector';

export function TrendingEvents() {
  const { selectedCity } = useSelectedLocation();
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'This Weekend', 'Sports', 'Arts & Crafts', 'Music'];
  const [events, setEvents] = useState<Event[]>(() =>
    SEED_EVENTS.filter(e => e && e.status === 'approved').slice(0, 4)
  );

  React.useEffect(() => {
    async function loadEvents() {
      try {
        // Always fetch full pool of approved events for fallback
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

        // Deduplicate & sanitize valid events
        const validEvents: Event[] = [];
        const seenIds = new Set<string>();
        for (const item of filtered) {
          if (item && item.id && !seenIds.has(item.id)) {
            seenIds.add(item.id);
            validEvents.push(item);
          }
        }

        // For 'All' tab, fill up to 8 events from validApproved
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
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-slate-50 to-purple-50/30 relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10">
          <div>
            <span className="px-3.5 py-1 rounded-full bg-rose-100 text-rose-700 text-micro font-extrabold uppercase tracking-wider inline-block mb-2 shadow-xs">
              🔥 Hot Right Now
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2 tracking-tight">Trending Activities</h2>
            <p className="text-slate-600 text-body font-medium">Discover the most popular events, courses, and workshops near you.</p>
          </div>
          <Link href="/explore" className="mt-4 md:mt-0 inline-flex items-center text-purple-700 font-extrabold hover:text-amber-600 group text-caption shrink-0 transition-colors">
            View All Activities
            <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto pb-4 mb-8 space-x-2 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-extrabold transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-white text-slate-800 border border-slate-200/90 hover:border-amber-400 hover:bg-amber-50/40 shadow-xs'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Event Cards Carousel with touch-swipe & desktop arrow navigation */}
        {events.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 p-8 shadow-xs max-w-md mx-auto">
            <p className="text-slate-600 font-semibold text-sm">No activities found for "{activeTab}".</p>
            <p className="text-slate-400 text-xs mt-1">Try selecting 'All' to view available activities.</p>
          </div>
        ) : (
          <HorizontalCarousel>
            {events.filter(e => e && e.id).map(event => (
              <div key={event.id} className="snap-start shrink-0 w-[280px] sm:w-[320px] lg:w-[340px] xl:w-[350px] h-full">
                <EventCard event={event} />
              </div>
            ))}
          </HorizontalCarousel>
        )}

      </div>

      <ZigzagDivider className="text-purple-200/40" />
    </section>
  );
}
