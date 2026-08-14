'use client';
import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldAlert, Award, Compass, HeartHandshake } from 'lucide-react';
import { motion } from 'framer-motion';

const COLLECTIONS = [
  {
    id: 'confidence-builders',
    title: 'Confidence Builders',
    tagline: 'Empower public speaking, drama & martial arts',
    badge: 'Popular for Introverts & Shy Kids',
    category: 'Arts',
    gradient: 'from-purple-600 via-violet-600 to-indigo-600',
    bgImage: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&auto=format&fit=crop&q=60',
    activityCount: '18+ Programs',
    outcomes: ['Self-Expression', 'Stage Courage', 'Body Awareness']
  },
  {
    id: 'little-champs',
    title: 'Little Champs Sports',
    tagline: 'Grassroots coaching in soccer, swimming & athletics',
    badge: 'High Energy & Teamwork',
    category: 'Football',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    bgImage: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800&auto=format&fit=crop&q=60',
    activityCount: '24+ Programs',
    outcomes: ['Physical Stamina', 'Team Discipline', 'Motor Coordination']
  },
  {
    id: 'creative-expressive',
    title: 'Creative Expressive Arts',
    tagline: 'Hands-on pottery, painting, vocal music & dance',
    badge: 'Unleash Imagination',
    category: 'Dance',
    gradient: 'from-pink-600 via-rose-600 to-purple-600',
    bgImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=60',
    activityCount: '15+ Programs',
    outcomes: ['Fine Motor Skills', 'Focus & Patience', 'Visual Creativity']
  },
  {
    id: 'future-innovators',
    title: 'Future Innovators STEM',
    tagline: 'Junior robotics, chess strategy & AI coding',
    badge: 'Problem Solvers',
    category: 'Chess',
    gradient: 'from-amber-600 via-orange-600 to-red-600',
    bgImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60',
    activityCount: '12+ Programs',
    outcomes: ['Logical Reasoning', 'Analytical Thinking', 'Tech Literacy']
  }
];

export function CuratedCollections() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-amber-500/5 via-purple-500/5 to-rose-500/10 relative overflow-hidden border-y border-purple-100/50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">


        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 text-purple-700 text-micro font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Goal-Oriented Tracks
            </div>
            <h2 className="text-section-title font-extrabold text-slate-900 tracking-tight">
              Curated Collections for Your Child’s Growth
            </h2>
            <p className="text-slate-600 text-body mt-2 max-w-2xl">
              Choose activities aligned with what your child needs most — whether building stage confidence, team spirit, or analytical focus.
            </p>
          </div>

          <Link
            href="/explore"
            className="inline-flex items-center gap-2 font-bold text-caption text-purple-700 hover:text-purple-900 transition-colors group shrink-0"
          >
            <span>Explore All Collections</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLLECTIONS.map((item) => (
            <div key={item.id} className="h-full">
              <Link
                href={`/explore?category=${encodeURIComponent(item.category)}`}
                className="group block relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 bg-white border border-slate-100 flex flex-col h-full"
              >
                {/* Top Image Banner with Overlay */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={item.bgImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${item.gradient} opacity-75 group-hover:opacity-85 transition-opacity`} />
                  
                  {/* Badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-micro font-bold text-slate-900 shadow-sm flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-purple-600" />
                    {item.badge}
                  </div>

                  {/* Title on Image */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-micro font-semibold uppercase tracking-wider text-purple-200">{item.activityCount}</span>
                    <h3 className="text-card-title font-extrabold text-white leading-tight mt-0.5">{item.title}</h3>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 flex flex-col justify-between flex-1">
                  <p className="text-caption text-slate-600 mb-4 leading-relaxed font-medium">
                    {item.tagline}
                  </p>

                  {/* Outcomes Tags */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="text-micro font-bold text-slate-400 uppercase tracking-wider">Key Growth Outcomes:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {item.outcomes.map(outcome => (
                        <span key={outcome} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-micro font-semibold">
                          ✓ {outcome}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}
