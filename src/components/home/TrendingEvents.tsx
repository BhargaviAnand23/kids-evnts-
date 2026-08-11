"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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

        // For 'All' tab, if we have fewer than 4 events, fill up to 4 from validApproved
        if (activeTab === 'All' && validEvents.length < 4) {
          for (const item of validApproved) {
            if (item && item.id && !seenIds.has(item.id)) {
              seenIds.add(item.id);
              validEvents.push(item);
            }
            if (validEvents.length >= 4) break;
          }
        }

        setEvents(validEvents.slice(0, 4));
      } catch (err) {
        console.error('Error loading trending events:', err);
        setEvents(SEED_EVENTS.filter(e => e && e.id).slice(0, 4));
      }
    }
    loadEvents();
  }, [activeTab, selectedCity]);

  // Dynamic grid column class based on actual valid cards count
  const count = events.length;
  const gridColsClass =
    count === 1
      ? 'grid-cols-1 max-w-md mx-auto'
      : count === 2
      ? 'grid-cols-1 xs:grid-cols-2 md:grid-cols-2 max-w-3xl mx-auto'
      : count === 3
      ? 'grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto'
      : 'grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-slate-50 relative">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mb-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
          <div>
            <h2 className="text-section-title font-bold text-slate-900 mb-3 tracking-tight">Trending Activities</h2>
            <p className="text-slate-600 text-body">Discover the most popular events and classes happening around you.</p>
          </div>
          <Link href="/explore" className="mt-4 md:mt-0 flex items-center text-purple-600 font-semibold hover:text-purple-700 group text-body">
            View All Activities
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto pb-4 mb-8 space-x-2 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Event Cards Grid */}
        {events.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm max-w-md mx-auto">
            <p className="text-slate-600 font-semibold text-sm">No activities found for "{activeTab}".</p>
            <p className="text-slate-400 text-xs mt-1">Try selecting 'All' to view all available activities.</p>
          </div>
        ) : (
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className={`grid gap-4 sm:gap-6 lg:gap-8 ${gridColsClass}`}
          >
            {events.filter(e => e && e.id).map(event => (
              <motion.div key={event.id} variants={cardVariants}>
                <EventCard event={event} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <ZigzagDivider className="text-purple-200/40" />
    </section>
  );
}
