"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { EventCard } from '@/components/shared/EventCard';
import { dbService as db, SEED_EVENTS } from '@/services/db';
import { Event } from '@/types';


// ── Main TrendingEvents section ──
export function TrendingEvents() {
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'This Weekend', 'Sports', 'Arts & Crafts', 'Music'];
  const [events, setEvents] = useState<Event[]>(() =>
    SEED_EVENTS.filter(e => e.status === 'approved').slice(0, 4)
  );

  React.useEffect(() => {
    async function loadEvents() {
      try {
        let fetched = await db.getEvents({ status: 'approved' });
        if (!fetched || fetched.length === 0) {
          fetched = SEED_EVENTS.filter(e => e.status === 'approved');
        }

        let filtered = fetched;
        if (activeTab === 'Sports') {
          const sportsCats = ['football', 'basketball', 'swimming', 'cricket', 'skating', 'martial arts', 'cycling'];
          filtered = fetched.filter(e => sportsCats.includes(e.category.toLowerCase()));
        } else if (activeTab === 'Arts & Crafts') {
          filtered = fetched.filter(e => ['arts', 'dance', 'crafts'].includes(e.category.toLowerCase()));
        } else if (activeTab === 'Music') {
          filtered = fetched.filter(e => ['music', 'dance'].includes(e.category.toLowerCase()));
        } else if (activeTab === 'This Weekend') {
          const now = new Date();
          const weekendEnd = new Date(now);
          weekendEnd.setDate(now.getDate() + 7);
          filtered = fetched.filter(e => {
            const d = new Date(e.event_date);
            return d >= now && d <= weekendEnd;
          });
          if (filtered.length === 0) filtered = fetched; // fallback
        }

        setEvents((filtered.length > 0 ? filtered : fetched).slice(0, 4));
      } catch (err) {
        console.error('Error loading trending events:', err);
        setEvents(SEED_EVENTS.slice(0, 4));
      }
    }
    loadEvents();
  }, [activeTab]);

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
