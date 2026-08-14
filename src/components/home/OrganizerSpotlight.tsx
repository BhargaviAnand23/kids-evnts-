'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Star, Calendar, ArrowRight, Building2, Award } from 'lucide-react';
import { dbService, SEED_ORGANIZATIONS } from '@/services/db';
import { Organization } from '@/types';

import { HorizontalCarousel } from '@/components/ui/HorizontalCarousel';

export function OrganizerSpotlight() {
  const [organizers, setOrganizers] = useState<Organization[]>(SEED_ORGANIZATIONS);

  useEffect(() => {
    async function loadOrgs() {
      try {
        const approved = await dbService.getOrganizations({ status: 'approved' });
        if (approved && approved.length > 0) {
          setOrganizers(approved.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to load organizations:', err);
      }
    }
    loadOrgs();
  }, []);

  if (organizers.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-slate-950 via-purple-950/90 to-indigo-950 text-white relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-micro font-extrabold uppercase tracking-wider mb-3 border border-purple-500/40 shadow-xs">
              <Award className="w-4 h-4 text-amber-400" />
              Verified Host Spotlight
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Featured Academy & Academy Directors
            </h2>
            <p className="text-slate-300 text-body mt-2 max-w-2xl font-medium">
              Meet top certified coaches, academies, and clubs providing safe, high-quality instruction for children.
            </p>
          </div>
          <Link
            href="/explore"
            className="mt-4 md:mt-0 inline-flex items-center text-amber-400 font-extrabold hover:text-amber-300 group text-caption shrink-0"
          >
            Browse All Verified Organizers
            <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Organizers Horizontal Carousel */}
        <HorizontalCarousel>
          {organizers.map((org) => (
            <div
              key={org.id}
              className="snap-start shrink-0 w-[300px] sm:w-[360px] lg:w-[380px] bg-slate-900/90 border border-slate-700/90 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl hover:border-purple-400/60 hover:bg-slate-900 transition-all duration-300 group h-full"
            >
              <div>
                {/* Header row with logo & rating */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-purple-950 border-2 border-amber-400/60 p-1 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
                    {org.logo_url ? (
                      <img src={org.logo_url} alt={org.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <Building2 className="w-9 h-9 text-amber-400" />
                    )}
                  </div>

                  <div className="flex items-center gap-1 bg-amber-400/10 text-amber-400 px-3 py-1 rounded-full text-micro font-bold border border-amber-400/20">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    4.9 / 5.0
                  </div>
                </div>

                {/* Organization Name */}
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-extrabold text-xl text-white group-hover:text-purple-300 transition-colors">
                    {org.name}
                  </h3>
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                </div>

                <p className="text-micro font-semibold text-purple-400 uppercase tracking-wider mb-4">
                  Verified Host • {org.events_hosted || 12}+ Hosted Programs
                </p>

                <p className="text-slate-300 text-caption leading-relaxed line-clamp-3 mb-6 font-medium">
                  {org.description || 'Certified kids activity provider delivering high safety standards, experienced coaches, and structured age-appropriate learning tracks.'}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
                <span className="text-micro font-semibold text-slate-400">Background Checked ✓</span>
                <Link
                  href={`/organizers/${org.id}`}
                  className="inline-flex items-center gap-1.5 text-micro font-bold text-purple-400 hover:text-white transition-colors"
                >
                  View Profile <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </HorizontalCarousel>

      </div>
    </section>
  );
}
