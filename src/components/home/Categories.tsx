"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Trophy, Palette } from 'lucide-react';
import { motion } from 'framer-motion';
import { WavyDivider } from '@/components/ui/SectionDividers';

const parentCategoryHubs = [
  {
    name: 'Sports Hub',
    subtitle: '6 Activity Subcategories',
    description: 'Football, Basketball, Cricket, Swimming, Skating & Cycling',
    link: '/explore?category=sports',
    photo: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=60',
    overlay: 'bg-gradient-to-t from-emerald-950/90 via-emerald-900/60 to-emerald-900/20',
    icon: '⚽',
    animClass: 'animate-bounce-subtle',
    badge: 'Parent Hub 1',
    badgeColor: 'bg-emerald-400 text-emerald-950',
    borderColor: 'border-emerald-300 hover:border-emerald-500',
  },
  {
    name: 'Talents & Hobbies Hub',
    subtitle: '10 Activity Subcategories',
    description: 'Music, Art & Crafts, Dance, Martial Arts, STEM & Robotics, Drama, Chess, Cooking & Public Speaking',
    link: '/explore?category=talents',
    photo: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=60',
    overlay: 'bg-gradient-to-t from-purple-950/90 via-purple-900/60 to-purple-900/20',
    icon: '🎨',
    animClass: 'animate-float-subtle',
    badge: 'Parent Hub 2',
    badgeColor: 'bg-purple-400 text-purple-950',
    borderColor: 'border-purple-300 hover:border-purple-500',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: 'easeOut' as const }
  },
};

export function Categories() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-mesh-purple">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12"
        >
          <div>
            <h2 className="text-section-title font-bold text-slate-900 mb-3 tracking-tight">Explore by Category</h2>
            <p className="text-slate-600 text-body">Choose from our two primary activity hubs — high-energy Sports or creative Talents &amp; Hobbies.</p>
          </div>
          <Link href="/categories" className="mt-4 md:mt-0 flex items-center text-purple-600 font-semibold hover:text-purple-700 group text-body">
            View All Categories 
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* 2 Main Parent Hub Tiles */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto"
        >
          {parentCategoryHubs.map((category) => (
            <motion.div key={category.name} variants={itemVariants}>
              <Link
                href={category.link}
                className={`group relative block h-64 sm:h-72 lg:h-80 rounded-[32px] overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-400 border-2 ${category.borderColor}`}
              >
                {/* Background photo */}
                <img
                  src={category.photo}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Gradient overlay */}
                <div className={`absolute inset-0 ${category.overlay} transition-opacity duration-300`} />

                {/* Floating Hub Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-micro font-extrabold shadow-md ${category.badgeColor}`}>
                    <span>{category.icon}</span>
                    <span>{category.badge}</span>
                  </span>
                </div>

                {/* Bottom content info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex flex-col justify-end">
                  <span className="text-caption font-semibold text-white/80 uppercase tracking-widest mb-1">
                    {category.subtitle}
                  </span>
                  <h3 className="font-extrabold text-2xl sm:text-3xl text-white drop-shadow-md leading-tight mb-2 group-hover:text-purple-200 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-caption text-white/90 line-clamp-2 leading-relaxed mb-4">
                    {category.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-micro font-bold text-white bg-white/20 backdrop-blur-md border border-white/30 px-4 py-2 rounded-full w-fit group-hover:bg-white group-hover:text-slate-900 transition-all">
                    Explore Hub Subcategories <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Wavy Section Divider */}
        <WavyDivider className="my-12 text-purple-200/50" />

        {/* Browse by Type */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-section-title font-bold text-slate-900 mb-4 tracking-tight">Browse by Activity Type</h2>
          <p className="text-slate-600 text-body">Select from these four listing types to find matching opportunities for your child.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: 'Events',
              description: 'Single-day programs, camps, and local school events.',
              link: '/explore?type=event',
              colorClass: 'from-purple-500 to-indigo-600 shadow-purple-500/20',
              icon: '🎉',
            },
            {
              name: 'Competitions',
              description: 'Tournaments, sports meets, championships, and talent shows.',
              link: '/explore?type=competition',
              colorClass: 'from-amber-500 to-orange-600 shadow-amber-500/20',
              icon: '🏆',
            },
            {
              name: 'Courses',
              description: 'Multi-week programs, structured classes, and masterclasses.',
              link: '/explore?type=course',
              colorClass: 'from-emerald-500 to-teal-600 shadow-emerald-500/20',
              icon: '📚',
            },
            {
              name: 'Webinars',
              description: 'Online learning sessions, parent talks, and virtual seminars.',
              link: '/explore?type=webinar',
              colorClass: 'from-blue-500 to-sky-600 shadow-blue-500/20',
              icon: '💻',
            },
          ].map((type) => (
            <Link
              key={type.name}
              href={type.link}
              className="hover-lift group relative rounded-3xl p-6 bg-white border border-slate-100 shadow-md flex flex-col justify-between overflow-hidden"
            >
              <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full bg-gradient-to-br ${type.colorClass} opacity-10 group-hover:scale-150 transition-transform duration-500`} />
              
              <div>
                <div className="text-3xl mb-4">{type.icon}</div>
                <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
                  {type.name}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  {type.description}
                </p>
              </div>

              <span className="text-xs font-semibold text-purple-600 flex items-center gap-1.5 group-hover:underline">
                Explore Listings
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
