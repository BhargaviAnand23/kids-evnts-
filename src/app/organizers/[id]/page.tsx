import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { dbService } from '@/services/db';
import { OrganizationType } from '@/types';
import { EventCard } from '@/components/shared/EventCard';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Building2, Mail, Phone, Globe, MapPin, CheckCircle2,
  Star, Calendar, ArrowLeft, ShieldCheck, Award
} from 'lucide-react';

const ORG_TYPE_LABELS: Record<OrganizationType, string> = {
  school: 'School',
  college: 'College',
  club: 'Sports Club',
  sports_academy: 'Sports Academy',
  arts_studio: 'Arts Studio',
  camp: 'Camp / Workshop',
  independent: 'Independent Coach / Studio',
  other: 'Organization',
};

export default async function OrganizerProfilePage({ params }: { params: { id: string } }) {
  const org = await dbService.getOrganizationById(params.id);

  if (!org) {
    notFound();
  }

  const { totalEventsHosted, averageRating, approvedEvents } = await dbService.getOrganizationStats(params.id);

  const orgTypeName = ORG_TYPE_LABELS[org.type] || 'Organization';

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Navigation / Breadcrumb */}
      <div className="bg-white border-b border-slate-100 py-4">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 flex items-center justify-between">
          <Link href="/explore" className="text-slate-500 hover:text-purple-600 flex items-center text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Explore
          </Link>
          <span className="text-xs font-semibold text-slate-400">Organizer Profile</span>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mt-8">
        
        {/* Profile Header Banner */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-10 shadow-sm relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -z-0 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Logo / Initials Avatar */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-purple-100 border-2 border-purple-200 overflow-hidden flex items-center justify-center text-purple-700 font-extrabold text-3xl shrink-0 shadow-inner">
                {org.logo_url ? (
                  <img src={org.logo_url} alt={org.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{org.name.charAt(0)}</span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200 font-semibold">
                    <Building2 className="w-3.5 h-3.5 mr-1" /> {orgTypeName}
                  </Badge>

                  {org.verified && (
                    <Badge variant="success" className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Verified Partner
                    </Badge>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {org.name}
                </h1>

                {org.bio && (
                  <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed font-medium">
                    {org.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Stats Badges */}
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 shrink-0">
              <div className="text-center px-3 border-r border-slate-200">
                <div className="flex items-center justify-center gap-1 text-amber-500 font-black text-xl">
                  <Star className="w-5 h-5 fill-current text-amber-400" />
                  <span>{averageRating}</span>
                </div>
                <span className="text-caption text-slate-500 font-medium">Avg Rating</span>
              </div>
              <div className="text-center px-3">
                <div className="flex items-center justify-center gap-1 text-purple-700 font-black text-xl">
                  <Calendar className="w-5 h-5" />
                  <span>{totalEventsHosted}</span>
                </div>
                <span className="text-caption text-slate-500 font-medium">Events Hosted</span>
              </div>
            </div>
          </div>

          {/* Contact Details & About Section */}
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">About Organization</h3>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                {org.description || org.bio || `${org.name} hosts high quality, engaging activities and events for children and families.`}
              </p>
            </div>

            <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-1">Contact Information</h3>
              
              <div className="flex items-center gap-2.5 text-sm text-slate-700">
                <Mail className="w-4 h-4 text-purple-600 shrink-0" />
                <a href={`mailto:${org.contact_email}`} className="hover:text-purple-600 transition-colors font-medium break-all">
                  {org.contact_email}
                </a>
              </div>

              {org.phone && (
                <div className="flex items-center gap-2.5 text-sm text-slate-700">
                  <Phone className="w-4 h-4 text-purple-600 shrink-0" />
                  <a href={`tel:${org.phone}`} className="hover:text-purple-600 transition-colors font-medium">
                    {org.phone}
                  </a>
                </div>
              )}

              {org.website && (
                <div className="flex items-center gap-2.5 text-sm text-slate-700">
                  <Globe className="w-4 h-4 text-purple-600 shrink-0" />
                  <a href={org.website} target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors font-medium truncate">
                    {org.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}

              {org.address && (
                <div className="flex items-start gap-2.5 text-sm text-slate-700">
                  <MapPin className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{org.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Events Grid Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-purple-600" />
              Active Events ({approvedEvents.length})
            </h2>
          </div>

          {approvedEvents.length === 0 ? (
            <Card className="border-slate-200 text-center py-12">
              <CardContent>
                <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800">No active events listed</h3>
                <p className="text-slate-500 text-sm mt-1">This organizer currently has no upcoming approved events.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {approvedEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
