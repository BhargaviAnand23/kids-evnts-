'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, Filter } from 'lucide-react';

const sportsSubcategories = [
  { name: 'All Sports',  slug: 'sports',     icon: '🏆', bgClass: 'bg-emerald-50 border-emerald-150 text-emerald-950 hover:bg-emerald-100/60', badge: 'All Activity' },
  { name: 'Football',    slug: 'football',   icon: '⚽', bgClass: 'bg-green-50 border-green-150 text-green-950 hover:bg-green-100/60' },
  { name: 'Basketball',  slug: 'basketball', icon: '🏀', bgClass: 'bg-blue-50 border-blue-150 text-blue-955 hover:bg-blue-100/60' },
  { name: 'Cricket',     slug: 'cricket',    icon: '🏏', bgClass: 'bg-sky-50 border-sky-150 text-sky-955 hover:bg-sky-100/60' },
  { name: 'Swimming',    slug: 'swimming',   icon: '🏊', bgClass: 'bg-cyan-50 border-cyan-150 text-cyan-955 hover:bg-cyan-100/60' },
  { name: 'Skating',     slug: 'skating',    icon: '🛼', bgClass: 'bg-teal-50 border-teal-150 text-teal-955 hover:bg-teal-100/60' },
  { name: 'Cycling',     slug: 'cycling',    icon: '🚴', bgClass: 'bg-green-50 border-green-150 text-green-950 hover:bg-green-100/60' },
];

const talentsSubcategories = [
  { name: 'All Talents',     slug: 'talents',      icon: '✨', bgClass: 'bg-purple-50 border-purple-150 text-purple-955 hover:bg-purple-100/60', badge: 'All Activity' },
  { name: 'Music',           slug: 'music',        icon: '🎵', bgClass: 'bg-amber-50 border-amber-150 text-amber-955 hover:bg-amber-100/60' },
  { name: 'Martial Arts',    slug: 'martial-arts', icon: '🥋', bgClass: 'bg-red-50 border-red-150 text-red-955 hover:bg-red-100/60' },
  { name: 'Yoga & Fitness',  slug: 'yoga',         icon: '🧘', bgClass: 'bg-rose-50 border-rose-150 text-rose-955 hover:bg-rose-100/60' },
  { name: 'Art & Crafts',    slug: 'arts',         icon: '🎨', bgClass: 'bg-pink-50 border-pink-150 text-pink-955 hover:bg-pink-100/60' },
  { name: 'Drama & Theater', slug: 'drama',        icon: '🎭', bgClass: 'bg-indigo-50 border-indigo-150 text-indigo-955 hover:bg-indigo-100/60' },
  { name: 'Cooking & Baking',slug: 'cooking',      icon: '🍳', bgClass: 'bg-orange-50 border-orange-150 text-orange-955 hover:bg-orange-100/60' },
  { name: 'STEM & Robotics', slug: 'stem',         icon: '🤖', bgClass: 'bg-cyan-50 border-cyan-150 text-cyan-955 hover:bg-cyan-100/60' },
  { name: 'Dance',           slug: 'dance',        icon: '💃', bgClass: 'bg-violet-50 border-violet-150 text-violet-955 hover:bg-violet-100/60' },
  { name: 'Chess',           slug: 'chess',        icon: '👑', bgClass: 'bg-yellow-50 border-yellow-200 text-[#604910] hover:bg-yellow-100/60' },
  { name: 'Public Speaking', slug: 'speaking',     icon: '🎤', bgClass: 'bg-purple-50 border-purple-150 text-purple-955 hover:bg-purple-100/60' },
];

