'use client';
import React from 'react';
import { Star, Quote, CheckCircle2, Heart } from 'lucide-react';

import { Card, CardContent } from '../ui/Card';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Mom of Arjun (8 yrs) & Ananya (11 yrs)',
    location: 'Seattle, WA',
    content: "Kidspire has been a total lifesaver. Finding reliable weekend activities used to take hours of searching random social media groups. Now I find background-checked coaches and book verified slots in under 2 minutes!",
    rating: 5,
    tag: 'Verified Parent Booking ✓',
    activityBooked: 'Kids Soccer Camp & Swim Lessons',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
  },
  {
    name: 'Karthik Rajan',
    role: 'Dad of Rohan (9 yrs)',
    location: 'Portland, OR',
    content: "The verified organizer badge really gives me complete peace of mind. The martial arts academy we discovered through Kidspire has exceptional safety standards and certified senseis.",
    rating: 5,
    tag: 'Verified Parent Booking ✓',
    activityBooked: 'Junior Martial Arts & Karate',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
  },
  {
    name: 'Anita Desai',
    role: 'Director, Rhythm Dance Academy',
    location: 'Partner Academy',
    content: "Kidspire has transformed how we connect with local families. The platform handles all registrations, seating tiers, and payments seamlessly, letting our teachers focus on nurturing young talent.",
    rating: 5,
    tag: 'Verified Partner Host ✓',
    activityBooked: 'Hip Hop & Contemporary Dance',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150'
  }
];

export function Testimonials() {
  return (
    <section className="py-16 md:py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-700 text-micro font-bold uppercase tracking-wider mb-3">
            <Heart className="w-3.5 h-3.5 text-purple-600 fill-purple-600" />
            Loved By 10,000+ Families
          </div>
          <h2 className="text-section-title font-extrabold text-slate-900 mb-3 tracking-tight">Real Parent Stories & Experiences</h2>
          <p className="text-slate-600 text-body">Read how parents discover joy, confidence, and new friendships for their children through Kidspire.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="h-full">
              <Card className="bg-white border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 relative h-full flex flex-col justify-between rounded-3xl overflow-hidden">
                <div className="absolute top-6 right-6 text-purple-100">
                  <Quote className="w-12 h-12 fill-current" />
                </div>

                <CardContent className="p-8 relative z-10 flex flex-col justify-between h-full">
                  <div>
                    {/* Verified Tag */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-micro font-bold border border-emerald-100 mb-4">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {testimonial.tag}
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>

                    <p className="text-slate-700 mb-6 text-body leading-relaxed font-medium">"{testimonial.content}"</p>
                  </div>

                  <div>
                    <div className="text-micro font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-xl mb-4 inline-block">
                      Booked: {testimonial.activityBooked}
                    </div>

                    <div className="flex items-center pt-4 border-t border-slate-100">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-purple-200 shrink-0">
                        <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-card-title text-slate-900 leading-snug">{testimonial.name}</h4>
                        <p className="text-micro font-semibold text-slate-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

