'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, ShieldCheck, Loader2, AlertCircle,
  Plus, UserRound, Phone, FileText
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
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [parent, setParent] = useState<Parent | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notLoggedIn, setNotLoggedIn] = useState(false);

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
        if (kids.length > 0) setSelectedChildId(kids[0].id);
      }
      setLoading(false);
    };
    load();
  }, [eventId, router]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!parent) { setError('You must be logged in as a parent to book.'); return; }
    if (!selectedChildId || selectedChildId === 'new') {
      setError('Please select or add a child first from your Profile page.'); return;
    }
    if (!event) return;

    setSubmitting(true);
    try {
      const booking = await dbService.createBooking({
        event_id: event.id,
        child_id: selectedChildId,
        parent_id: parent.id,
      });

      // Fire-and-forget booking confirmation notification + email
      const selectedChild = children.find(c => c.id === selectedChildId);
      const platformFee = 50;
      const gst = Math.round(event.price * 0.18);
      const total = event.price + platformFee + gst;
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
          childName: selectedChild?.name || '',
          bookingReference: booking.booking_reference,
          paidAmount: event.price > 0 ? total : null,
        }),
      }).catch(() => {}); // never block navigation on notification failure

      router.push(`/events/${event.id}/book/confirmation?booking=${booking.id}`);
    } catch (err: any) {
      // Surface seat-unavailability errors from the Postgres trigger clearly
      const msg = err.message || '';
      if (msg.toLowerCase().includes('seats') || msg.toLowerCase().includes('available')) {
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

  if (notLoggedIn) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <UserRound className="w-14 h-14 text-purple-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Log in to book</h1>
          <p className="text-slate-500 mb-6">You need a parent account to book activities for your children.</p>
          <div className="flex gap-3 justify-center">
            <Button asChild><Link href={`/login?redirect=/events/${eventId}/book`}>Log In</Link></Button>
            <Button variant="outline" asChild><Link href="/signup">Sign Up</Link></Button>
          </div>
        </div>
      </div>
    );
  }

  if (!event) return null;

  const platformFee = 50;
  const gst = Math.round(event.price * 0.18);
  const total = event.price + platformFee + gst;

  return (
    <div className="bg-slate-50 min-h-screen pt-8 md:pt-10 pb-24">
      <div className="max-w-5xl mx-auto px-6 md:px-16 lg:px-24">
        <Link href={`/events/${eventId}`} className="inline-flex items-center text-slate-500 hover:text-purple-600 text-sm font-medium mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Event
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 sm:mb-8">Complete Your Booking</h1>

        <form onSubmit={handleBook}>
          <div className="flex flex-col lg:flex-row gap-10">

            {/* Form Content */}
            <div className="w-full lg:w-2/3 space-y-8">

              {/* Child Selection */}
              <Card>
                <CardHeader><CardTitle>Child Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                      <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">Select Child</label>
                      {children.length === 0 ? (
                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-sm text-orange-700">
                          No children in your profile yet.{' '}
                          <Link href="/dashboard/parent/profile" className="font-bold underline">Add a child</Link> first, then come back to book.
                        </div>
                      ) : (
                        <select
                          className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          value={selectedChildId}
                          onChange={e => setSelectedChildId(e.target.value)}
                          required
                        >
                          {children.map(c => (
                            <option key={c.id} value={c.id}>{c.name} ({c.age} yrs)</option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">Emergency Contact Name</label>
                      <Input placeholder="E.g. Grandparent or Guardian" value={emergencyName} onChange={e => setEmergencyName(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Emergency Contact Number</label>
                    <Input icon={<Phone className="w-4 h-4" />} placeholder="+91 98765 43210" type="tel" value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)} />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                      <FileText className="w-4 h-4" /> Any medical conditions or allergies?
                    </label>
                    <textarea
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
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
                        <span className="ml-3 font-semibold text-slate-900">UPI / QR Code</span>
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
                  </div>
                  <div className="space-y-3 py-6 border-y border-slate-700 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">1x Ticket</span>
                      <span className="font-semibold">₹{event.price.toLocaleString('en-IN')}</span>
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
                    className="w-full h-14 bg-purple-500 hover:bg-purple-600 text-white mb-4"
                    disabled={submitting || children.length === 0}
                  >
                    {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing…</> : 'Pay & Confirm'}
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
