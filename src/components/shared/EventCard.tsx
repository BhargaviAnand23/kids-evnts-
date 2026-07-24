'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Users, Heart, Flame, Sparkles, TrendingUp, Leaf, Star, ArrowRight } from 'lucide-react';
import { Event } from '@/types';

import { ageBracketNames, ageBracketDisplayNames, getTypeBadgeStyle, getListingTypeDisplayName, listingTypeNames } from '@/utils/event';
export { ageBracketNames, ageBracketDisplayNames, getTypeBadgeStyle, getListingTypeDisplayName, listingTypeNames };

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

import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import { dbService } from '@/services/db';

export function WishlistHeart({ eventId, className = '' }: { eventId: string; className?: string }) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [parentId, setParentId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const checkSaved = async () => {
      const user = await authService.getCurrentUser();
      if (!user) return;
      const profile = await dbService.getParentProfile(user.id);
      if (!profile || !active) return;
      setParentId(profile.id);
      const isSaved = await dbService.isEventSaved(profile.id, eventId);
      if (active) setLiked(isSaved);
    };
    checkSaved();
    return () => { active = false; };
  }, [eventId]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    let pid = parentId;
    if (!pid) {
      const user = await authService.getCurrentUser();
      if (!user) {
        router.push('/login');
        return;
      }
      const profile = await dbService.getParentProfile(user.id);
      if (!profile) {
        router.push('/login');
        return;
      }
      pid = profile.id;
      setParentId(profile.id);
    }

    const nextState = !liked;
    setLiked(nextState);
    try {
      if (nextState) {
        await dbService.saveEvent(pid, eventId);
      } else {
        await dbService.unsaveEvent(pid, eventId);
      }
    } catch (err) {
      console.error('Failed to update wishlist:', err);
      setLiked(!nextState);
    }
  };

  return (
    <button
      aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
      onClick={handleClick}
      className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
        liked ? 'bg-red-500 text-white scale-110' : 'bg-white/90 text-slate-400 hover:text-red-500 hover:bg-white'
      } ${className}`}
    >
      <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
    </button>
  );
}

// ── Game Meter Progress Bar Component ──
export function SeatsGameMeter({
  seatsTotal = 20,
  seatsAvailable = 20,
  compact = false
}: {
  seatsTotal?: number;
  seatsAvailable?: number;
  compact?: boolean;
}) {
  const total = Math.max(1, seatsTotal || 20);
  const available = Math.max(0, seatsAvailable ?? total);
  const filled = Math.min(total, Math.max(0, total - available));
  const percentFilled = Math.round((filled / total) * 100);

  const isFull = available === 0;
  const isAlmostFull = available > 0 && available <= 5;

  let gradient = 'from-purple-600 via-amber-400 to-emerald-500';
  let badgeIcon = '⚡';
  let badgeText = `${available} seats left`;

  if (isFull) {
    gradient = 'from-rose-500 to-red-600';
    badgeIcon = '⛔';
    badgeText = 'Sold Out';
  } else if (isAlmostFull) {
    gradient = 'from-amber-500 via-rose-500 to-red-500';
    badgeIcon = '🔥';
    badgeText = `Only ${available} left!`;
  }

  if (compact) {
    return (
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md shadow-slate-900/10 rounded-2xl px-3 py-2 flex flex-col gap-1.5 min-w-[125px]">
        {/* Top row: Status text */}
        <div className="flex items-center justify-between text-[11px] font-black leading-none">
          <span className={`flex items-center gap-1.5 ${isFull ? 'text-rose-600 font-black' : isAlmostFull ? 'text-amber-700 font-black' : 'text-slate-800 font-extrabold'}`}>
            <span>{badgeIcon}</span>
            <span>{badgeText}</span>
          </span>
        </div>
        {/* Bottom row: Thicker game meter bar */}
        <div className="w-full h-2.5 bg-slate-200/90 rounded-full overflow-hidden relative shadow-inner">
          <div
            className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500 relative overflow-hidden`}
            style={{ width: `${percentFilled}%` }}
          >
            <div className="absolute inset-0 bg-white/40 animate-meter-shine" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50/90 border border-slate-200/80 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between text-xs mb-2.5 font-black">
        <span className="text-slate-800 flex items-center gap-1.5">
          <span className="text-purple-600">⚡ Seats Filled</span>
        </span>
        <span className={isFull ? 'text-rose-600 font-black' : isAlmostFull ? 'text-amber-700 font-black' : 'text-slate-700 font-bold'}>
          {isFull ? 'Sold Out' : `${filled} of ${total} (${percentFilled}%)`}
        </span>
      </div>
      <div className="w-full h-3 bg-slate-200/90 rounded-full overflow-hidden relative shadow-inner">
        <div
          className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500 relative overflow-hidden`}
          style={{ width: `${percentFilled}%` }}
        >
          <div className="absolute inset-0 bg-white/40 animate-meter-shine" />
        </div>
      </div>
      <div className="flex justify-between items-center text-[11px] text-slate-500 font-semibold mt-2">
        <span>0 filled</span>
        <span className="font-bold text-purple-700">{available} seats available</span>
        <span>{total} capacity</span>
      </div>
    </div>
  );
}

// ── The shared event card ──
export function EventCard({ event }: { event: Event }) {
  const badge = getEventBadge(event);
  const { label, bg, Icon } = BADGE_CONFIG[badge];

  // 3D Tilt state
  const [tilt, setTilt] = useState({ x: 0, y: 0, active: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 8, y: -y * 8, active: true });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, active: false });
  };

  // Age-bracket contextual styling (Requirement 7: Early Years playful/rounded vs Teens clean)
  const isEarlyYears = event.age_bracket === 'early_years';
  const isTeens = event.age_bracket === 'teens';

  const cardRadiusClass = isEarlyYears
    ? 'rounded-[28px] border-2 border-amber-200/50 shadow-amber-900/5'
    : isTeens
    ? 'rounded-2xl border border-slate-200/80 shadow-slate-900/5'
    : 'rounded-[24px] border border-slate-100 shadow-purple-900/5';

  const ageBadgeStyle = isEarlyYears
    ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300/60 rounded-full px-2.5 py-0.5'
    : isTeens
    ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200/60 rounded-md px-2 py-0.5'
    : 'bg-slate-100 text-slate-700 font-medium rounded-full px-2 py-0.5';

  return (
    <Link href={`/events/${event.id}`} className="group block h-full">
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: tilt.active
            ? `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale3d(1.02, 1.02, 1.02)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: tilt.active ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
        }}
        className={`bg-white overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 h-full flex flex-col electric-border-hover ${cardRadiusClass}`}
      >

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
          <div className="absolute top-3 right-3 z-10">
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

          {/* Seats Game Meter Progress Bar — bottom right overlay */}
          <div className="absolute bottom-3 right-3 z-10">
            <SeatsGameMeter
              compact
              seatsTotal={event.seats_total || 20}
              seatsAvailable={event.seats_available}
            />
          </div>
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
            <span className={`flex items-center text-xs ml-auto ${ageBadgeStyle}`}>
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
