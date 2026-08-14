'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, MapPin, Calendar, Users, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { dbService, SEED_EVENTS } from '@/services/db';
import { Event } from '@/types';
import { Button } from '@/components/ui/Button';
import { ageBracketDisplayNames } from '@/utils/event';

export function FeaturedEventSection() {
  const [featuredEvent, setFeaturedEvent] = useState<Event | null>(() => SEED_EVENTS[0] || null);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const approved = await dbService.getEvents({ status: 'approved' });
        if (approved && approved.length > 0) {
          // Prefer sponsored or top rated event
          const sponsored = approved.find(e => e.is_sponsored) || approved[0];
          setFeaturedEvent(sponsored);
        }
      } catch (err) {
        console.error('Failed to fetch featured event:', err);
      }
    }
    loadFeatured();
  }, []);

  if (!featuredEvent) return null;

  const ageDisplay = ageBracketDisplayNames[featuredEvent.age_bracket] || featuredEvent.age_bracket;
  const isOnline = featuredEvent.is_online;
  const locationLabel = isOnline ? 'Online Workshop' : (featuredEvent.location || 'Local Venue');

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
        
        {/* Header Label */}
        <div className="flex items-center gap-2 mb-8">
          <span className="px-3.5 py-1 rounded-full bg-amber-400 text-amber-950 text-micro font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Spotlight Featured Experience
          </span>
        </div>

        {/* 2-Column Asymmetric Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column (Image & Overlay - 7 cols) */}
          <div className="lg:col-span-7 relative group">
            <div className="relative h-[320px] sm:h-[400px] md:h-[460px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
              <img
                src={featuredEvent.image_url || 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800'}
                alt={featuredEvent.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-purple-600/90 backdrop-blur-md text-white text-micro font-bold shadow-md">
                  {featuredEvent.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/90 backdrop-blur-md text-white text-micro font-bold shadow-md flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Partner
                </span>
              </div>

              {/* Price Tag Overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                  <span className="text-micro text-slate-300 block">Registration Fee</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-white">
                    {featuredEvent.price > 0 ? `₹${featuredEvent.price}` : 'FREE'}
                  </span>
                </div>

                <div className="bg-amber-400/90 text-amber-950 backdrop-blur-md px-3.5 py-1.5 rounded-xl font-bold text-micro flex items-center gap-1 shadow-md">
                  <Star className="w-4 h-4 fill-current" />
                  4.9 Rating (Verified)
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Content Details - 5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-purple-300 font-bold text-caption uppercase tracking-wider block mb-1">
                Age: {ageDisplay}
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight">
                {featuredEvent.title}
              </h3>
              <p className="text-slate-300 text-body mt-3 leading-relaxed font-medium line-clamp-3">
                {featuredEvent.description}
              </p>
            </div>

            {/* Event Metadata Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white/10 text-purple-300 shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-micro text-slate-400 block font-semibold">Date & Time</span>
                  <span className="text-caption font-bold text-white">{featuredEvent.event_date}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white/10 text-amber-300 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-micro text-slate-400 block font-semibold">Location</span>
                  <span className="text-caption font-bold text-white line-clamp-1">{locationLabel}</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3 pt-4">
              <Link href={`/events/${featuredEvent.id}/book`} className="flex-1">
                <Button className="w-full h-12 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-body shadow-lg shadow-purple-500/30">
                  Book Experience Now
                </Button>
              </Link>
              <Link href={`/events/${featuredEvent.id}`}>
                <Button variant="outline" className="h-12 px-5 rounded-xl border-white/20 text-white hover:bg-white/10 font-bold text-caption">
                  Details <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
