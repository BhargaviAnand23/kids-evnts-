'use client';

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Ticket } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { AdBanner } from '@/components/ui/AdBanner';
import { BookOrWaitlistButton } from '@/components/shared/BookOrWaitlistButton';
import type { Event } from '@/types';

interface Props {
  eventData: Event;
  formattedDate: string;
  formattedLocation: string;
}

export function EventDetailSidebar({ eventData, formattedDate, formattedLocation }: Props) {
  const isEventListing = (eventData.listing_type || 'event') === 'event';
  const hasTiers = isEventListing && Array.isArray(eventData.seating_tiers) && eventData.seating_tiers.length > 0;

  const [selectedTierId, setSelectedTierId] = useState<string>(
    hasTiers && eventData.seating_tiers![0] ? eventData.seating_tiers![0].id : ''
  );

  const selectedTier = hasTiers
    ? eventData.seating_tiers!.find(t => t.id === selectedTierId) || eventData.seating_tiers![0]
    : null;

  const displayPrice = selectedTier ? selectedTier.tier_price : eventData.price;
  const seatsAvail = selectedTier ? selectedTier.tier_seats_available : eventData.seats_available;
  const seatsTotal = selectedTier ? selectedTier.tier_seats_total : eventData.seats_total;

  return (
    <div className="w-full lg:w-1/3 space-y-6 sticky top-24 self-start">
      <Card className="border-2 border-purple-100 shadow-xl shadow-purple-900/5 overflow-hidden">
        <CardContent className="p-6 md:p-8">
          {/* Seating Tiers Selection (Only for Event with Tiers) */}
          {hasTiers ? (
            <div className="mb-6 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <Ticket className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-bold text-slate-800">Select Seating Tier</span>
              </div>
              <div className="space-y-2.5">
                {eventData.seating_tiers!.map((tier) => {
                  const isSelected = selectedTierId === tier.id;
                  const isSoldOut = tier.tier_seats_available <= 0;
                  return (
                    <div
                      key={tier.id}
                      onClick={() => !isSoldOut && setSelectedTierId(tier.id)}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                        isSoldOut
                          ? 'opacity-50 border-slate-200 bg-slate-50 cursor-not-allowed'
                          : isSelected
                          ? 'border-purple-600 bg-purple-50/70 ring-2 ring-purple-600/20 shadow-sm cursor-pointer'
                          : 'border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50/20 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-purple-600 bg-purple-600' : 'border-slate-300'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{tier.tier_name}</h4>
                          <p className="text-xs text-slate-500">
                            {isSoldOut ? 'Sold Out' : `${tier.tier_seats_available} seats remaining`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-extrabold text-purple-700">₹{tier.tier_price}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-end justify-between mb-6 pb-6 border-b border-slate-100">
              <div>
                <span className="text-sm text-slate-500 font-medium">Price per child</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">₹{displayPrice}</div>
              </div>
            </div>
          )}

          {/* Details list */}
          <div className="space-y-5 mb-8">
            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-purple-600 mr-4 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-900 text-sm md:text-base">Date</h4>
                <p className="text-slate-600 text-sm">{formattedDate}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="w-5 h-5 text-purple-600 mr-4 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-900 text-sm md:text-base">Time</h4>
                <p className="text-slate-600 text-sm">{eventData.event_time}</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="w-5 h-5 text-purple-600 mr-4 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-900 text-sm md:text-base">Location</h4>
                <p className="text-slate-600 text-sm">{formattedLocation}</p>
              </div>
            </div>
          </div>

          {/* Seats Urgency Banner */}
          <div className="bg-orange-50 rounded-2xl p-4 mb-6 flex items-start">
            <Users className="w-5 h-5 text-orange-500 mr-3 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-orange-900 text-sm">Hurry, filling fast!</h4>
              <p className="text-orange-700 text-xs mt-1">
                Only {seatsAvail} out of {seatsTotal} seats remaining{selectedTier ? ` for ${selectedTier.tier_name}` : ''}.
              </p>
            </div>
          </div>

          <BookOrWaitlistButton
            eventId={eventData.id}
            seatsAvailable={seatsAvail}
            listingType={eventData.listing_type}
            joinLink={eventData.join_link}
            selectedTierId={selectedTier ? selectedTier.id : undefined}
          />
          <p className="text-center text-xs text-slate-400 mt-4">You won't be charged yet</p>
        </CardContent>
      </Card>

      {/* Sidebar Ad Placement */}
      <AdBanner slot="event-detail-sidebar" format="vertical" />
    </div>
  );
}
