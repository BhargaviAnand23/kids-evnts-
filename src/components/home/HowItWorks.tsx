import React from 'react';
import { Search, Compass, CalendarCheck, Sparkles, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    stepNumber: '01',
    icon: Search,
    title: 'Discover Activities',
    description: 'Explore curated sports, arts, STEM, and music programs tailored by age, skill level, and location.',
    color: 'bg-purple-100 text-purple-600',
    badge: 'Smart Filters',
  },
  {
    stepNumber: '02',
    icon: Compass,
    title: 'Choose the Right Fit',
    description: 'Compare age brackets, growth outcome tracks, parent ratings, and verified coach certifications.',
    color: 'bg-blue-100 text-blue-600',
    badge: '100% Verified',
  },
  {
    stepNumber: '03',
    icon: CalendarCheck,
    title: 'Book Instantly',
    description: 'Reserve seats in seconds with instant digital confirmation, e-tickets, and automated calendar sync.',
    color: 'bg-amber-100 text-amber-600',
    badge: 'Instant E-Tickets',
  },
  {
    stepNumber: '04',
    icon: Sparkles,
    title: 'Let the Adventure Begin 🎉',
    description: 'Watch your child gain confidence, develop skills, and create lifelong memories with new friends!',
    color: 'bg-emerald-100 text-emerald-600',
    badge: 'Parent Guaranteed',
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 md:py-20 bg-white relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-700 text-micro font-bold uppercase tracking-wider inline-block mb-3">
            Simple 4-Step Process
          </span>
          <h2 className="text-section-title font-extrabold text-slate-900 tracking-tight">How Kidspire Works for Parents</h2>
          <p className="text-slate-600 text-body mt-2">Finding and booking unforgettable extracurricular experiences for your children is quick and stress-free.</p>
        </div>

        {/* 4 Steps Grid (4 Columns Desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.stepNumber}
                className="bg-slate-50 border border-slate-100 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:bg-purple-50/40 hover:border-purple-200 hover:shadow-xl transition-all duration-300 group relative"
              >
                <div>
                  {/* Step Header with Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center font-bold text-xl shadow-xs group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-3xl font-extrabold text-slate-300 group-hover:text-purple-400 transition-colors">
                      {step.stepNumber}
                    </span>
                  </div>

                  <span className="text-micro font-extrabold text-purple-700 bg-purple-100/80 px-2.5 py-0.5 rounded-full inline-block mb-2">
                    {step.badge}
                  </span>

                  <h3 className="font-extrabold text-xl text-slate-900 mb-3 group-hover:text-purple-700 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-slate-600 text-caption leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-micro font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Hassle-Free Booking</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

