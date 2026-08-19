'use client';
import React from 'react';
import { Search, CalendarCheck, Smile, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' as const },
  },
};

export function HowItWorks() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-mesh-purple relative overflow-hidden">
      {/* Subtle Background Image with low opacity and blur */}
      <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1200&auto=format&fit=crop&q=70"
          alt="Background kids pattern"
          className="w-full h-full object-cover opacity-[0.04] filter blur-[2px]"
        />
        {/* Soft gradient to blend with sections above and below */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-purple-50/10 to-white/80" />
      </div>

      {/* Skewed decorative panel */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/20 -skew-x-12 transform origin-top-right -z-10"></div>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-16"
        >
          <h2 className="text-section-title font-bold text-slate-900 mb-3 sm:mb-4 tracking-tight">How Kidspire Works</h2>
          <p className="text-slate-600 text-body">We make it incredibly simple for parents to find and manage the best extracurricular activities for their children.</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 relative"
        >
          {/* Connecting Line (desktop only) */}
          <div className="hidden md:block absolute top-12 left-[15%] w-[70%] h-[2px] bg-slate-100 -z-10"></div>
          
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div key={index} variants={stepVariants} className="flex flex-col items-center text-center relative group">
                <div className={`w-24 h-24 rounded-full ${step.color} flex items-center justify-center mb-8 border-8 border-white shadow-xl relative transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="w-10 h-10" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-caption shadow-md">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-card-title font-bold text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-600 text-body leading-relaxed">{step.description}</p>
                
                <ul className="mt-6 space-y-2 text-caption text-slate-500 text-left w-full max-w-[200px] mx-auto">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500 shrink-0" /> Verified Organizers</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500 shrink-0" /> Instant Confirmation</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500 shrink-0" /> Easy Rescheduling</li>
                </ul>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
