"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

const CATEGORIES = [
  { name: 'Football', icon: '⚽', desc: 'Soccer camps & tournaments', count: '14+ Events', bg: 'bg-emerald-50 text-emerald-900 border-emerald-100 hover:border-emerald-300' },
  { name: 'Basketball', icon: '🏀', desc: 'Court drills & 3v3 leagues', count: '10+ Events', bg: 'bg-amber-50 text-amber-900 border-amber-100 hover:border-amber-300' },
  { name: 'Cricket', icon: '🏏', desc: 'Bowling & batting coaching', count: '12+ Events', bg: 'bg-indigo-50 text-indigo-900 border-indigo-100 hover:border-indigo-300' },
  { name: 'Swimming', icon: '🏊', desc: 'Water safety & stroke mastery', count: '16+ Events', bg: 'bg-cyan-50 text-cyan-900 border-cyan-100 hover:border-cyan-300' },
  { name: 'Skating', icon: '⛸️', desc: 'Roller & ice skating classes', count: '8+ Events', bg: 'bg-sky-50 text-sky-900 border-sky-100 hover:border-sky-300' },
  { name: 'Cycling', icon: '🚴', desc: 'Trail rides & balance training', count: '6+ Events', bg: 'bg-teal-50 text-teal-900 border-teal-100 hover:border-teal-300' },
  { name: 'Music', icon: '🎵', desc: 'Vocal, guitar, piano & drums', count: '18+ Events', bg: 'bg-purple-50 text-purple-900 border-purple-100 hover:border-purple-300' },
  { name: 'Dance', icon: '💃', desc: 'Hip Hop, Ballet & Bollywood', count: '20+ Events', bg: 'bg-pink-50 text-pink-900 border-pink-100 hover:border-pink-300' },
  { name: 'Chess', icon: '♟️', desc: 'Tactics, opening & endgame', count: '15+ Events', bg: 'bg-slate-100 text-slate-900 border-slate-200 hover:border-slate-400' },
  { name: 'Art & Crafts', icon: '🎨', desc: 'Pottery, sketching & painting', count: '22+ Events', bg: 'bg-rose-50 text-rose-900 border-rose-100 hover:border-rose-300' },
  { name: 'Drama', icon: '🎭', desc: 'Theatre & stage performance', count: '9+ Events', bg: 'bg-violet-50 text-violet-900 border-violet-100 hover:border-violet-300' },
  { name: 'Cooking', icon: '👨‍🍳', desc: 'Junior baking & culinary fun', count: '7+ Events', bg: 'bg-orange-50 text-orange-900 border-orange-100 hover:border-orange-300' },
  { name: 'STEM', icon: '🔬', desc: 'Robotics, AI & science labs', count: '14+ Events', bg: 'bg-blue-50 text-blue-900 border-blue-100 hover:border-blue-300' },
  { name: 'Martial Arts', icon: '🥋', desc: 'Karate, Taekwondo & Judo', count: '11+ Events', bg: 'bg-red-50 text-red-900 border-red-100 hover:border-red-300' },
  { name: 'Yoga', icon: '🧘', desc: 'Mindfulness & flexibility', count: '5+ Events', bg: 'bg-emerald-50 text-emerald-900 border-emerald-100 hover:border-emerald-300' },
  { name: 'Public Speaking', icon: '🎤', desc: 'Debate, declamation & poise', count: '13+ Events', bg: 'bg-fuchsia-50 text-fuchsia-900 border-fuchsia-100 hover:border-fuchsia-300' },
];

export function Categories() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-purple-50/40 via-white to-slate-50/50 relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100/80 text-purple-700 text-micro font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Discover By Interest
            </div>
            <h2 className="text-section-title font-extrabold text-slate-900 tracking-tight">
              Explore 16+ Activity Categories
            </h2>
            <p className="text-slate-600 text-body mt-1">
              From high-energy outdoor sports to creative performing arts and robotics workshops.
            </p>
          </div>
          <Link
            href="/categories"
            className="mt-4 md:mt-0 inline-flex items-center text-purple-600 font-bold hover:text-purple-800 group text-caption shrink-0"
          >
            View All Categories
            <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 16 Category Cards - 4 Columns on Large Screen */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/explore?category=${encodeURIComponent(cat.name)}`}
              className={`group block p-4 sm:p-5 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${cat.bg} flex flex-col justify-between h-full`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
                  <span className="text-micro font-bold bg-white/80 backdrop-blur-xs px-2.5 py-0.5 rounded-full shadow-2xs text-slate-700">
                    {cat.count}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-1 leading-snug group-hover:text-purple-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-micro sm:text-caption text-slate-600 line-clamp-2 leading-relaxed font-medium">
                  {cat.desc}
                </p>
              </div>

              <div className="mt-4 pt-2 flex items-center text-micro font-bold text-purple-700 group-hover:underline">
                Browse Programs <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

