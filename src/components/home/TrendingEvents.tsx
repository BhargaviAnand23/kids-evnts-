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
    SEED_EVENTS.filter(e => e.status === 'approved').slice(0, 4)
  );

  React.useEffect(() => {
    async function loadEvents() {
      try {
        let fetched = await db.getEvents({ status: 'approved', location: selectedCity });
        if (!fetched || fetched.length === 0) {
          fetched = SEED_EVENTS.filter(e => e.status === 'approved');
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

        // Guarantee 4 items to fill the 4-column grid without empty gaps
        const displayEvents = [...filtered];
        if (displayEvents.length < 4) {
          for (const item of fetched) {
            if (!displayEvents.some(d => d.id === item.id)) {
              displayEvents.push(item);
            }
            if (displayEvents.length >= 4) break;
          }
        }

        setEvents(displayEvents.slice(0, 4));
      } catch (err) {
        console.error('Error loading trending events:', err);
        setEvents(SEED_EVENTS.slice(0, 4));
      }
    }
    loadEvents();
  }, [activeTab, selectedCity]);

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 mb-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">Trending Activities</h2>
            <p className="text-slate-600 text-base">Discover the most popular events and classes happening around you.</p>
          </div>
          <Link href="/explore" className="mt-4 md:mt-0 flex items-center text-purple-600 font-semibold hover:text-purple-700 group text-sm md:text-base">
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
        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {events.map(event => (
            <motion.div key={event.id} variants={cardVariants}>
              <EventCard event={event} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <ZigzagDivider className="text-purple-200/40" />
    </section>
  );
}
