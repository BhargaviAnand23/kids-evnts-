'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPin, SlidersHorizontal, X, Dices } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { AdBanner } from '@/components/ui/AdBanner';
import { dbService } from '@/services/db';
import { EventCard, ageBracketNames, ageBracketDisplayNames } from '@/components/shared/EventCard';
import { AnimatedList } from '@/components/animations/AnimatedList';
import { LocationSelector, useSelectedLocation } from '@/components/shared/LocationSelector';
import type { Event } from '@/types';

const CATEGORIES = ['Football', 'Basketball', 'Dance', 'Swimming', 'Chess', 'Arts & Crafts', 'STEM & Tech', 'Martial Arts', 'Music'];

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedCity } = useSelectedLocation();

  // Read params from URL
  const qParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  const ageBracketParam = searchParams.get('ageBracket') || '';
  const typeParam = searchParams.get('type') || '';
  const locationParam = searchParams.get('location') || '';

  // Local controlled input — stays in sync with URL param
  const [keywordInput, setKeywordInput] = useState(qParam);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Active city used for filtering
  const activeCity = locationParam || selectedCity;

  // Decode category from slug form
  const categoryFilter = categoryParam
    ? categoryParam.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
    : '';

  const loadEvents = useCallback(async (keyword: string, category: string, ageBracket: string, listingType: string, city: string) => {
    setLoading(true);
    try {
      const result = await dbService.getEvents({
        keyword: keyword || undefined,
        category: category || undefined,
        ageBracket: ageBracket || undefined,
        listingType: listingType || undefined,
        location: city && city !== 'All' ? city : undefined,
      });
      setEvents(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setKeywordInput(qParam);
    loadEvents(qParam, categoryFilter, ageBracketParam, typeParam, activeCity);
  }, [qParam, categoryParam, ageBracketParam, typeParam, activeCity, loadEvents, categoryFilter]);

  const applySearch = () => {
    const params = new URLSearchParams();
    if (keywordInput.trim()) params.set('q', keywordInput.trim());
    if (categoryParam) params.set('category', categoryParam);
    if (ageBracketParam) params.set('ageBracket', ageBracketParam);
    if (typeParam) params.set('type', typeParam);
    router.push(`/explore?${params.toString()}`);
  };

  const clearAll = () => {
    setKeywordInput('');
    router.push('/explore');
  };

  const handleSurpriseMe = () => {
    if (!events || events.length === 0) return;
    const randomIndex = Math.floor(Math.random() * events.length);
    const randomEvent = events[randomIndex];
    router.push(`/events/${randomEvent.id}`);
  };

  const hasActiveFilters = qParam || categoryParam || ageBracketParam || typeParam;

  return (
    <div className="bg-slate-50 min-h-screen pt-8 md:pt-10 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 tracking-tight">Explore Activities</h1>
            <p className="text-slate-600 text-base max-w-2xl">Find the perfect class or event for your child. Filter by category, age group, or search by keyword.</p>
          </div>
          <button
            onClick={handleSurpriseMe}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white font-bold px-5 py-3 rounded-2xl shadow-lg shadow-purple-500/20 hover:shadow-xl hover:scale-105 transition-all duration-300 shrink-0 cursor-pointer text-sm"
            title="Pick a random activity!"
          >
            <Dices className="w-5 h-5 animate-spin-slow" />
            <span>Surprise Me!</span>
          </button>
        </div>

        {/* Ad Placement: Explore Top Banner */}
        <AdBanner slot="explore-top" format="horizontal" className="mb-8" />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-1/4">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" /> Filters
                  </h3>
                  {hasActiveFilters && (
                    <button onClick={clearAll} className="text-xs text-purple-600 font-semibold hover:underline flex items-center gap-1">
                      <X className="w-3 h-3" /> Clear all
                    </button>
                  )}
                </div>

                <div className="space-y-8">
                  {/* Keyword Search */}
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={keywordInput}
                        onChange={e => setKeywordInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && applySearch()}
                        placeholder="Keywords…"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    {keywordInput && keywordInput !== qParam && (
                      <button
                        onClick={applySearch}
                        className="mt-2 text-xs text-purple-600 font-semibold hover:underline"
                      >
                        Press Enter or click to search
                      </button>
                    )}
                    {qParam && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-slate-500">Searching:</span>
                        <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                          "{qParam}"
                          <Link href={`/explore${categoryParam ? `?category=${categoryParam}` : ''}`} className="hover:text-purple-900">
                            <X className="w-3 h-3" />
                          </Link>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Location Selector */}
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">City Location</label>
                    <LocationSelector className="w-full" />
                  </div>

                  {/* Activity Type */}
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-3 block">Activity Type</label>
                    <div className="space-y-2">
                      {['Event', 'Competition', 'Course', 'Webinar'].map((type) => {
                        const typeVal = type.toLowerCase();
                        const isSelected = typeParam === typeVal;
                        const buildHref = (newVal?: string) => {
                          const p = new URLSearchParams();
                          if (qParam) p.set('q', qParam);
                          if (categoryParam) p.set('category', categoryParam);
                          if (ageBracketParam) p.set('ageBracket', ageBracketParam);
                          if (newVal) p.set('type', newVal);
                          return `/explore?${p.toString()}`;
                        };
                        return (
                          <Link
                            key={type}
                            href={isSelected ? buildHref() : buildHref(typeVal)}
                            className="flex items-center space-x-3 cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              readOnly
                              className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                            />
                            <span className={`text-sm ${isSelected ? 'font-bold text-purple-700' : 'text-slate-600 group-hover:text-purple-600'}`}>{type}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-3 block">Categories</label>
                    <div className="space-y-2">
                      {CATEGORIES.map((cat) => {
                        const catSlug = cat.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                        const isSelected = categoryFilter.toLowerCase() === cat.toLowerCase();
                        const buildHref = (newVal?: string) => {
                          const p = new URLSearchParams();
                          if (qParam) p.set('q', qParam);
                          if (ageBracketParam) p.set('ageBracket', ageBracketParam);
                          if (typeParam) p.set('type', typeParam);
                          if (newVal) p.set('category', newVal);
                          return `/explore?${p.toString()}`;
                        };
                        return (
                          <Link
                            key={cat}
                            href={isSelected ? buildHref() : buildHref(catSlug)}
                            className="flex items-center space-x-3 cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              readOnly
                              className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                            />
                            <span className={`text-sm ${isSelected ? 'font-bold text-purple-700' : 'text-slate-600 group-hover:text-purple-600'}`}>{cat}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Age Bracket */}
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-3 block">Age Group</label>
                    <div className="space-y-2">
                      {Object.entries({ early_years: 'Early Years (3–5)', kids: 'Kids (6–12)', teens: 'Teens (13–18)' }).map(([key, name]) => {
                        const isSelected = ageBracketParam === key;
                        const buildHref = (newKey?: string) => {
                          const p = new URLSearchParams();
                          if (qParam) p.set('q', qParam);
                          if (categoryParam) p.set('category', categoryParam);
                          if (typeParam) p.set('type', typeParam);
                          if (newKey) p.set('ageBracket', newKey);
                          return `/explore?${p.toString()}`;
                        };
                        return (
                          <Link
                            key={key}
                            href={isSelected ? buildHref() : buildHref(key)}
                            className="flex items-center space-x-3 cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              readOnly
                              className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                            />
                            <span className={`text-sm ${isSelected ? 'font-bold text-purple-700' : 'text-slate-600 group-hover:text-purple-600'}`}>{name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  <Button className="w-full" onClick={applySearch}>
                    Apply Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Grid */}
          <div className="w-full lg:w-3/4">
            {/* Active filter pills */}
            {hasActiveFilters && (
              <div className="mb-6 flex flex-wrap items-center gap-2 bg-purple-50 border border-purple-100 rounded-2xl p-4">
                <span className="text-sm font-semibold text-slate-700">Active filters:</span>
                {qParam && (
                  <span className="inline-flex items-center gap-1.5 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    "{qParam}"
                    <Link href={`/explore?${(() => {
                      const p = new URLSearchParams();
                      if (categoryParam) p.set('category', categoryParam);
                      if (ageBracketParam) p.set('ageBracket', ageBracketParam);
                      if (typeParam) p.set('type', typeParam);
                      return p.toString();
                    })()}`}
                      className="hover:text-purple-200">✕</Link>
                  </span>
                )}
                {categoryFilter && (
                  <span className="inline-flex items-center gap-1.5 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {categoryFilter}
                    <Link href={`/explore?${(() => {
                      const p = new URLSearchParams();
                      if (qParam) p.set('q', qParam);
                      if (ageBracketParam) p.set('ageBracket', ageBracketParam);
                      if (typeParam) p.set('type', typeParam);
                      return p.toString();
                    })()}`}
                      className="hover:text-purple-200">✕</Link>
                  </span>
                )}
                {ageBracketParam && (ageBracketDisplayNames[ageBracketParam] || ageBracketNames[ageBracketParam]) && (
                  <span className="inline-flex items-center gap-1.5 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {ageBracketDisplayNames[ageBracketParam] || ageBracketNames[ageBracketParam]}
                    <Link href={`/explore?${(() => {
                      const p = new URLSearchParams();
                      if (qParam) p.set('q', qParam);
                      if (categoryParam) p.set('category', categoryParam);
                      if (typeParam) p.set('type', typeParam);
                      return p.toString();
                    })()}`}
                      className="hover:text-purple-200">✕</Link>
                  </span>
                )}
                {typeParam && (
                  <span className="inline-flex items-center gap-1.5 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {typeParam.charAt(0).toUpperCase() + typeParam.slice(1)}
                    <Link href={`/explore?${(() => {
                      const p = new URLSearchParams();
                      if (qParam) p.set('q', qParam);
                      if (categoryParam) p.set('category', categoryParam);
                      if (ageBracketParam) p.set('ageBracket', ageBracketParam);
                      return p.toString();
                    })()}`}
                      className="hover:text-purple-200">✕</Link>
                  </span>
                )}
                <Link href="/explore" className="text-xs text-purple-600 font-semibold hover:underline ml-auto">Clear all</Link>
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <span className="text-slate-600 font-medium">
                {loading ? 'Searching…' : `${events.length} result${events.length !== 1 ? 's' : ''} found`}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-500">Sort by:</span>
                <select className="text-sm border-none bg-transparent font-medium text-slate-900 focus:outline-none cursor-pointer">
                  <option>Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Date: Earliest</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="bg-white rounded-3xl overflow-hidden animate-pulse border border-slate-100">
                    <div className="h-48 bg-slate-200" />
                    <div className="p-5 space-y-3">
                      <div className="h-3 bg-slate-200 rounded w-1/3" />
                      <div className="h-5 bg-slate-200 rounded w-3/4" />
                      <div className="h-3 bg-slate-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600">
                  <MapPin className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No activities found in {activeCity}</h3>
                <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
                  {qParam ? `No events match "${qParam}" in ${activeCity}.` : `There are currently no local in-person events listed in ${activeCity}.`}
                  <br />Try switching to <button onClick={clearAll} className="text-purple-600 font-bold hover:underline">All Cities</button> or explore nationwide online workshops.
                </p>
              </div>
            ) : (
              <AnimatedList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </AnimatedList>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="bg-slate-50 min-h-screen pt-10 text-center text-slate-400">
        Loading activities…
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}

