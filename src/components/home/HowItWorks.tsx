import React from 'react';
import { Search, CalendarCheck, Smile, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Discover Activities',
    description: 'Browse through hundreds of curated sports, arts, and hobby activities in your area using our smart filters.',
    color: 'bg-purple-100 text-purple-600',
    borderColor: 'border-purple-200'
  },
  {
    icon: CalendarCheck,
    title: 'Book Seamlessly',
    description: 'Check availability, read reviews, and book instantly with our secure payment gateway in just a few clicks.',
    color: 'bg-orange-100 text-orange-600',
    borderColor: 'border-orange-200'
  },
  {
    icon: Smile,
    title: 'Enjoy & Grow',
    description: 'Watch your child learn new skills, make friends, and have fun in a safe, verified environment.',
    color: 'bg-green-100 text-green-600',
    borderColor: 'border-green-200'
  }
];

export function HowItWorks() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 -skew-x-12 transform origin-top-right -z-10"></div>
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 sm:mb-6 tracking-tight">How Kidspire Works</h2>
          <p className="text-slate-600 text-base">We make it incredibly simple for parents to find and manage the best extracurricular activities for their children.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting Line (desktop only) */}
          <div className="hidden md:block absolute top-12 left-[15%] w-[70%] h-[2px] bg-slate-100 -z-10"></div>
          
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center relative group">
                <div className={`w-24 h-24 rounded-full ${step.color} flex items-center justify-center mb-8 border-8 border-white shadow-xl relative transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="w-10 h-10" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-md">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-600 text-base leading-relaxed">{step.description}</p>
                
                <ul className="mt-6 space-y-2 text-sm text-slate-500 text-left w-full max-w-[200px] mx-auto">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500 shrink-0" /> Verified Organizers</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500 shrink-0" /> Instant Confirmation</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500 shrink-0" /> Easy Rescheduling</li>
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
