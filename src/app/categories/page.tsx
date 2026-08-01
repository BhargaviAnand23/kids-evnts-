'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, Filter, Sparkles, Trophy, Palette, Music, Dumbbell, BookOpen, Utensils, Cpu, Users, Mic, Check } from 'lucide-react';

const sportsSubcategories = [
  { name: 'All Sports',  slug: 'sports',     photo: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=400&auto=format&fit=crop&q=60', overlay: 'bg-emerald-900/70', badge: 'All Activity' },
  { name: 'Football',    slug: 'football',   photo: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=400&auto=format&fit=crop&q=60', overlay: 'bg-green-800/60' },
  { name: 'Basketball',  slug: 'basketball', photo: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&auto=format&fit=crop&q=60', overlay: 'bg-orange-700/60' },
  { name: 'Cricket',     slug: 'cricket',    photo: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&auto=format&fit=crop&q=60', overlay: 'bg-sky-700/60' },
  { name: 'Swimming',    slug: 'swimming',   photo: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&auto=format&fit=crop&q=60', overlay: 'bg-blue-700/60' },
  { name: 'Skating',     slug: 'skating',    photo: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?w=400&auto=format&fit=crop&q=60', overlay: 'bg-teal-700/60' },
  { name: 'Cycling',     slug: 'cycling',    photo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop&q=60', overlay: 'bg-emerald-700/60' },
];

const talentsSubcategories = [
  { name: 'All Talents',     slug: 'talents',      photo: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&auto=format&fit=crop&q=60', overlay: 'bg-purple-900/70', badge: 'All Activity' },
  { name: 'Music',           slug: 'music',        photo: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&auto=format&fit=crop&q=60', overlay: 'bg-purple-700/60' },
  { name: 'Martial Arts',    slug: 'martial-arts', photo: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400&auto=format&fit=crop&q=60', overlay: 'bg-red-700/60' },
  { name: 'Yoga & Fitness',  slug: 'yoga',         photo: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&auto=format&fit=crop&q=60', overlay: 'bg-rose-700/60' },
  { name: 'Art & Crafts',    slug: 'arts',         photo: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&auto=format&fit=crop&q=60', overlay: 'bg-amber-700/60' },
  { name: 'Drama & Theater', slug: 'drama',        photo: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&auto=format&fit=crop&q=60', overlay: 'bg-violet-700/60' },
  { name: 'Cooking & Baking',slug: 'cooking',      photo: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&auto=format&fit=crop&q=60', overlay: 'bg-yellow-700/60' },
  { name: 'STEM & Robotics', slug: 'stem',         photo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=60', overlay: 'bg-cyan-700/60' },
  { name: 'Dance',           slug: 'dance',        photo: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=400&auto=format&fit=crop&q=60', overlay: 'bg-pink-700/60' },
  { name: 'Chess',           slug: 'chess',        photo: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400&auto=format&fit=crop&q=60', overlay: 'bg-slate-700/60' },
  { name: 'Public Speaking', slug: 'speaking',     photo: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&auto=format&fit=crop&q=60', overlay: 'bg-indigo-700/60' },
];

const activityTypes = [
  { id: 'all', label: 'All Format Types', val: '', icon: '✨', desc: 'Show all activity formats' },
  { id: 'event', label: 'Events', val: 'event', icon: '🎉', desc: 'Single-day programs, camps & school meets', color: 'border-purple-200 bg-purple-50/70 text-purple-900 active:bg-purple-600 active:text-white' },
  { id: 'competition', label: 'Competitions', val: 'competition', icon: '🏆', desc: 'Tournaments & championships', color: 'border-amber-200 bg-amber-50/70 text-amber-900 active:bg-amber-600 active:text-white' },
  { id: 'course', label: 'Courses', val: 'course', icon: '📚', desc: 'Structured multi-week classes', color: 'border-emerald-200 bg-emerald-50/70 text-emerald-900 active:bg-emerald-600 active:text-white' },
  { id: 'webinar', label: 'Webinars', val: 'webinar', icon: '💻', desc: 'Live online talks & seminars', color: 'border-blue-200 bg-blue-50/70 text-blue-900 active:bg-blue-600 active:text-white' },
];

export default function CategoriesPage() {
  const [showSportsSubmenu, setShowSportsSubmenu] = useState(true);
  const [showTalentsSubmenu, setShowTalentsSubmenu] = useState(true);
  const [selectedType, setSelectedType] = useState<string>(''); // empty string means all

  // Helper to build combined Explore URLs with both category & type
  const getExploreUrl = (categorySlug?: string, typeVal?: string) => {
    const params = new URLSearchParams();
    const targetType = typeVal !== undefined ? typeVal : selectedType;
    if (categorySlug) params.set('category', categorySlug);
    if (targetType) params.set('type', targetType);
    const queryString = params.toString();
    return `/explore${queryString ? `?${queryString}` : ''}`;
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14 md:py-16">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-caption font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full inline-block mb-3">
            2-Tier Activity Directory
          </span>
          <h1 className="text-page-title font-bold text-slate-900 mb-3 tracking-tight">Activity Categories &amp; Formats</h1>
          <p className="text-slate-600 text-body">
            Explore our two primary activity hubs — <strong>Sports</strong> and <strong>Talents &amp; Hobbies</strong> — or filter by activity format below.
          </p>
        </div>

        {/* ── TOP SECTION: ACTIVITY TYPE FILTER TABS / TILES ───────────────── */}
        <div className="mb-12 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-purple-600" />
                <h2 className="text-section-title font-bold text-slate-900">Browse by Activity Format</h2>
              </div>
              <p className="text-caption text-slate-500">Filter by format type or select a format to combine with categories below.</p>
            </div>
            {selectedType && (
              <button
                onClick={() => setSelectedType('')}
                className="text-micro font-bold text-purple-700 hover:underline bg-purple-50 px-3 py-1.5 rounded-full border border-purple-200 self-start sm:self-auto cursor-pointer"
              >
                Reset Format Filter (Showing All)
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {activityTypes.map((type) => {
              const isSelected = selectedType === type.val;
              return (
                <div
                  key={type.id}
                  onClick={() => setSelectedType(type.val)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between h-full ${
                    isSelected
                      ? 'border-purple-600 bg-purple-600 text-white shadow-md shadow-purple-500/20 scale-[1.02]'
                      : 'border-slate-200 bg-slate-50/50 hover:border-purple-300 hover:bg-white text-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{type.icon}</span>
                      {isSelected ? (
                        <span className="w-5 h-5 rounded-full bg-white text-purple-700 flex items-center justify-center text-xs font-bold">
                          ✓
                        </span>
                      ) : null}
                    </div>
                    <h3 className={`font-bold text-caption mb-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>{type.label}</h3>
                    <p className={`text-micro leading-tight ${isSelected ? 'text-purple-100' : 'text-slate-500'}`}>{type.desc}</p>
                  </div>

                  <Link
                    href={getExploreUrl(undefined, type.val)}
                    onClick={(e) => e.stopPropagation()}
                    className={`mt-4 inline-flex items-center gap-1 text-micro font-bold hover:underline ${
                      isSelected ? 'text-white' : 'text-purple-600'
                    }`}
                  >
                    View All {type.label} <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              );
            })}
          </div>

          {selectedType && (
            <div className="mt-4 p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-caption font-semibold flex items-center justify-between">
              <span>
                Active format filter: <strong className="uppercase tracking-wider text-purple-700">{selectedType}</strong>. Click any subcategory below to view {selectedType}s in that category!
              </span>
              <Link
                href={getExploreUrl(undefined, selectedType)}
                className="inline-flex items-center gap-1 text-micro font-bold bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Go to Explore <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* ── PARENT HUB 1: SPORTS ────────────────────────────────────────── */}
        <div className="mb-12 bg-white rounded-3xl p-6 sm:p-8 border border-purple-200 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 text-white flex items-center justify-center text-2xl shadow-md shadow-green-500/20">
                ⚽
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-section-title font-bold text-slate-900">Sports Hub</h2>
                  <span className="bg-emerald-100 text-emerald-800 text-micro font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Parent Group 1
                  </span>
                </div>
                <p className="text-caption text-slate-500">6 Subcategories · Football, Basketball, Cricket, Swimming, Skating, Cycling</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Link
                href={getExploreUrl('sports')}
                className="inline-flex items-center text-caption font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl transition-colors shadow-sm"
              >
                Browse All Sports <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
              <button
                onClick={() => setShowSportsSubmenu(v => !v)}
                className="inline-flex items-center text-caption font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showSportsSubmenu ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {showSportsSubmenu && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 pt-2">
              {sportsSubcategories.map((subcat) => (
                <Link
                  key={subcat.slug}
                  href={getExploreUrl(subcat.slug)}
                  className="group relative h-32 sm:h-36 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <img
                    src={subcat.photo}
                    alt={subcat.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 ${subcat.overlay} transition-opacity duration-300`} />
                  <div className="absolute inset-0 p-3 flex flex-col justify-between">
                    {subcat.badge ? (
                      <span className="text-[10px] font-extrabold bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-md self-start">
                        {subcat.badge}
                      </span>
                    ) : <span />}
                    <div>
                      <span className="font-bold text-body text-white drop-shadow-md leading-tight block mb-0.5">
                        {subcat.name}
                      </span>
                      <span className="flex items-center text-white/80 text-[11px] font-medium group-hover:text-white transition-colors">
                        Explore <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ── PARENT HUB 2: TALENTS & HOBBIES ─────────────────────────────── */}
        <div className="mb-12 bg-white rounded-3xl p-6 sm:p-8 border border-purple-200 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-700 text-white flex items-center justify-center text-2xl shadow-md shadow-purple-500/20">
                🎨
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-section-title font-bold text-slate-900">Talents &amp; Hobbies Hub</h2>
                  <span className="bg-purple-100 text-purple-800 text-micro font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
                    Parent Group 2
                  </span>
                </div>
                <p className="text-caption text-slate-500">10 Subcategories · Music, Arts, Martial Arts, Dance, STEM, Drama, Chess, Cooking &amp; more</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Link
                href={getExploreUrl('talents')}
                className="inline-flex items-center text-caption font-bold text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl transition-colors shadow-sm"
              >
                Browse All Talents <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
              <button
                onClick={() => setShowTalentsSubmenu(v => !v)}
                className="inline-flex items-center text-caption font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showTalentsSubmenu ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {showTalentsSubmenu && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 pt-2">
              {talentsSubcategories.map((subcat) => (
                <Link
                  key={subcat.slug}
                  href={getExploreUrl(subcat.slug)}
                  className="group relative h-32 sm:h-36 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <img
                    src={subcat.photo}
                    alt={subcat.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 ${subcat.overlay} transition-opacity duration-300`} />
                  <div className="absolute inset-0 p-3 flex flex-col justify-between">
                    {subcat.badge ? (
                      <span className="text-[10px] font-extrabold bg-purple-400 text-purple-950 px-2 py-0.5 rounded-md self-start">
                        {subcat.badge}
                      </span>
                    ) : <span />}
                    <div>
                      <span className="font-bold text-body text-white drop-shadow-md leading-tight block mb-0.5">
                        {subcat.name}
                      </span>
                      <span className="flex items-center text-white/80 text-[11px] font-medium group-hover:text-white transition-colors">
                        Explore <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
