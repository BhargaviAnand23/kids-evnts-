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
import { FormError } from '@/components/ui/FormError';
import type { AuthChangeEvent } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
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
    let isMounted = true;

    const loadData = async () => {
      try {
        const [eventData, currentUser] = await Promise.all([
          dbService.getEventById(eventId),
          authService.getCurrentUser(),
        ]);

        if (!isMounted) return;

        if (!eventData) {
          router.push('/explore');
          return;
        }
        setEvent(eventData);

        if (!currentUser) {
          setNotLoggedIn(true);
          setLoading(false);
          return;
        }

        // User is logged in
        setNotLoggedIn(false);

        // Fetch or self-heal parent profile
        let profile = await dbService.getParentProfile(currentUser.id);
        if (!profile) {
          try {
            profile = await dbService.createParentProfile({
              auth_user_id: currentUser.id,
              name: currentUser.name || 'Parent',
              email: currentUser.email || '',
              phone: '',
            });
          } catch (e) {
            console.warn('Could not auto-create parent profile:', e);
          }
        }

        if (!isMounted) return;

        if (profile) {
          setParent(profile);
          const kids = await dbService.getChildren(profile.id);
          if (isMounted) {
            setChildren(kids);
            if (kids.length > 0) {
              setSelectedChildIds([kids[0].id]);
            }
          }
        } else {
          // Fallback parent profile object for session user
          const fallbackParent: Parent = {
            id: currentUser.id,
            auth_user_id: currentUser.id,
            name: currentUser.name || 'Parent User',
            email: currentUser.email || '',
            phone: '',
            created_at: new Date().toISOString(),
          };
          setParent(fallbackParent);
          const kids = await dbService.getChildren(fallbackParent.id);
          if (isMounted) {
            setChildren(kids);
            if (kids.length > 0) {
              setSelectedChildIds([kids[0].id]);
            }
          }
        }
      } catch (err) {
        console.error('Error loading booking data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    // Subscribe to Supabase auth state changes for immediate hydration reactivity
    const supabase = createClient();
    let subscription: any = null;

    if (supabase) {
      const res = supabase.auth.onAuthStateChange(async (evt: AuthChangeEvent) => {
        if (evt === 'SIGNED_IN' || evt === 'TOKEN_REFRESHED' || evt === 'INITIAL_SESSION') {
          loadData();
        } else if (evt === 'SIGNED_OUT') {
          if (isMounted) {
            setNotLoggedIn(true);
            setParent(null);
            setChildren([]);
          }
        }
      });
      subscription = res.data?.subscription;
    }

    return () => {
      isMounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, [eventId, router]);

  const toggleChildSelection = (id: string) => {
    setSelectedChildIds(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const selectedTier = hasTiers
    ? event?.seating_tiers?.find(t => t.id === selectedTierId) || event?.seating_tiers?.[0]
    : null;

  const unitPrice = selectedTier ? selectedTier.tier_price : (event?.price || 0);

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

    if (selectedTier && selectedChildIds.length > selectedTier.tier_seats_available) {
      setError(`Only ${selectedTier.tier_seats_available} seat(s) remaining for the ${selectedTier.tier_name} tier.`);
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

      router.push(`/events/${event.id}/book/confirmation?booking=${createdBookingIds.join(',')}`);
    } catch (err: any) {
      const msg = err?.message || err?.error_description || '';
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
          <h1 className="text-card-title font-bold text-slate-900 mb-2">Login Required to Book</h1>
          <p className="text-slate-500 text-body mb-6">Please log in to your parent account to book spots for your children.</p>
          <div className="flex gap-3 justify-center">
            <Button asChild><Link href="/login">Log In</Link></Button>
            <Button variant="outline" asChild><Link href="/signup">Sign Up</Link></Button>
          </div>
        </div>
      </div>
    );
  }

  const ticketCount = selectedChildIds.length || 1;
  const subtotal = unitPrice * ticketCount;
  const platformFee = 50;
  const gst = Math.round(unitPrice * 0.18) * ticketCount;
  const total = subtotal + platformFee + gst;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <Link href={`/events/${event.id}`} className="inline-flex items-center text-caption font-semibold text-slate-500 hover:text-purple-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Event Details
        </Link>

        {/* Progress Step Indicator */}
        <div className="mb-8 max-w-2xl">
          <div className="flex items-center justify-between relative">
            {/* Step Line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 transition-all duration-500 ease-out"
                style={{ width: selectedChildIds.length > 0 ? '50%' : '15%' }}
              />
            </div>

            {/* Step 1 */}
            <div className="flex items-center gap-2 bg-slate-50 pr-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-caption transition-all duration-300 ${
                selectedChildIds.length > 0 ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20' : 'bg-purple-100 text-purple-700 ring-4 ring-purple-50'
              }`}>
                1
              </div>
              <span className="text-caption font-bold text-slate-800 hidden sm:inline">Select Child</span>
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-2 bg-slate-50 px-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-caption transition-all duration-300 ${
                selectedChildIds.length > 0 ? 'bg-purple-600 text-white ring-4 ring-purple-100 shadow-md shadow-purple-500/20' : 'bg-slate-200 text-slate-500'
              }`}>
                2
              </div>
              <span className="text-caption font-bold text-slate-800 hidden sm:inline">Payment</span>
            </div>

            {/* Step 3 */}
            <div className="flex items-center gap-2 bg-slate-50 pl-4">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-caption">
                3
              </div>
              <span className="text-caption font-bold text-slate-500 hidden sm:inline">Confirm</span>
            </div>
          </div>
        </div>

        <h1 className="text-page-title font-bold text-slate-900 mb-6">Checkout</h1>

        <form onSubmit={handleBook}>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Main Form */}
            <div className="w-full lg:w-2/3 space-y-6">

              {/* Seating Tier Selection (if Event has seating tiers) */}
              {hasTiers && (
                <Card className="border-purple-200 bg-purple-50/40">
                  <CardHeader>
                    <CardTitle className="text-purple-900 text-card-title">Seating Tier Selected</CardTitle>
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
                            <p className="font-bold text-slate-900 text-body">{tier.tier_name}</p>
                            <p className="text-caption text-slate-500">{isSoldOut ? 'Sold Out' : `${tier.tier_seats_available} seats left`}</p>
                          </div>
                          <span className="text-section-title font-extrabold text-purple-700">₹{tier.tier_price}</span>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}

              {/* Children Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-card-title">
                    <span>Select Children to Book ({selectedChildIds.length} selected)</span>
                    <Link href="/dashboard/parent/profile" className="text-caption font-semibold text-purple-600 hover:underline flex items-center">
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add New Child
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormError message={error} />

                  <div>
                    {children.length === 0 ? (
                      <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl">
                        <UserRound className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                        <p className="text-slate-600 text-body font-semibold mb-1">No children added yet</p>
                        <p className="text-slate-400 text-caption mb-4">Please add a child profile before continuing with booking.</p>
                        <Button asChild size="sm">
                          <Link href="/dashboard/parent/profile">+ Add Child to Profile</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {children.map(child => {
                          const checked = selectedChildIds.includes(child.id);
                          return (
                            <div
                              key={child.id}
                              onClick={() => toggleChildSelection(child.id)}
                              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                                checked
                                  ? 'border-purple-600 bg-purple-50/50 ring-2 ring-purple-600/20'
                                  : 'border-slate-200 hover:border-purple-300 bg-white'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {checked ? (
                                  <CheckSquare className="w-5 h-5 text-purple-600 shrink-0" />
                                ) : (
                                  <Square className="w-5 h-5 text-slate-400 shrink-0" />
                                )}
                                <div>
                                  <p className="font-bold text-slate-900 text-body">{child.name}</p>
                                  <p className="text-caption text-slate-500">
                                    Age: {child.age} yrs {child.school ? `· ${child.school.name}` : ''}
                                  </p>
                                </div>
                              </div>
                              <span className="text-caption font-bold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full">
                                ₹{unitPrice}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact & Medical Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-card-title">Emergency Contact & Special Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-caption font-semibold text-slate-700 mb-1.5 flex items-center">
                        <UserRound className="w-4 h-4 mr-1.5 text-purple-600" /> Emergency Contact Name
                      </label>
                      <Input
                        placeholder="e.g. Spouse / Relative Name"
                        value={emergencyName}
                        onChange={e => setEmergencyName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-caption font-semibold text-slate-700 mb-1.5 flex items-center">
                        <Phone className="w-4 h-4 mr-1.5 text-purple-600" /> Emergency Phone Number
                      </label>
                      <Input
                        placeholder="10-digit mobile number"
                        value={emergencyPhone}
                        onChange={e => setEmergencyPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-caption font-semibold text-slate-700 mb-1.5 flex items-center">
                      <FileText className="w-4 h-4 mr-1.5 text-purple-600" /> Medical Notes / Allergies (Optional)
                    </label>
                    <textarea
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-body focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[90px]"
                      placeholder="Leave blank if none"
                      value={medicalNotes}
                      onChange={e => setMedicalNotes(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader><CardTitle className="text-card-title">Payment Method</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'border-purple-200 bg-purple-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <div className="flex items-center">
                        <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')}
                          className="w-5 h-5 text-purple-600 border-slate-300 focus:ring-purple-500" />
                        <span className="ml-3 font-semibold text-slate-900 text-body">UPI / Instant QR</span>
                      </div>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-6" />
                    </label>
                    <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-purple-200 bg-purple-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <div className="flex items-center">
                        <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')}
                          className="w-5 h-5 text-purple-600 border-slate-300 focus:ring-purple-500" />
                        <span className="ml-3 font-semibold text-slate-900 text-body">Credit / Debit Card</span>
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

            {/* Order Summary with smooth pop animation on update */}
            <div className="w-full lg:w-1/3">
              <Card
                key={selectedChildIds.join(',') + '-' + (selectedTier ? selectedTier.id : 'none')}
                className="sticky top-28 bg-slate-900 text-white border-none shadow-2xl animate-summary-pop overflow-hidden"
              >
                <CardContent className="p-8">
                  <h3 className="text-card-title font-bold mb-6">Order Summary</h3>
                  <div className="mb-6">
                    <h4 className="font-semibold text-slate-200 text-body-lg mb-1">{event.title}</h4>
                    <p className="text-slate-400 text-caption">
                      {new Date(event.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · {event.event_time}
                    </p>
                    {selectedTier && (
                      <span className="inline-block mt-2 text-micro font-bold bg-purple-900/80 text-purple-200 border border-purple-700/60 px-2.5 py-1 rounded-md">
                        Tier: {selectedTier.tier_name} (₹{selectedTier.tier_price}/child)
                      </span>
                    )}
                  </div>
                  <div className="space-y-3 py-6 border-y border-slate-700 mb-6">
                    {/* Line items per selected child */}
                    {children.filter(c => selectedChildIds.includes(c.id)).map(child => (
                      <div key={child.id} className="flex justify-between items-center text-body">
                        <span className="text-slate-200 font-semibold">{child.name}</span>
                        <span className="font-bold text-white">₹{unitPrice.toLocaleString('en-IN')}</span>
                      </div>
                    ))}

                    <div className="flex justify-between text-caption text-slate-400 pt-3 border-t border-slate-800">
                      <span>Subtotal ({ticketCount} ticket{ticketCount > 1 ? 's' : ''})</span>
                      <span className="font-semibold text-slate-300">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-caption text-slate-400">
                      <span>Platform Fee</span>
                      <span className="font-semibold text-slate-300">₹{platformFee}</span>
                    </div>
                    <div className="flex justify-between text-caption text-slate-400">
                      <span>GST (18%)</span>
                      <span className="font-semibold text-slate-300">₹{gst.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end mb-8">
                    <span className="text-slate-300 text-body">Total</span>
                    <span className="text-section-title font-bold text-white">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white mb-4 font-bold animate-btn-pulse-glow transition-all cursor-pointer"
                    disabled={submitting || selectedChildIds.length === 0}
                  >
                    {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing…</> : `Pay ₹${total.toLocaleString('en-IN')} & Confirm`}
                  </Button>
                  <div className="flex items-center justify-center text-caption text-slate-400">
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
