import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// All 11 photos reuse the same verified URLs as Categories.tsx on the homepage.
// The 5 extra categories below have newly-verified photos (all HTTP 200).
const categories = [
  { name: 'Football',        slug: 'football',   photo: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=400&auto=format&fit=crop&q=60', overlay: 'bg-green-800/60'   },
  { name: 'Basketball',      slug: 'basketball', photo: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&auto=format&fit=crop&q=60', overlay: 'bg-orange-700/60' },
  { name: 'Dance',           slug: 'dance',      photo: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=400&auto=format&fit=crop&q=60', overlay: 'bg-pink-700/60'   },
  { name: 'Swimming',        slug: 'swimming',   photo: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&auto=format&fit=crop&q=60', overlay: 'bg-blue-700/60'   },
  { name: 'Skating',         slug: 'skating',    photo: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?w=400&auto=format&fit=crop&q=60', overlay: 'bg-teal-700/60'   },
  { name: 'Chess',           slug: 'chess',      photo: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400&auto=format&fit=crop&q=60', overlay: 'bg-slate-700/60'  },
  { name: 'Cricket',         slug: 'cricket',    photo: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&auto=format&fit=crop&q=60', overlay: 'bg-sky-700/60'    },
  { name: 'Music',           slug: 'music',      photo: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&auto=format&fit=crop&q=60', overlay: 'bg-purple-700/60' },
  { name: 'Martial Arts',    slug: 'martial-arts', photo: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400&auto=format&fit=crop&q=60', overlay: 'bg-red-700/60'     },
  { name: 'Cycling',         slug: 'cycling',    photo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop&q=60', overlay: 'bg-emerald-700/60' },
  { name: 'Yoga & Fitness',  slug: 'yoga',       photo: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&auto=format&fit=crop&q=60', overlay: 'bg-rose-700/60'    },
  { name: 'Arts & Crafts',   slug: 'arts',       photo: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&auto=format&fit=crop&q=60', overlay: 'bg-amber-700/60'  },
  { name: 'Drama & Theater', slug: 'drama',      photo: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&auto=format&fit=crop&q=60', overlay: 'bg-violet-700/60' },
  { name: 'Cooking & Baking',slug: 'cooking',    photo: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&auto=format&fit=crop&q=60', overlay: 'bg-yellow-700/60'  },
  { name: 'STEM & Robotics', slug: 'stem',       photo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=60', overlay: 'bg-cyan-700/60'    },
  { name: 'Public Speaking', slug: 'speaking',   photo: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&auto=format&fit=crop&q=60', overlay: 'bg-indigo-700/60'  },
];

export default function CategoriesPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14 md:py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full inline-block mb-3">
            Activity Directory
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Categories</h1>
          <p className="text-slate-600 text-base">
            Browse through our curated directory of youth activities. Select any category to view all matching events and classes.
          </p>
        </div>

        {/* Photo-background tile grid — matches homepage exactly */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/explore?category=${category.slug}`}
              className="group relative h-36 sm:h-44 rounded-[24px] overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Background photo */}
              <img
                src={category.photo}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {/* Color-tinted overlay */}
              <div className={`absolute inset-0 ${category.overlay} transition-opacity duration-300`} />
              {/* Category name + Explore link */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                <span className="font-bold text-sm sm:text-base text-white drop-shadow-md leading-tight block text-center mb-0.5">
                  {category.name}
                </span>
                <span className="flex items-center justify-center text-white/70 text-xs font-medium group-hover:text-white transition-colors">
                  Explore <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="my-16 border-t border-slate-200" />

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
              className="group relative rounded-3xl p-6 bg-white border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
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
    </div>
  );
}
