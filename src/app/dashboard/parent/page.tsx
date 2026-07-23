'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar, MapPin, Download, Settings, Heart, Ticket, User, Bell,
  ChevronRight, X, AlertTriangle, Loader2, CheckCircle2, Star
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { authService, SessionUser } from '@/services/auth';
import { dbService } from '@/services/db';
import type { Booking } from '@/types';

const NAV_LINKS = [
  { href: '/dashboard/parent', label: 'My Bookings', icon: Ticket },
  { href: '/dashboard/parent/saved', label: 'Saved Events', icon: Heart },
  { href: '/dashboard/parent/profile', label: 'Profile & Kids', icon: User },
  { href: '/dashboard/parent/settings', label: 'Settings', icon: Settings },
];

/** Confirmation modal for booking cancellation */
function CancelModal({
  booking, onConfirm, onClose, loading,
}: {
  booking: Booking; onConfirm: () => void; onClose: () => void; loading: boolean;
}) {
  const eventDate = booking.event?.event_date
    ? new Date(booking.event.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '';
  const isWithin48h = booking.event?.event_date
    ? (new Date(booking.event.event_date).getTime() - Date.now()) < 48 * 3600 * 1000
    : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Cancel booking?</h2>
            <p className="text-sm text-slate-500 mt-0.5">This cannot be undone.</p>
          </div>
        </div>
        <div className="bg-slate-50 rounded-2xl p-4 mb-6 text-sm text-slate-700 space-y-2">
          <p><span className="font-semibold">Event:</span> {booking.event?.title}</p>
          {booking.child && <p><span className="font-semibold">Child:</span> {booking.child.name}</p>}
          {eventDate && <p><span className="font-semibold">Date:</span> {eventDate}</p>}
          <p><span className="font-semibold">Ref:</span> {booking.booking_reference}</p>
        </div>
        {isWithin48h ? (
          <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3 mb-6 text-sm text-orange-800">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Late cancellation fee applies</p>
              <p className="mt-0.5 text-orange-700">A 20% fee will be deducted per our <Link href="/refund-policy" className="underline">Refund Policy</Link>.</p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-2xl px-4 py-3 mb-6 text-sm text-green-800">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            <p>You qualify for a <strong>full refund</strong>. Processing takes 5–7 business days.</p>
          </div>
        )}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>Keep booking</Button>
          <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={onConfirm} disabled={loading}>
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Cancelling…</> : 'Yes, Cancel'}
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Star rating input */
function StarRating({ value, onChange, disabled }: { value: number; onChange: (v: number) => void; disabled?: boolean }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none disabled:cursor-default"
          aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
        >
          <Star
            className={`w-7 h-7 transition-colors ${(hovered || value) >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
          />
        </button>
      ))}
    </div>
  );
}

/** Inline review submission form for a past booking */
function ReviewForm({ booking, parentId, onSubmitted }: {
  booking: Booking; parentId: string; onSubmitted: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (rating === 0) { setError('Please select a star rating.'); return; }
    if (!comment.trim() || comment.trim().length < 10) {
      setError('Please write at least 10 characters.'); return;
    }
    if (!booking.event_id) { setError('Could not find event ID.'); return; }
    setSubmitting(true);
    try {
      await dbService.createReview({
        event_id: booking.event_id,
        parent_id: parentId,
        rating,
        comment: comment.trim(),
      });
      setDone(true);
      setTimeout(onSubmitted, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="flex items-center gap-2 text-green-700 text-sm font-semibold py-2">
        <CheckCircle2 className="w-5 h-5" /> Review submitted — thank you!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 border-t border-slate-100 pt-4 space-y-3">
      <p className="text-sm font-semibold text-slate-700">Leave a Review</p>
      <StarRating value={rating} onChange={setRating} disabled={submitting} />
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        rows={3}
        placeholder="How was the experience? (min. 10 characters)"
        disabled={submitting}
        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
      />
      {error && (
        <p className="text-red-600 text-xs flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 shrink-0" /> {error}
        </p>
      )}
      <Button type="submit" size="sm" disabled={submitting || rating === 0}>
        {submitting ? <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Submitting…</> : 'Submit Review'}
      </Button>
    </form>
  );
}

export default function ParentDashboard() {
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // Track which past bookings already have a review (keyed by event_id)
  const [reviewedEventIds, setReviewedEventIds] = useState<Set<string>>(new Set());
  // Show/hide inline review form per booking
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  // Cancellation state
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelledId, setCancelledId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      if (!currentUser) return;

      const profile = await dbService.getParentProfile(currentUser.id);
      if (!profile) return;
      setParentId(profile.id);

      const [bookings, notifs, existingReviews] = await Promise.all([
        dbService.getBookingsByParent(profile.id),
        dbService.getNotifications(profile.id),
        dbService.getReviewsByParent(profile.id),
      ]);

      const now = new Date();
      const upcoming = bookings.filter(b => b.status !== 'cancelled' && b.event && new Date(b.event.event_date) >= now);
      const past = bookings.filter(b => b.status !== 'cancelled' && b.event && new Date(b.event.event_date) < now);
      const cancelled = bookings.filter(b => b.status === 'cancelled');

      setUpcomingBookings(upcoming);
      setPastBookings([...past, ...cancelled]);
      setNotifications(notifs.filter(n => !n.read).slice(0, 3));
      setReviewedEventIds(new Set(existingReviews.map(r => r.event_id)));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;
    setCancelLoading(true);
    try {
      await dbService.cancelBooking(cancelTarget.id);
      setCancelledId(cancelTarget.id);
      setUpcomingBookings(prev => prev.filter(b => b.id !== cancelTarget.id));
      setPastBookings(prev => [...prev, { ...cancelTarget, status: 'cancelled', payment_status: 'refunded' }]);
      setCancelTarget(null);
    } catch (err: any) {
      alert(err.message || 'Failed to cancel booking. Please try again.');
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      {cancelTarget && (
        <CancelModal
          booking={cancelTarget}
          onConfirm={handleCancelConfirm}
          onClose={() => setCancelTarget(null)}
          loading={cancelLoading}
        />
      )}

      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">My Dashboard</h1>
            {user && <p className="text-slate-500 mt-1">Welcome back, {user.name.split(' ')[0]}!</p>}
          </div>
          {notifications.length > 0 && (
            <div className="relative">
              <Bell className="w-6 h-6 text-slate-500" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <Card>
              <CardContent className="p-4 space-y-2">
                {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href;
                  return (
                    <Link key={href} href={href}
                      className={`flex items-center px-4 py-3 rounded-xl font-medium transition-colors ${active ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-slate-50 hover:text-purple-600'}`}
                    >
                      <Icon className="w-5 h-5 mr-3" /> {label}
                    </Link>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">

            {/* Cancellation success banner */}
            {cancelledId && (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 rounded-2xl px-5 py-4 text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <p><strong>Booking cancelled.</strong> Your refund will be processed within 5–7 business days.</p>
                <button onClick={() => setCancelledId(null)} className="ml-auto text-green-600 hover:text-green-800"><X className="w-4 h-4" /></button>
              </div>
            )}

            {/* Unread notifications */}
            {notifications.length > 0 && (
              <div className="space-y-3">
                {notifications.map(n => (
                  <div key={n.id} className={`flex items-start gap-3 p-4 rounded-2xl border ${n.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-purple-50 border-purple-100 text-purple-800'}`}>
                    <Bell className="w-5 h-5 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{n.title}</p>
                      <p className="text-xs mt-0.5 opacity-80">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upcoming */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Upcoming Activities</h2>
              {loading ? (
                <Card><CardContent className="py-12 text-center text-slate-400">Loading bookings…</CardContent></Card>
              ) : upcomingBookings.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-slate-500 py-12">
                    <Ticket className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="font-semibold text-slate-700 mb-2">No upcoming bookings</p>
                    <p className="text-sm mb-6">Find activities for your kids and book in seconds.</p>
                    <Button asChild><Link href="/explore">Explore Activities</Link></Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map(booking => (
                    <Card key={booking.id} className="border-l-4 border-l-purple-500 overflow-hidden">
                      <CardContent className="p-0 sm:flex items-stretch">
                        <div className="w-full sm:w-48 h-48 sm:h-auto shrink-0 bg-slate-200">
                          <img
                            src={booking.event?.image_url || 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&q=80&w=400'}
                            alt={booking.event?.title || 'Event'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-6 flex flex-col justify-between flex-1">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <Badge variant="pill" className="bg-purple-100 text-purple-800">{booking.event?.category}</Badge>
                              <Badge variant="outline">Ref: {booking.booking_reference}</Badge>
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1">{booking.event?.title}</h3>
                            {booking.child && (
                              <p className="text-sm text-slate-500 mb-4">For {booking.child.name} ({booking.child.age} yrs)</p>
                            )}
                            <div className="flex items-center text-sm text-slate-600 mb-2">
                              <Calendar className="w-4 h-4 mr-2" />
                              {booking.event?.event_date ? new Date(booking.event.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                              {booking.event?.event_time && ` at ${booking.event.event_time}`}
                            </div>
                            <div className="flex items-center text-sm text-slate-600">
                              <MapPin className="w-4 h-4 mr-2" />
                              {booking.event?.location}
                            </div>
                          </div>
                          <div className="mt-6 flex gap-3 flex-wrap">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/events/${booking.event_id}/book/confirmation?booking=${booking.id}`}>
                                <Download className="w-4 h-4 mr-2" /> View Ticket
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-200 text-red-600 hover:bg-red-50"
                              onClick={() => setCancelTarget(booking)}
                            >
                              <X className="w-4 h-4 mr-2" /> Cancel
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Past / Cancelled */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Past Bookings</h2>
              {loading ? (
                <Card><CardContent className="py-8 text-center text-slate-400">Loading…</CardContent></Card>
              ) : pastBookings.length === 0 ? (
                <Card><CardContent className="p-6 text-center text-slate-500 py-12">No past bookings yet.</CardContent></Card>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                      {pastBookings.map(booking => {
                        const isPast = booking.status !== 'cancelled';
                        const alreadyReviewed = booking.event_id ? reviewedEventIds.has(booking.event_id) : false;
                        const isReviewing = reviewingId === booking.id;

                        return (
                          <div key={booking.id} className="p-4 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                                  <img
                                    src={booking.event?.image_url || 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&q=80&w=100'}
                                    alt={booking.event?.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-900 text-sm">{booking.event?.title}</p>
                                  <p className="text-xs text-slate-500">
                                    {booking.event?.event_date ? new Date(booking.event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                                    {' '}· {booking.child?.name}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge
                                  className={booking.status === 'cancelled' ? 'bg-slate-100 text-slate-600' : 'bg-green-50 text-green-700'}
                                >
                                  {booking.status === 'cancelled' ? 'Cancelled' : 'Completed'}
                                </Badge>
                                {/* Leave Review button for completed (non-cancelled) past events */}
                                {isPast && !alreadyReviewed && (
                                  <button
                                    onClick={() => setReviewingId(isReviewing ? null : booking.id)}
                                    className="flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors"
                                    title="Leave a review"
                                  >
                                    <Star className="w-4 h-4" />
                                    {isReviewing ? 'Close' : 'Review'}
                                  </button>
                                )}
                                {isPast && alreadyReviewed && (
                                  <span className="flex items-center gap-1 text-xs text-amber-500 font-medium">
                                    <Star className="w-3.5 h-3.5 fill-amber-400" /> Reviewed
                                  </span>
                                )}
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                              </div>
                            </div>

                            {/* Inline review form */}
                            {isReviewing && parentId && (
                              <ReviewForm
                                booking={booking}
                                parentId={parentId}
                                onSubmitted={() => {
                                  setReviewingId(null);
                                  if (booking.event_id) {
                                    setReviewedEventIds(prev => new Set(Array.from(prev).concat(booking.event_id!)));
                                  }
                                }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
