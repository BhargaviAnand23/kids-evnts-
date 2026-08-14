'use client';
import React from 'react';
import { ShieldCheck, Star, UserCheck, Target, Lock, HeartHandshake } from 'lucide-react';

const REASONS = [
  {
    icon: ShieldCheck,
    title: 'Verified Organizers',
    description: 'Every host undergoes identity verification, background safety checks, and venue audits.',
    color: 'text-purple-600',
    bg: 'bg-purple-100/80',
  },
  {
    icon: Star,
    title: 'Parent Ratings & Reviews',
    description: 'Read 100% authenticated feedback from local families who attended previous sessions.',
    color: 'text-amber-500',
    bg: 'bg-amber-100/80',
  },
  {
    icon: UserCheck,
    title: 'Age-Appropriate Programs',
    description: 'Curated age brackets ensuring your child plays and learns alongside peers of similar development.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-100/80',
  },
  {
    icon: Target,
    title: 'Meaningful Skill Growth',
    description: 'Goal-oriented tracks designed to build stage courage, physical stamina, or STEM problem solving.',
    color: 'text-blue-600',
    bg: 'bg-blue-100/80',
  },
  {
    icon: Lock,
    title: 'Secure Booking & Guarantees',
    description: 'Instant e-ticket generation with bank-grade encryption and flexible refund protection.',
    color: 'text-rose-600',
    bg: 'bg-rose-100/80',
  },
  {
    icon: HeartHandshake,
    title: 'Loved by 10,000+ Families',
    description: 'Join a thriving community of parents discovering joyful weekend & after-school experiences.',
    color: 'text-violet-600',
    bg: 'bg-violet-100/80',
  },
];

export function WhyParentsChoose() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-purple-500/5 relative overflow-hidden border-y border-emerald-100/50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-700 text-micro font-bold uppercase tracking-wider inline-block mb-3">
            Why Parents Choose Kidspire
          </span>
          <h2 className="text-section-title font-extrabold text-slate-900 tracking-tight">
            Built with Complete Peace of Mind for Parents
          </h2>
          <p className="text-slate-600 text-body mt-2">
            We simplify parent life by guaranteeing safety, quality, and seamless booking for every activity.
          </p>
        </div>

        {/* 6 Grid items - 3 columns desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {REASONS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-start gap-5"
              >
                <div className={`p-3.5 rounded-2xl ${item.bg} ${item.color} shrink-0 shadow-xs`}>
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg mb-1.5 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-caption leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
