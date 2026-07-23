'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft, ShieldCheck, Loader2, AlertCircle,
  Plus, UserRound, Phone, FileText, CheckSquare, Square
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { dbService } from '@/services/db';
import { authService } from '@/services/auth';
import type { Event, Child, Parent } from '@/types';

export default function BookEventPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [parent, setParent] = useState<Parent | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildIds, setSelectedChildIds] = useState<string[]>([]);
  const [selectedTierId, setSelectedTierId] = useState<string>('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notLoggedIn, setNotLoggedIn] = useState(false);

  const isEventListing = (event?.listing_type || 'event') === 'event';
  const hasTiers = isEventListing && Array.isArray(event?.seating_tiers) && event!.seating_tiers!.length > 0;

  useEffect(() => {
    if (event && hasTiers && !selectedTierId) {
      const tierIdFromUrl = searchParams.get('tierId');
      const foundTier = event.seating_tiers!.find(t => t.id === tierIdFromUrl);
      setSelectedTierId(foundTier ? foundTier.id : event.seating_tiers![0].id);
    }
  }, [event, hasTiers, searchParams, selectedTierId]);

  useEffect(() => {
    const load = async () => {
      const [eventData, currentUser] = await Promise.all([
        dbService.getEventById(eventId),
        authService.getCurrentUser(),
      ]);

      if (!eventData) { router.push('/explore'); return; }
      setEvent(eventData);

      if (!currentUser || currentUser.role !== 'parent') {
        setNotLoggedIn(true);
        setLoading(false);
        return;
      }

      const profile = await dbService.getParentProfile(currentUser.id);
      if (profile) {
        setParent(profile);
        const kids = await dbService.getChildren(profile.id);
        setChildren(kids);
        if (kids.length > 0) setSelectedChildIds([kids[0].id]);
      }
      setLoading(false);
    };
    load();
  }, [eventId, router]);

  const toggleChildSelection = (id: string) => {
    setSelectedChildIds(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!parent) { setError('You must be logged in as a parent to book.'); return; }
    if (selectedChildIds.length === 0) {
      setError('Please select at least one child to book.'); return;
    }
    if (!event) return;

    if (selectedChildIds.length > event.seats_available) {
      setError(`Only ${event.seats_available} seat(s) remaining for this event.`);
      return;
    }

    setSubmitting(true);
    try {
      const createdBookingIds: string[] = [];

      for (const childId of selectedChildIds) {
        const booking = await dbService.createBooking({
          event_id: event.id,
          child_id: childId,
          parent_id: parent.id,
          tier_id: selectedTier ? selectedTier.id : undefined,
          tier_name: selectedTier ? selectedTier.tier_name : undefined,
        });
        createdBookingIds.push(booking.id);

        // Fire confirmation notification for each child
        const childObj = children.find(c => c.id === childId);
        const perChildFee = 50 / selectedChildIds.length;
        const perChildGst = Math.round(unitPrice * 0.18);
        const childTotal = unitPrice + perChildFee + perChildGst;

        fetch('/api/notify/booking-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            parentId: parent.id,
            parentEmail: parent.email,
            parentName: parent.name,
            eventTitle: event.title,
            eventDate: event.event_date,
            eventTime: event.event_time,
            eventLocation: event.location,
            childName: childObj?.name || '',
            bookingReference: booking.booking_reference,
            paidAmount: event.price > 0 ? childTotal : null,
          }),
        }).catch(() => {});
      }

      router.push(`/events/${event.id}/book/confirmation?booking=${createdBookingIds[0]}`);
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('seats') || msg.toLowerCase().includes('available') || msg.toLowerCase().includes('sold out')) {
        setError('Sorry — this event just sold out while you were booking. Please join the waitlist.');
      } else {
        setError(msg || 'Booking failed. Please try again.');
      }
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (notLoggedIn || !event) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <AlertCircle className="w-14 h-14 text-purple-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Login Required to Book</h1>
          <p className="text-slate-500 mb-6">Please log in to your parent account to book spots for your children.</p>
          <div className="flex gap-3 justify-center">
            <Button asChild><Link href="/login">Log In</Link></Button>
            <Button variant="outline" asChild><Link href="/signup">Sign Up</Link></Button>
          </div>
        </div>
      </div>
    );
  }

  const selectedTier = hasTiers
    ? event?.seating_tiers?.find(t => t.id === selectedTierId) || event?.seating_tiers?.[0]
    : null;

  const unitPrice = selectedTier ? selectedTier.tier_price : (event?.price || 0);
  const ticketCount = selectedChildIds.length || 1;
  const subtotal = unitPrice * ticketCount;
  const platformFee = 50;
  const gst = Math.round(unitPrice * 0.18) * ticketCount;
  const total = subtotal + platformFee + gst;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        <Link href={`/events/${event.id}`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-purple-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Event Details
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Checkout</h1>

        <form onSubmit={handleBook}>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Main Form */}
            <div className="w-full lg:w-2/3 space-y-6">

              {/* Seating Tier Selection (if Event has seating tiers) */}
              {hasTiers && (
                <Card className="border-purple-200 bg-purple-50/40">
                  <CardHeader>
                    <CardTitle className="text-purple-900 text-base">Seating Tier Selected</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {event.seating_tiers!.map(tier => {
                      const isSelected = selectedTierId === tier.id;
                      const isSoldOut = tier.tier_seats_available <= 0;
                      return (
                        <div
                          key={tier.id}
                          onClick={() => !isSoldOut && setSelectedTierId(tier.id)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                            isSoldOut
                              ? 'opacity-50 border-slate-200 bg-slate-100 cursor-not-allowed'
                              : isSelected
                              ? 'border-purple-600 bg-white ring-2 ring-purple-600/30 shadow-sm'
                              : 'border-slate-200 bg-white hover:border-purple-300'
                          }`}
                        >
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{tier.tier_name}</p>
                            <p className="text-xs text-slate-500">{isSoldOut ? 'Sold Out' : `${tier.tier_seats_available} seats left`}</p>
                          </div>
                          <span className="text-base font-extrabold text-purple-700">₹{tier.tier_price}</span>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}

              {/* Children Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Select Children to Book ({selectedChildIds.length} selected)</span>
                    <Link href="/dashboard/parent/profile" className="text-xs font-semibold text-purple-600 hover:underline flex items-center">
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add New Child
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                      <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                    </div>
                  )}

                  <div>
                    {children.length === 0 ? (
                      <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-sm text-orange-700">
                        No children in your profile yet.{' '}
                        <Link href="/dashboard/parent/profile" className="font-bold underline">Add a child profile</Link> first to complete booking.
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {children.map(c => {
                          const isSelected = selectedChildIds.includes(c.id);
                          return (
                            <div
                              key={c.id}
                              onClick={() => toggleChildSelection(c.id)}
                              className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                                isSelected ? 'border-purple-600 bg-purple-50/60 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded flex items-center justify-center ${isSelected ? 'bg-purple-600 text-white' : 'text-slate-300'}`}>
                                  {isSelected ? <CheckSquare className="w-5 h-5 text-purple-600 fill-purple-600" /> : <Square className="w-5 h-5" />}
                                </div>
                                <UserRound className="w-5 h-5 text-slate-400" />
                                <div>
                                  <p className="font-semibold text-slate-900 text-sm">{c.name}</p>
                                  <p className="text-xs text-slate-500">{c.age} years old</p>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                                {isSelected ? 'Selected' : 'Select'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">Emergency Contact Name</label>
                      <Input placeholder="E.g. Grandparent or Guardian" value={emergencyName} onChange={e => setEmergencyName(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">Emergency Phone Number</label>
                      <Input icon={<Phone className="w-4 h-4" />} placeholder="+91 98765 43210" type="tel" value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                      <FileText className="w-4 h-4" /> Any medical conditions or allergies?
                    </label>
                    <textarea
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[90px]"
                      placeholder="Leave blank if none"
                      value={medicalNotes}
                      onChange={e => setMedicalNotes(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader><CardTitle>Payment Method</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'border-purple-200 bg-purple-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <div className="flex items-center">
                        <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')}
                          className="w-5 h-5 text-purple-600 border-slate-300 focus:ring-purple-500" />
                        <span className="ml-3 font-semibold text-slate-900">UPI / Instant QR</span>
                      </div>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-6" />
                    </label>
                    <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-purple-200 bg-purple-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <div className="flex items-center">
                        <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')}
                          className="w-5 h-5 text-purple-600 border-slate-300 focus:ring-purple-500" />
                        <span className="ml-3 font-semibold text-slate-900">Credit / Debit Card</span>
                      </div>
                      <div className="flex space-x-2">
                        <div className="w-8 h-5 bg-slate-200 rounded" />
                        <div className="w-8 h-5 bg-slate-200 rounded" />
                      </div>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-1/3">
              <Card className="sticky top-28 bg-slate-900 text-white border-none shadow-2xl">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-6">Order Summary</h3>
                  <div className="mb-6">
                    <h4 className="font-semibold text-slate-200 text-lg mb-1">{event.title}</h4>
                    <p className="text-slate-400 text-sm">
                      {new Date(event.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · {event.event_time}
                    </p>
                    {selectedTier && (
                      <span className="inline-block mt-2 text-xs font-bold bg-purple-900/80 text-purple-200 border border-purple-700/60 px-2.5 py-1 rounded-md">
                        Tier: {selectedTier.tier_name} (₹{selectedTier.tier_price}/child)
                      </span>
                    )}
                  </div>
                  <div className="space-y-3 py-6 border-y border-slate-700 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">{ticketCount}x Ticket(s)</span>
                      <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Platform Fee</span>
                      <span className="font-semibold">₹{platformFee}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">GST (18%)</span>
                      <span className="font-semibold">₹{gst}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end mb-8">
                    <span className="text-slate-300">Total</span>
                    <span className="text-2xl font-bold text-white">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-14 bg-purple-500 hover:bg-purple-600 text-white mb-4 font-bold"
                    disabled={submitting || selectedChildIds.length === 0}
                  >
                    {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing…</> : `Pay ₹${total.toLocaleString('en-IN')} & Confirm`}
                  </Button>
                  <div className="flex items-center justify-center text-xs text-slate-400">
                    <ShieldCheck className="w-4 h-4 mr-1 text-green-400" />
                    Secure 256-bit SSL encryption
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
