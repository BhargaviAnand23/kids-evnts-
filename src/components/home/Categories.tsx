import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { WavyDivider } from '@/components/ui/SectionDividers';

const categories = [
  {
    name: 'Football',
    link: '/explore?category=football',
    photo: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=400&auto=format&fit=crop&q=60',
    overlay: 'bg-green-800/60',
    icon: '⚽',
    animClass: 'animate-bounce-subtle',
  },
  {
    name: 'Basketball',
    link: '/explore?category=basketball',
    photo: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&auto=format&fit=crop&q=60',
    overlay: 'bg-orange-700/60',
    icon: '🏀',
    animClass: 'animate-bounce-subtle',
  },
  {
    name: 'Dance',
    link: '/explore?category=dance',
    photo: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=400&auto=format&fit=crop&q=60',
    overlay: 'bg-pink-700/60',
    icon: '💃',
    animClass: 'animate-wiggle-subtle',
  },
  {
    name: 'Swimming',
    link: '/explore?category=swimming',
    photo: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&auto=format&fit=crop&q=60',
    overlay: 'bg-blue-700/60',
    icon: '🏊',
    animClass: 'animate-float-subtle',
  },
  {
    name: 'Skating',
    link: '/explore?category=skating',
    photo: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?w=400&auto=format&fit=crop&q=60',
    overlay: 'bg-teal-700/60',
    icon: '🛼',
    animClass: 'animate-float-subtle',
  },
  {
    name: 'Chess',
    link: '/explore?category=chess',
    photo: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400&auto=format&fit=crop&q=60',
    overlay: 'bg-slate-700/60',
    icon: '♟️',
    animClass: 'animate-pulse-subtle',
  },
  {
    name: 'Cricket',
    link: '/explore?category=cricket',
    photo: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&auto=format&fit=crop&q=60',
    overlay: 'bg-sky-700/60',
    icon: '🏏',
    animClass: 'animate-bounce-subtle',
  },
  {
    name: 'Music',
    link: '/explore?category=music',
    photo: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&auto=format&fit=crop&q=60',
    overlay: 'bg-purple-700/60',
    icon: '🎵',
    animClass: 'animate-wiggle-subtle',
  },
  {
    name: 'Martial Arts',
    link: '/explore?category=martial-arts',
    photo: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400&auto=format&fit=crop&q=60',
    overlay: 'bg-red-700/60',
    icon: '🥋',
    animClass: 'animate-pulse-subtle',
  },
  {
    name: 'Cycling',
    link: '/explore?category=cycling',
    photo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop&q=60',
    overlay: 'bg-emerald-700/60',
    icon: '🚴',
    animClass: 'animate-float-subtle',
  },
  {
    name: 'Yoga & Fitness',
    link: '/explore?category=yoga',
    photo: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&auto=format&fit=crop&q=60',
    overlay: 'bg-rose-700/60',
    icon: '🧘',
    animClass: 'animate-float-subtle',
  },
];

export function Categories() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">Explore by Category</h2>
            <p className="text-slate-600 text-base">From high-energy sports to creative arts, find the perfect activity that matches your child's interests.</p>
          </div>
          <Link href="/categories" className="mt-4 md:mt-0 flex items-center text-purple-600 font-semibold hover:text-purple-700 group text-sm md:text-base">
            View All Categories 
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.link}
              className="group relative h-36 sm:h-40 rounded-[24px] overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Background photo */}
              <img
                src={category.photo}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {/* Color-tinted overlay */}
              <div className={`absolute inset-0 ${category.overlay} transition-opacity duration-300`} />

              {/* Floating micro-animated icon badge */}
              <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-base shadow-sm ${category.animClass}`}>
                  {category.icon}
                </span>
              </div>

              {/* Category name — bottom-pinned bold white text */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                <span className="font-bold text-sm sm:text-base text-white drop-shadow-md leading-tight block text-center">
                  {category.name}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Wavy Section Divider */}
        <WavyDivider className="my-10 text-purple-200/50" />

        {/* Browse by Type */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">Browse by Activity Type</h2>
          <p className="text-slate-600 text-base">Select from these four listing types to find matching opportunities for your child.</p>
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
              className="group relative rounded-3xl p-6 bg-white border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Corner accent gradient circle */}
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
