'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Users, Heart, Flame, Sparkles, TrendingUp, Leaf, Star, ArrowRight } from 'lucide-react';
import { Event } from '@/types';

import { ageBracketNames, ageBracketDisplayNames, getTypeBadgeStyle, getListingTypeDisplayName, listingTypeNames } from '@/utils/event';
import { ShareButton } from '@/components/shared/ShareButton';
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

const BADGE_CONFIG: Record<BadgeType, { label: string; bg: string; text: string; Icon: React.ElementType }> = {
  hot:      { label: 'Hot',      bg: 'bg-fuchsia-600', text: 'text-white',     Icon: Flame      },
  popular:  { label: 'Popular',  bg: 'bg-amber-400',   text: 'text-amber-950', Icon: Star       },
  new:      { label: 'New',      bg: 'bg-emerald-600', text: 'text-white',     Icon: Leaf       },
  trending: { label: 'Trending', bg: 'bg-indigo-600',  text: 'text-white',     Icon: TrendingUp },
};

import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import { dbService } from '@/services/db';

export function WishlistHeart({
  eventId,
  className = '',
  size = 'md',
  variant = 'overlay',
}: {
  eventId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'overlay' | 'header';
}) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [parentId, setParentId] = useState<string | null>(null);
  const [isAnimate, setIsAnimate] = useState(false);

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

    setIsAnimate(true);
    setTimeout(() => setIsAnimate(false), 300);

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

  const iconSizes = {
    sm: 'w-4 h-4',       // ~16px
    md: 'w-5 h-5',       // ~20px
    lg: 'w-5.5 h-5.5'    // ~22px
  }[size];

  const buttonClass = variant === 'header'
    ? `p-2.5 text-[#6B7280] hover:text-[#7C3AED] hover:bg-purple-50 rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer bg-transparent border-0 outline-none shadow-none ${isAnimate ? 'animate-heart-pop' : ''} ${className}`
    : `relative inline-flex items-center justify-center p-1 bg-transparent border-0 outline-none cursor-pointer transition-all duration-300 ease-out transform active:scale-90 hover:scale-125 focus:outline-none ${isAnimate ? 'animate-heart-pop' : ''} ${className}`;

  const heartClass = variant === 'header'
    ? liked
      ? 'fill-purple-600 text-purple-600 stroke-purple-600'
      : 'fill-transparent text-[#6B7280] hover:text-[#7C3AED] stroke-[2] transition-colors'
    : liked
      ? 'fill-purple-600 text-purple-600 stroke-purple-600 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]'
      : 'fill-transparent text-white stroke-white stroke-[2.3] drop-shadow-[0_2px_5px_rgba(0,0,0,0.65)] hover:stroke-purple-200';

  return (
    <button
      type="button"
      aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
      onClick={handleClick}
      className={buttonClass}
    >
      <Heart className={`${iconSizes} ${heartClass}`} />
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
  const { label, bg, text, Icon } = BADGE_CONFIG[badge];

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

  // Standardized Card Border & Shadow across all event cards
  const cardBorderClass = event.is_sponsored
    ? 'rounded-2xl border border-purple-200 shadow-sm hover:border-purple-400 hover:shadow-xl'
    : 'rounded-2xl border border-slate-200/80 shadow-sm hover:border-purple-300 hover:shadow-xl';

  // Standardized Age Badge style across all event cards
  const ageBadgeStyle = 'bg-slate-100 text-slate-700 font-medium rounded-full px-2.5 py-0.5 border border-slate-200/60';

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
        className={`bg-white overflow-hidden transition-all duration-300 h-full flex flex-col electric-glow-hover ${cardBorderClass}`}
      >

        {/* Image */}
        <div className="relative h-48 sm:h-52 lg:h-56 xl:h-60 overflow-hidden shrink-0">
          <img
            src={event.image_url || 'https://images.unsplash.com/photo-1574629810360-7efbb192569a?w=600&auto=format&fit=crop&q=60'}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Status badge — top left */}
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-md ${bg} ${text}`}>
              <Icon className="w-3 h-3" />
              {label}
            </span>
          </div>

          {/* Top right actions: Wishlist + Share */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
            <ShareButton
              title={event.title}
              text={`Check out ${event.title} on Kidspire!`}
              url={`/events/${event.id}`}
              variant="overlay"
            />
            <WishlistHeart eventId={event.id} />
          </div>

          {/* Sponsored tag */}
          {event.is_sponsored && (
            <div className="absolute bottom-3 left-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-micro font-bold bg-purple-600 text-white shadow">
                <Sparkles className="w-3 h-3" /> Sponsored
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 lg:p-6 flex flex-col flex-1">
          {/* Type Badge + Category pill + age */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={`text-micro font-bold px-2 py-0.5 rounded border shrink-0 ${getTypeBadgeStyle(event.listing_type)}`}>
              {getListingTypeDisplayName(event.listing_type)}
            </span>
            <span className="text-micro font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full shrink-0">
              {event.category}
            </span>
            <span className={`flex items-center text-caption ml-auto shrink-0 ${ageBadgeStyle}`}>
              <Users className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {ageBracketNames[event.age_bracket] || 'All ages'}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-card-title text-slate-900 mb-1 line-clamp-2 group-hover:text-purple-600 transition-colors leading-snug">
            {event.title}
          </h3>

          {/* Organizer */}
          {event.organizer?.name ? (
            <span
              onClick={(e) => {
                const orgId = event.organizer_id || event.organizer?.id;
                if (orgId) {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `/organizers/${orgId}`;
                }
              }}
              className="text-caption text-slate-500 hover:text-purple-600 mb-3 font-medium line-clamp-1 cursor-pointer transition-colors inline-block"
            >
              {event.organizer.name}
            </span>
          ) : null}

          {/* Date */}
          <div className="flex items-center text-caption text-slate-600 mb-1.5">
            <Calendar className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
            {new Date(event.event_date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
            {event.event_time ? ` · ${event.event_time.slice(0, 5)}` : ''}
          </div>

          {/* Location */}
          <div className="flex items-center text-caption text-slate-600 mb-3">
            <MapPin className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
            <span className="truncate">
              {event.is_online ? 'Online Webinar' : (event.location || 'Online')}
            </span>
          </div>

          {/* Type-Specific Extras */}
          {event.listing_type === 'competition' && event.prize_details && (
            <div className="text-caption font-semibold text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1.5 mb-3 flex items-center gap-1.5 shrink-0">
              <span className="shrink-0">🏆 Prize:</span>
              <span className="truncate">{event.prize_details}</span>
            </div>
          )}

          {event.listing_type === 'course' && (event.session_count || event.session_frequency) && (
            <div className="text-caption font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1.5 mb-3 flex items-center gap-1.5 shrink-0">
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
              <span className="font-bold text-section-title text-slate-900">₹{event.price}</span>
              <span className="text-caption text-slate-400 ml-1">/ child</span>
            </div>
            <button
              onClick={e => e.stopPropagation()}
              className="px-3.5 sm:px-4 lg:px-5 py-2 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-caption font-semibold rounded-full transition-all duration-150 shadow-sm shadow-purple-500/30 shrink-0"
            >
              {event.listing_type === 'webinar' ? 'Join Online' : 'Book Now'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
