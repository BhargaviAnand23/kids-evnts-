'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useParams } from 'next/navigation';
import { CheckCircle, Calendar, MapPin, Download, ArrowRight, Loader2, QrCode, User, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { dbService } from '@/services/db';
import { Confetti } from '@/components/ui/Confetti';
import type { Booking } from '@/types';

import { motion, AnimatePresence } from 'framer-motion';
import { MagneticButton } from '@/components/ui/MagneticButton';

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('booking');
  const params = useParams();
  const eventId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      if (!bookingId) { setLoading(false); return; }
      const b = await dbService.getBookingById(bookingId);
      setBooking(b);
      setLoading(false);
    };
    load();
  }, [bookingId]);

  const handleDownload = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Kidspire Ticket — ${booking?.booking_reference}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 40px; color: #0f172a; }
            .ticket { border: 2px solid #7c3aed; border-radius: 24px; padding: 32px; max-width: 600px; margin: 0 auto; }
            .header { color: #7c3aed; font-size: 28px; font-weight: 900; margin-bottom: 8px; }
            .ref { background: #f3f4f6; border-radius: 8px; padding: 8px 16px; font-family: monospace; display: inline-block; margin-bottom: 20px; }
            .row { display: flex; gap: 12px; margin-bottom: 12px; font-size: 15px; }
            .label { color: #64748b; min-width: 110px; }
            .badge { background: #dcfce7; color: #166534; border-radius: 999px; padding: 4px 12px; font-size: 12px; font-weight: bold; }
            .qr { text-align: center; margin-top: 24px; border-top: 1px dashed #e2e8f0; padding-top: 24px; }
            .qr-box { width: 120px; height: 120px; background: #f3f4f6; border-radius: 12px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; font-size: 40px; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">Kidspire</div>
            <p style="color:#64748b;margin-bottom:16px">Digital Admission Pass</p>
            <div class="ref">${booking?.booking_reference || ''}</div>
            <div class="row"><span class="label">Event</span><strong>${booking?.event?.title || ''}</strong></div>
            <div class="row"><span class="label">Child</span>${booking?.child?.name || ''} (${booking?.child?.age} yrs)</div>
            <div class="row"><span class="label">Date</span>${booking?.event?.event_date ? new Date(booking.event.event_date).toLocaleDateString('en-US', { weekday:'long',month:'long',day:'numeric',year:'numeric'}) : ''}</div>
            <div class="row"><span class="label">Time</span>${booking?.event?.event_time || ''}</div>
            <div class="row"><span class="label">Location</span>${booking?.event?.location || ''}</div>
            <div class="row"><span class="label">Status</span><span class="badge">CONFIRMED &amp; PAID</span></div>
            <div class="qr">
              <div class="qr-box">&#9646;&#9647;</div>
              <p style="font-size:11px;color:#94a3b8">Scan at venue entry</p>
            </div>
          </div>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 300);
  };

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  // Fallback if no booking found (e.g. direct URL access)
  const eventTitle = booking?.event?.title || 'Your Event';
  const eventDate = booking?.event?.event_date
    ? new Date(booking.event.event_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : 'See booking email for details';
  const eventTime = booking?.event?.event_time || '';
  const eventLocation = booking?.event?.location || '';
  const childName = booking?.child?.name || '';
  const childAge = booking?.child?.age;
  const bookingRef = booking?.booking_reference || 'KDS-XXXXXX';
  const paidAmount = booking?.event?.price
    ? (booking.event.price + 50 + Math.round(booking.event.price * 0.18)).toLocaleString('en-IN')
    : '—';

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center py-10 sm:py-16 px-6 md:px-16 lg:px-24 relative overflow-hidden">
      <Confetti />

      {/* ── Full-Screen Celebratory Over-the-Top Takeover ── */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 bg-purple-950/90 backdrop-blur-xl flex items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.2, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 140, damping: 14, mass: 0.8 }}
              className="max-w-md w-full bg-gradient-to-b from-purple-600 via-purple-700 to-indigo-900 rounded-[32px] p-8 text-white shadow-2xl border-4 border-amber-300/40 relative overflow-hidden"
            >
              <div className="w-20 h-20 bg-amber-400 text-purple-950 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce-subtle">
                <CheckCircle className="w-10 h-10" />
              </div>

              <span className="inline-block px-3 py-1 bg-amber-300/20 text-amber-300 rounded-full text-xs font-black tracking-widest uppercase mb-2">
                🎉 Spot Reserved!
              </span>

              <h2 className="text-3xl font-black mb-2 tracking-tight">You're Going!</h2>
              <p className="text-purple-200 text-sm mb-6 leading-relaxed">
                <strong className="text-white">{childName || 'Your child'}</strong> is confirmed for <strong className="text-amber-300">{eventTitle}</strong>.
              </p>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 mb-6 text-left font-mono text-xs text-purple-100 flex justify-between items-center">
                <span>PASS #{bookingRef}</span>
                <span className="px-2 py-0.5 bg-green-400 text-green-950 font-bold rounded text-[10px]">PAID</span>
              </div>

              <MagneticButton className="w-full">
                <Button
                  size="lg"
                  onClick={() => setShowCelebration(false)}
                  className="w-full bg-amber-400 hover:bg-amber-300 text-purple-950 font-extrabold h-14 rounded-full text-base shadow-lg shadow-amber-400/30"
                >
                  View Digital Pass <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </MagneticButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="max-w-2xl w-full">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Booking Confirmed!</h1>
          <p className="text-slate-600 text-base">
            You're all set! A confirmation email with your ticket has been sent to your registered email address.
          </p>
        </div>

        {/* Ticket Card */}
        <div ref={printRef}>
          <Card className="border-2 border-purple-100 shadow-xl shadow-purple-900/5 mb-6 overflow-hidden">
            {/* Ticket header band */}
            <div className="bg-purple-600 px-8 py-4 flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-xs font-bold uppercase tracking-wider">Digital Admission Pass</p>
                <p className="text-white font-black text-xl tracking-tight">Kidspire</p>
              </div>
              <Badge className="bg-green-400 text-green-900 font-bold text-xs px-3 py-1">CONFIRMED</Badge>
            </div>

            <CardContent className="p-6 sm:p-8">
              {/* Booking ref */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-dashed border-slate-200">
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Booking Reference</p>
                  <p className="font-mono font-bold text-slate-900 text-lg tracking-wider">{bookingRef}</p>
                </div>
                <Badge className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 uppercase">Paid ✓</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                {/* Event details */}
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Event</p>
                    <p className="font-bold text-slate-900">{eventTitle}</p>
                    {booking?.event?.category && (
                      <Badge variant="pill" className="mt-1 bg-purple-100 text-purple-800 text-xs">{booking.event.category}</Badge>
                    )}
                    {booking?.tier_name && (
                      <Badge variant="pill" className="mt-1 ml-1.5 bg-indigo-100 text-indigo-800 text-xs">Tier: {booking.tier_name}</Badge>
                    )}
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{eventDate}</p>
                      {eventTime && <p className="text-xs text-slate-500">{eventTime}</p>}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-700">{eventLocation}</p>
                  </div>
                  {childName && (
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                      <p className="text-sm text-slate-700">{childName}{childAge ? ` · ${childAge} yrs` : ''}</p>
                    </div>
                  )}
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center justify-center border-l border-dashed border-slate-200 pl-6">
                  <div className="w-28 h-28 bg-slate-900 rounded-2xl flex items-center justify-center mb-3 relative overflow-hidden">
                    {/* Stylised QR pattern using CSS */}
                    <div className="grid grid-cols-7 gap-0.5 p-2">
                      {Array.from({ length: 49 }).map((_, i) => {
                        // Deterministic pattern based on booking ref
                        const seed = bookingRef.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
                        const filled = ((seed * (i + 1) * 7) % 13) > 5;
                        const isCorner = [0,1,7,8, 5,6,12,13, 35,36,42,43, 40,41,47,48].includes(i);
                        return (
                          <div
                            key={i}
                            className={`w-2.5 h-2.5 rounded-sm ${(filled || isCorner) ? 'bg-white' : 'bg-transparent'}`}
                          />
                        );
                      })}
                    </div>
                    <QrCode className="absolute text-white/10 w-full h-full p-4" />
                  </div>
                  <p className="text-xs text-slate-500 text-center">Scan at venue entry</p>
                  {paidAmount !== '—' && (
                    <p className="text-xs font-bold text-slate-700 mt-1">₹{paidAmount} paid</p>
                  )}
                </div>
              </div>

              {/* Dashed divider - ticket tear */}
              <div className="border-t-2 border-dashed border-slate-200 -mx-8 mb-6 relative">
                <div className="absolute -left-3 -top-3 w-6 h-6 bg-slate-100 rounded-full border border-slate-200" />
                <div className="absolute -right-3 -top-3 w-6 h-6 bg-slate-100 rounded-full border border-slate-200" />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Ticket className="w-4 h-4" />
                <span>Valid only for the event date. Non-transferable. Refunds subject to our refund policy.</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="outline" size="lg" className="w-full sm:w-auto h-14" onClick={handleDownload}>
            <Download className="w-5 h-5 mr-2" /> Download Ticket
          </Button>
          {booking?.event && (
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-14 border-purple-200 text-purple-700 hover:bg-purple-50"
              onClick={() => {
                const ev = booking.event;
                if (!ev) return;
                const title = encodeURIComponent(ev.title);
                const details = encodeURIComponent(`Kidspire Booking Ref: ${booking.booking_reference}. Child: ${booking.child?.name || 'Kid'}`);
                const loc = encodeURIComponent(ev.location || 'Online');
                const dateObj = new Date(ev.event_date);
                const yyyy = dateObj.getFullYear();
                const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
                const dd = String(dateObj.getDate()).padStart(2, '0');
                const dates = `${yyyy}${mm}${dd}T090000Z/${yyyy}${mm}${dd}T110000Z`;
                window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${loc}`, '_blank');
              }}
            >
              <Calendar className="w-5 h-5 mr-2 text-purple-600" /> Add to Calendar
            </Button>
          )}
          <Button size="lg" className="w-full sm:w-auto h-14" asChild>
            <Link href="/explore">
              Explore More <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          View all your bookings in your{' '}
          <Link href="/dashboard/parent" className="text-purple-600 hover:underline font-medium">Parent Dashboard</Link>.
        </p>
      </div>
    </div>
  );
}
