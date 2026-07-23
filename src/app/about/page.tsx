import React from 'react';
import Link from 'next/link';
import { Shield, Users, Heart, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14 md:py-16 px-6 md:px-16 lg:px-24">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full inline-block mb-3">
            Our Story & Mission
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">About Kidspire</h1>
          <p className="text-slate-600 text-base">
            Empowering parents to discover, book, and manage verified extracurricular sports, arts, and hobby activities for kids and teens.
          </p>
        </div>

        {/* Story Section */}
        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed mb-12 space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Why Kidspire Exists</h2>
          <p>
            Finding high-quality, safe, and engaging weekend activities for children used to mean digging through endless social media groups, sending unreturned messages, and dealing with fragmented registration forms. We built Kidspire to change that forever.
          </p>
          <p>
            Kidspire serves as a unified digital marketplace connecting passionate parents with accredited sports academies, music studios, art schools, swimming clubs, and independent certified coaches. Every organizer on Kidspire goes through a thorough safety verification process so parents can book with complete peace of mind.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-purple-50/50 border border-purple-100">
            <Shield className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-bold text-lg text-slate-900 mb-2">Safety & Trust First</h3>
            <p className="text-sm text-slate-600">
              We vet every partner organization, verifying instructor credentials, facility safety standards, and child safety compliance before listing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-orange-50/50 border border-orange-100">
            <Users className="w-8 h-8 text-orange-600 mb-3" />
            <h3 className="font-bold text-lg text-slate-900 mb-2">Empowering Organizers</h3>
            <p className="text-sm text-slate-600">
              We provide grassroots coaches and local academies with modern booking tools, student management, and instant digital payments.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100">
            <Heart className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-bold text-lg text-slate-900 mb-2">Enriching Childhoods</h3>
            <p className="text-sm text-slate-600">
              We believe every child deserves access to healthy physical activity, creative expression, and social skill-building outside the school classroom.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100">
            <Award className="w-8 h-8 text-emerald-600 mb-3" />
            <h3 className="font-bold text-lg text-slate-900 mb-2">Instant Hassle-Free Booking</h3>
            <p className="text-sm text-slate-600">
              Real-time seat availability, instant ticket confirmation, and clear cancellation policies make scheduling weekends effort-free.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-slate-900 text-white rounded-2xl p-8">
          <h3 className="text-xl font-bold mb-2">Ready to Explore Activities?</h3>
          <p className="text-slate-300 text-sm mb-6">Browse upcoming weekend camps, sports clinics, and creative workshops near you.</p>
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700" asChild>
            <Link href="/explore">
              Browse All Activities <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}
