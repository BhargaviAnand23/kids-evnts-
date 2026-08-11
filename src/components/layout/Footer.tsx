import React from 'react';
import Link from 'next/link';
import { Shield, Award, Users, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { FadeContent } from '../animations/FadeContent';
import { SOCIAL_LINKS } from '@/config/social';
import { InstagramIcon, FacebookIcon } from '@/components/ui/SocialIcons';
import { ReplayTourButton } from '@/components/shared/OnboardingWalkthrough';


export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 md:pt-20 pb-10 mt-16 md:mt-20">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Footer CTA Banner */}
        <FadeContent>
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-[32px] p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between mb-20 md:mb-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=2940')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
            <div className="mb-8 lg:mb-0 lg:mr-10 relative z-10 max-w-2xl text-center lg:text-left">
              <h2 className="text-section-title font-bold text-white mb-4">Ready to Make Every Weekend Special?</h2>
              <p className="text-purple-100 text-body leading-relaxed">Join Kidspire today and discover hundreds of engaging sports, arts, and hobby activities for your child.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto relative z-10">
              <Link
                href="/explore"
                className="inline-flex items-center justify-center rounded-full font-bold h-12 md:h-14 px-8 text-body bg-white text-purple-700 hover:bg-slate-100 shadow-md transition-all whitespace-nowrap"
              >
                Explore Activities
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full font-bold h-12 md:h-14 px-8 text-white text-body border-2 border-white/80 hover:bg-white/15 hover:border-white transition-all whitespace-nowrap"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </FadeContent>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <div className="flex flex-col mb-6">
              <Link href="/" className="text-section-title font-bold text-white tracking-tight">
                Kidspire
              </Link>
              <span className="text-caption uppercase tracking-widest text-slate-400 font-semibold mt-1">
                Play &middot; Explore &middot; Shine
              </span>
            </div>
            <p className="text-slate-400 mb-8 max-w-md leading-relaxed text-body">
              The premier platform for finding and booking the best sports, arts, and hobby activities for kids and young people.
            </p>
            <div className="flex flex-wrap gap-4">
              {/* Trust Badges */}
              <div className="flex items-center bg-slate-800/80 rounded-full px-4 py-2 text-caption text-slate-300">
                <Shield className="w-4 h-4 text-green-400 mr-2" />
                <span>Verified Partners</span>
              </div>
              <div className="flex items-center bg-slate-800/80 rounded-full px-4 py-2 text-slate-300 text-caption">
                <Award className="w-4 h-4 text-orange-400 mr-2" />
                <span>Top Rated Activities</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-card-title mb-6">Discover</h4>
            <ul className="space-y-4 text-slate-400 text-body">
              <li><Link href="/explore" className="hover:text-purple-400 transition-colors">Explore Activities</Link></li>
              <li><Link href="/categories" className="hover:text-purple-400 transition-colors">Categories</Link></li>
              <li><Link href="/how-it-works" className="hover:text-purple-400 transition-colors">How It Works</Link></li>
              <li><Link href="/about" className="hover:text-purple-400 transition-colors">About Us</Link></li>
              <li><ReplayTourButton /></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-card-title mb-6">Organizers</h4>
            <ul className="space-y-4 text-slate-400 text-body">
              <li><Link href="/list-your-event" className="hover:text-purple-400 transition-colors font-medium text-purple-300">List Your Event</Link></li>
              <li><Link href="/signup" className="hover:text-purple-400 transition-colors">Partner Signup</Link></li>
              <li><Link href="/login" className="hover:text-purple-400 transition-colors">Partner Login</Link></li>
              <li><Link href="/contact" className="hover:text-purple-400 transition-colors">Support & Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-card-title mb-6">Legal</h4>
            <ul className="space-y-4 text-slate-400 text-body">
              <li><Link href="/terms" className="hover:text-purple-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:text-purple-400 transition-colors">Refund Policy</Link></li>
              <li><Link href="/safety-policy" className="hover:text-purple-400 transition-colors">Safety Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-slate-500 text-caption">
          <p>&copy; {new Date().getFullYear()} Kidspire. All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Secure Payments
            </span>
            <span className="flex items-center">
              <Users className="w-4 h-4 text-blue-500 mr-2" />
              10k+ Families
            </span>
            <div className="flex items-center space-x-3 border-l border-slate-800 pl-6">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Kidspire on Instagram"
                className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-purple-600 hover:text-white transition-all shadow-sm"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Kidspire on Facebook"
                className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-purple-600 hover:text-white transition-all shadow-sm"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>

            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