const activityTypes = [
  { id: 'all', label: 'All Format Types', val: '', icon: '✨', desc: 'Show all activity formats', bgClass: 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-350' },
  { id: 'event', label: 'Events', val: 'event', icon: '🎉', desc: 'Single-day programs, camps & school meets', bgClass: 'bg-purple-50 border-purple-150 text-purple-900 hover:border-purple-350' },
  { id: 'competition', label: 'Competitions', val: 'competition', icon: '🏆', desc: 'Tournaments & championships', bgClass: 'bg-amber-50 border-amber-150 text-amber-900 hover:border-amber-350' },
  { id: 'course', label: 'Courses', val: 'course', icon: '📚', desc: 'Structured multi-week classes', bgClass: 'bg-emerald-50 border-emerald-150 text-emerald-900 hover:border-emerald-350' },
  { id: 'webinar', label: 'Webinars', val: 'webinar', icon: '💻', desc: 'Live online talks & seminars', bgClass: 'bg-blue-50 border-blue-150 text-blue-900 hover:border-blue-350' },
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
    <div className="bg-gradient-to-br from-purple-50/60 via-pink-50/30 to-orange-50/40 min-h-screen py-10 sm:py-14 md:py-16">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-caption font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full inline-block mb-3">
            2-Tier Activity Directory
          </span>
          <h1 className="text-page-title font-bold text-slate-900 mb-3 tracking-tight">Activity Categories &amp; Formats</h1>
          <p className="text-slate-655 text-body">
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

          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {activityTypes.map((type) => {
              const isSelected = selectedType === type.val;
              return (
                <div
                  key={type.id}
                  onClick={() => setSelectedType(type.val)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between h-full ${
                    isSelected
                      ? 'border-purple-600 bg-purple-600 text-white shadow-md shadow-purple-500/20 scale-[1.02]'
                      : type.bgClass
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
                      isSelected ? 'text-white' : 'text-purple-605'
                    }`}
                  >
                    View All {type.label} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>

          {selectedType && (
            <div className="mt-4 p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-caption font-semibold flex items-center justify-between">
              <span>
                Active format filter: <strong className="uppercase tracking-wider text-purple-750">{selectedType}</strong>. Click any subcategory below to view {selectedType}s in that category!
              </span>
              <Link
                href={getExploreUrl(undefined, selectedType)}
                className="inline-flex items-center gap-1 text-micro font-bold bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-750 transition-colors"
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
                className="inline-flex items-center text-caption font-bold text-white bg-emerald-650 hover:bg-emerald-750 px-4 py-2 rounded-xl transition-colors shadow-sm"
              >
                Browse All Sports <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
              <button
                onClick={() => setShowSportsSubmenu(v => !v)}
                className="inline-flex items-center text-caption font-bold text-purple-705 bg-purple-50 hover:bg-purple-100 px-3 py-2 rounded-xl transition-colors cursor-pointer border-none"
              >
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showSportsSubmenu ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {showSportsSubmenu && (
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 pt-2">
              {sportsSubcategories.map((subcat) => (
                <Link
                  key={subcat.slug}
                  href={getExploreUrl(subcat.slug)}
                  className={`group p-4 h-32 sm:h-36 rounded-2xl border-2 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ${subcat.bgClass}`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-3xl">{subcat.icon}</span>
                    {subcat.badge ? (
                      <span className="text-[10px] font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-md">
                        {subcat.badge}
                      </span>
                    ) : null}
                  </div>
                  <div>
                    <span className="font-bold text-caption block leading-tight mb-1">
                      {subcat.name}
                    </span>
                    <span className="flex items-center text-micro font-bold group-hover:underline">
                      Explore <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </span>
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
                className="inline-flex items-center text-caption font-bold text-white bg-purple-650 hover:bg-purple-750 px-4 py-2 rounded-xl transition-colors shadow-sm"
              >
                Browse All Talents <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
              <button
                onClick={() => setShowTalentsSubmenu(v => !v)}
                className="inline-flex items-center text-caption font-bold text-purple-705 bg-purple-50 hover:bg-purple-100 px-3 py-2 rounded-xl transition-colors cursor-pointer border-none"
              >
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showTalentsSubmenu ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {showTalentsSubmenu && (
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 pt-2">
              {talentsSubcategories.map((subcat) => (
                <Link
                  key={subcat.slug}
                  href={getExploreUrl(subcat.slug)}
                  className={`group p-4 h-32 sm:h-36 rounded-2xl border-2 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ${subcat.bgClass}`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-3xl">{subcat.icon}</span>
                    {subcat.badge ? (
                      <span className="text-[10px] font-extrabold bg-purple-600 text-white px-2 py-0.5 rounded-md">
                        {subcat.badge}
                      </span>
                    ) : null}
                  </div>
                  <div>
                    <span className="font-bold text-caption block leading-tight mb-1">
                      {subcat.name}
                    </span>
                    <span className="flex items-center text-micro font-bold group-hover:underline">
                      Explore <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </span>
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
