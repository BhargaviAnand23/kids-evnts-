import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Users, Star, Clock, Shield, Share2, Heart, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { dbService as db } from '@/services/db';
import { notFound } from 'next/navigation';
import { AdBanner } from '@/components/ui/AdBanner';

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const eventData = await db.getEventById(params.id);
  
  if (!eventData) {
    notFound();
  }

  // Format real data
  const event = {
    id: eventData.id,
    title: eventData.title,
    organizer: eventData.organizer?.name || 'Kidspire Partner',
    category: eventData.category,
    age_bracket: eventData.age_bracket,
    date: new Date(eventData.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    time: eventData.event_time,
    location: eventData.location,
    price: eventData.price,
    rating: 4.8, // Mocked rating
    reviews: 124, // Mocked reviews
    image: eventData.image_url || 'https://images.unsplash.com/photo-1574629810360-7efbb192569a?auto=format&fit=crop&q=80&w=1200',
    description: eventData.description || 'No description provided.',
    highlights: [
      'Professional environment',
      'Fun and engaging',
    ],
    seats_total: eventData.seats_total,
    seats_available: eventData.seats_available,
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Top Nav/Breadcrumb */}
      <div className="bg-white border-b border-slate-100 py-4">
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 flex items-center justify-between">
          <Link href="/explore" className="text-slate-500 hover:text-purple-600 flex items-center text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Explore
          </Link>
          <div className="flex items-center space-x-3">
            <button className="p-2 text-slate-400 hover:text-purple-600 rounded-full hover:bg-slate-50 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-slate-50 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 mt-8">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Main Content */}
          <div className="w-full lg:w-2/3">
            <div className="w-full h-[360px] md:h-[480px] rounded-[32px] overflow-hidden mb-8 shadow-sm">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
            </div>

            <div className="flex items-center gap-2 mb-4">
              {eventData.is_sponsored && (
                <Badge className="bg-purple-600 text-white font-bold shadow-md">
                  ★ Sponsored Activity
                </Badge>
              )}
              <Badge variant="pill" className="bg-purple-100 text-purple-800">
                {event.category}
              </Badge>
              <Badge variant="pill" className="bg-orange-50 text-orange-700">
                <Users className="w-3.5 h-3.5 mr-1" /> {event.age_bracket}
              </Badge>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">{event.title}</h1>
            
            <div className="flex items-center text-slate-600 mb-8 border-b border-slate-200 pb-8">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl mr-4">
                CS
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-base">Organized by {event.organizer}</p>
                <div className="flex items-center text-sm">
                  <Star className="w-4 h-4 text-orange-400 mr-1 fill-current" />
                  <span className="font-bold text-slate-800 mr-1">{event.rating}</span>
                  <span>({event.reviews} reviews)</span>
                  <span className="mx-2">&bull;</span>
                  <Shield className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600 font-medium">Verified Partner</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">About this activity</h2>
              <p className="text-slate-600 text-base leading-relaxed">{event.description}</p>
            </div>

            <div className="mb-10">
              <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-4">Highlights</h3>
              <ul className="space-y-3">
                {event.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-green-500 mr-3 shrink-0" />
                    <span className="text-slate-700 text-base">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar Booking Card */}
          <div className="w-full lg:w-1/3">
            <Card className="sticky top-28 border-2 border-purple-100 shadow-xl shadow-purple-900/5">
              <CardContent className="p-8">
                <div className="flex items-end justify-between mb-6 pb-6 border-b border-slate-100">
                  <div>
                    <span className="text-sm text-slate-500 font-medium">Price per child</span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">₹{event.price}</div>
                  </div>
                </div>

                <div className="space-y-5 mb-8">
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-purple-600 mr-4 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm md:text-base">Date</h4>
                      <p className="text-slate-600 text-sm">{event.date}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-purple-600 mr-4 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm md:text-base">Time</h4>
                      <p className="text-slate-600 text-sm">{event.time}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-purple-600 mr-4 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm md:text-base">Location</h4>
                      <p className="text-slate-600 text-sm">{event.location}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-2xl p-4 mb-6 flex items-start">
                  <Users className="w-5 h-5 text-orange-500 mr-3 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-900 text-sm">Hurry, filling fast!</h4>
                    <p className="text-orange-700 text-xs mt-1">Only {event.seats_available} out of {event.seats_total} seats remaining.</p>
                  </div>
                </div>

                <Button size="lg" className="w-full text-sm md:text-base h-12 md:h-14" asChild>
                  <Link href={`/events/${event.id}/book`}>Book Now</Link>
                </Button>
                <p className="text-center text-xs text-slate-400 mt-4">You won't be charged yet</p>
              </CardContent>
            </Card>

            {/* Sidebar Ad Placement */}
            <AdBanner slot="event-detail-sidebar" format="vertical" className="mt-8" />
          </div>

        </div>
      </div>
    </div>
  );
}
