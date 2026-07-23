'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Users, Heart, Flame, Sparkles, TrendingUp, Leaf, Star, ArrowRight } from 'lucide-react';
import { Event } from '@/types';

import { ageBracketNames, getTypeBadgeStyle, getListingTypeDisplayName, listingTypeNames } from '@/utils/event';
export { ageBracketNames, getTypeBadgeStyle, getListingTypeDisplayName, listingTypeNames };

// ── Data-driven badge ──
type BadgeType = 'hot' | 'popular' | 'new' | 'trending';

export function getEventBadge(event: Event): BadgeType {
  if (event.seats_available > 0 && event.seats_available <= 5) return 'hot';
  if (event.is_sponsored) return 'popular';
  const eventDate = new Date(event.event_date);
  const daysAhead = (eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  if (daysAhead >= 0 && daysAhead <= 30) return 'new';
  return 'trending';
}

const BADGE_CONFIG: Record<BadgeType, { label: string; bg: string; Icon: React.ElementType }> = {
  hot:      { label: 'Hot',      bg: 'bg-red-500',    Icon: Flame      },
  popular:  { label: 'Popular',  bg: 'bg-orange-500', Icon: Star       },
  new:      { label: 'New',      bg: 'bg-green-500',  Icon: Leaf       },
  trending: { label: 'Trending', bg: 'bg-purple-600', Icon: TrendingUp },
};

// ── Wishlist heart ──
function WishlistHeart({ eventId }: { eventId: string }) {
  const [liked, setLiked] = useState(false);
  return (
    <button
      aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
      onClick={e => { e.preventDefault(); e.stopPropagation(); setLiked(l => !l); }}
      className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
        liked ? 'bg-red-500 text-white scale-110' : 'bg-white/90 text-slate-400 hover:text-red-400'
      }`}
    >
      <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
    </button>
  );
}

// ── The shared event card ──
export function EventCard({ event }: { event: Event }) {
  const badge = getEventBadge(event);
  const { label, bg, Icon } = BADGE_CONFIG[badge];

  return (
    <Link href={`/events/${event.id}`} className="group block h-full">
      <div className="bg-white rounded-[24px] overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col electric-border-hover">

        {/* Image */}
        <div className="relative h-48 overflow-hidden shrink-0">
          <img
            src={event.image_url || 'https://images.unsplash.com/photo-1574629810360-7efbb192569a?w=600&auto=format&fit=crop&q=60'}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Status badge — top left */}
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-md ${bg} text-white`}>
              <Icon className="w-3 h-3" />
              {label}
            </span>
          </div>

          {/* Wishlist — top right */}
          <div className="absolute top-3 right-3">
            <WishlistHeart eventId={event.id} />
          </div>

          {/* Sponsored tag */}
          {event.is_sponsored && (
            <div className="absolute bottom-3 left-3">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-600 text-white shadow">
                <Sparkles className="w-2.5 h-2.5" /> Sponsored
              </span>
            </div>
          )}

          {/* Seats warning */}
          {event.seats_available > 0 && event.seats_available <= 5 && (
            <div className="absolute bottom-3 right-3">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 shadow">
                Only {event.seats_available} left!
              </span>
            </div>
          )}
          {event.seats_available === 0 && (
            <div className="absolute bottom-3 right-3">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600 shadow">Sold Out</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col flex-1">
          {/* Type Badge + Category pill + age */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getTypeBadgeStyle(event.listing_type)}`}>
              {getListingTypeDisplayName(event.listing_type)}
            </span>
            <span className="text-[11px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              {event.category}
            </span>
            <span className="flex items-center text-xs text-slate-500 font-medium ml-auto">
              <Users className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {ageBracketNames[event.age_bracket] || 'All ages'}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-lg text-slate-900 mb-1 line-clamp-2 group-hover:text-purple-600 transition-colors leading-snug">
            {event.title}
          </h3>

          {/* Organizer */}
          <p className="text-sm text-slate-500 mb-3 font-medium line-clamp-1">{event.organizer?.name}</p>

          {/* Date */}
          <div className="flex items-center text-sm text-slate-600 mb-1.5">
            <Calendar className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
            {new Date(event.event_date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
            {event.event_time ? ` · ${event.event_time.slice(0, 5)}` : ''}
          </div>

          {/* Location */}
          <div className="flex items-center text-sm text-slate-600 mb-3">
            <MapPin className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
            <span className="truncate">
              {event.is_online ? 'Online Webinar' : (event.location || 'Online')}
            </span>
          </div>

          {/* Type-Specific Extras */}
          {event.listing_type === 'competition' && event.prize_details && (
            <div className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1.5 mb-3 flex items-center gap-1.5 shrink-0">
              <span className="shrink-0">🏆 Prize:</span>
              <span className="truncate">{event.prize_details}</span>
            </div>
          )}

          {event.listing_type === 'course' && (event.session_count || event.session_frequency) && (
            <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1.5 mb-3 flex items-center gap-1.5 shrink-0">
              <span className="shrink-0">📚 Schedule:</span>
              <span className="truncate">
                {event.session_count ? `${event.session_count} ` : ''}
                {event.session_frequency || 'weekly'} sessions
                {event.course_duration_weeks ? ` (${event.course_duration_weeks} weeks)` : ''}
              </span>
            </div>
          )}

          {/* Price + Book Now */}
          <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <div>
              <span className="font-bold text-xl text-slate-900">₹{event.price}</span>
              <span className="text-xs text-slate-400 ml-1">/ child</span>
            </div>
            <button
              onClick={e => e.stopPropagation()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-sm font-semibold rounded-full transition-all duration-150 shadow-sm shadow-purple-500/30 shrink-0"
            >
              {event.listing_type === 'webinar' ? 'Join Online' : 'Book Now'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
