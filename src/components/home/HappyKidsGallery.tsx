'use client';

import React from 'react';
import { Heart } from 'lucide-react';

const KIDS_PHOTOS = [
  {
    caption: 'Soccer Star',
    activity: 'Youth Football',
    photo: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=400&auto=format&fit=crop&q=80',
    color: 'border-green-400',
  },
  {
    caption: 'Little Painter',
    activity: 'Arts & Crafts',
    photo: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&auto=format&fit=crop&q=80',
    color: 'border-amber-400',
  },
  {
    caption: 'Pool Champion',
    activity: 'Swimming Club',
    photo: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&auto=format&fit=crop&q=80',
    color: 'border-blue-400',
  },
  {
    caption: 'STEM Explorer',
    activity: 'Science Lab',
    photo: 'https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?w=400&auto=format&fit=crop&q=80',
    color: 'border-cyan-400',
  },
  {
    caption: 'Dance Groove',
    activity: 'Hip Hop Studio',
    photo: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=400&auto=format&fit=crop&q=80',
    color: 'border-pink-400',
  },
  {
    caption: 'Karate Spirit',
    activity: 'Martial Arts',
    photo: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400&auto=format&fit=crop&q=80',
    color: 'border-purple-400',
  },
];

export function HappyKidsGallery() {
  return (
    <section className="py-10 bg-white border-t border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-purple-100 shadow-sm text-xs font-semibold text-purple-700">
              <Heart className="w-3.5 h-3.5 fill-heart-active text-heart-active" /> Real Moments
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Happy Kids in Action
            </h3>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md text-left sm:text-right">
            Over 5,000+ children discovering their passions through verified local activities every week.
          </p>
        </div>

        {/* Gallery row of rounded photos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6">
          {KIDS_PHOTOS.map((item, idx) => (
            <div
              key={idx}
              className="group flex flex-col items-center text-center p-3 rounded-2xl bg-slate-50 hover:bg-purple-50/50 hover:shadow-md transition-all duration-300 border border-slate-100"
            >
              <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 ${item.color} shadow-sm group-hover:scale-105 transition-transform duration-300 mb-3`}>
                <img
                  src={item.photo}
                  alt={item.caption}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-purple-700 leading-tight">
                {item.caption}
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5 font-medium">
                {item.activity}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
