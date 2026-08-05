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
  const rawBookingParam = searchParams.get('booking') || searchParams.get('bookings') || '';
  const params = useParams();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      if (!rawBookingParam) { setLoading(false); return; }
      const ids = rawBookingParam.split(',').map(s => s.trim()).filter(Boolean);
      const fetched = await Promise.all(ids.map(id => dbService.getBookingById(id)));
      const valid = fetched.filter((b): b is Booking => b !== null);
      setBookings(valid);
      setLoading(false);
    };
    load();
  }, [rawBookingParam]);

  const primaryBooking = bookings[0] || null;
  const eventObj = primaryBooking?.event || null;

  const eventTitle = eventObj?.title || 'Your Event';
  const eventDate = eventObj?.event_date
    ? new Date(eventObj.event_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : 'See booking email for details';
  const eventTime = eventObj?.event_time || '';
  const eventLocation = eventObj?.location || '';

  const childrenNames = bookings.map(b => b.child?.name).filter(Boolean).join(' & ') || 'Your Child';

  const handleDownload = () => {
    if (!printRef.current) return;
    const win = window.open('', '_blank');
    if (!win) return;

    const ticketsHtml = bookings.map(b => `
      <div class="ticket" style="border: 2px solid #7c3aed; border-radius: 24px; padding: 32px; max-width: 600px; margin: 0 auto 30px auto; page-break-after: always;">
        <div style="color: #7c3aed; font-size: 28px; font-weight: 900; margin-bottom: 8px;">Kidspire</div>
        <p style="color:#64748b;margin-bottom:16px">Digital Admission Pass</p>
        <div style="background: #f3f4f6; border-radius: 8px; padding: 8px 16px; font-family: monospace; display: inline-block; margin-bottom: 20px; font-weight: bold;">
          REF: ${b.booking_reference}
        </div>
        <div style="display: flex; gap: 12px; margin-bottom: 12px; font-size: 15px;"><span style="color: #64748b; min-width: 110px;">Event</span><strong>${b.event?.title || eventTitle}</strong></div>
        <div style="display: flex; gap: 12px; margin-bottom: 12px; font-size: 15px;"><span style="color: #64748b; min-width: 110px;">Child</span><strong>${b.child?.name || 'Child'} ${b.child?.age ? `(${b.child.age} yrs)` : ''}</strong></div>
        <div style="display: flex; gap: 12px; margin-bottom: 12px; font-size: 15px;"><span style="color: #64748b; min-width: 110px;">Date</span>${b.event?.event_date ? new Date(b.event.event_date).toLocaleDateString('en-US', { weekday:'long',month:'long',day:'numeric',year:'numeric'}) : eventDate}</div>
        <div style="display: flex; gap: 12px; margin-bottom: 12px; font-size: 15px;"><span style="color: #64748b; min-width: 110px;">Time</span>${b.event?.event_time || eventTime}</div>
        <div style="display: flex; gap: 12px; margin-bottom: 12px; font-size: 15px;"><span style="color: #64748b; min-width: 110px;">Location</span>${b.event?.location || eventLocation}</div>
        <div style="display: flex; gap: 12px; margin-bottom: 12px; font-size: 15px;"><span style="color: #64748b; min-width: 110px;">Status</span><span style="background: #dcfce7; color: #166534; border-radius: 999px; padding: 4px 12px; font-size: 12px; font-weight: bold;">CONFIRMED &amp; PAID</span></div>
        <div style="text-align: center; margin-top: 24px; border-top: 1px dashed #e2e8f0; padding-top: 24px;">
          <div style="width: 120px; height: 120px; background: #f3f4f6; border-radius: 12px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; font-size: 40px;">&#9646;&#9647;</div>
          <p style="font-size:11px;color:#94a3b8">Scan at venue entry</p>
        </div>
      </div>
    `).join('');

    win.document.write(`
      <html>
        <head>
          <title>Kidspire Admission Passes</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 40px; color: #0f172a; }
          </style>
        </head>
        <body>
          ${ticketsHtml}
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

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center py-10 sm:py-16 px-6 md:px-16 lg:px-24 relative overflow-hidden">
      <Confetti />

      {/* Full-Screen Celebration Takeover */}
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
                🎉 {bookings.length > 1 ? `${bookings.length} Spots Reserved!` : 'Spot Reserved!'}
              </span>

              <h2 className="text-3xl font-black mb-2 tracking-tight">You're Going!</h2>
              <p className="text-purple-200 text-sm mb-6 leading-relaxed">
                <strong className="text-white">{childrenNames}</strong> {bookings.length > 1 ? 'are' : 'is'} confirmed for <strong className="text-amber-300">{eventTitle}</strong>.
              </p>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 mb-6 text-left font-mono text-xs text-purple-100 flex justify-between items-center">
                <span>{bookings.length > 1 ? `${bookings.length} PASSES ISSUED` : `PASS #${primaryBooking?.booking_reference || 'KDS-XXXX'}`}</span>
                <span className="px-2 py-0.5 bg-green-400 text-green-950 font-bold rounded text-[10px]">PAID</span>
              </div>

              <MagneticButton className="w-full">
                <Button
                  size="lg"
                  onClick={() => setShowCelebration(false)}
                  className="w-full bg-amber-400 hover:bg-amber-300 text-purple-950 font-extrabold h-14 rounded-full text-base shadow-lg shadow-amber-400/30"
                >
                  View Digital Pass{bookings.length > 1 ? 'es' : ''} <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </MagneticButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-2xl w-full">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md shadow-green-500/10 animate-check-scale">
            <svg className="w-10 h-10 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" className="animate-check-draw" />
            </svg>
          </div>
          <h1 className="text-page-title font-bold text-slate-900 mb-4 tracking-tight">
            {bookings.length > 1 ? `${bookings.length} Bookings Confirmed!` : 'Booking Confirmed!'}
          </h1>
          <p className="text-slate-600 text-body">
            You're all set! Confirmation emails with admission tickets have been sent for {childrenNames}.
          </p>
        </div>

        {/* Ticket Cards List */}
        <div ref={printRef} className="space-y-6 mb-6">
          {bookings.length === 0 ? (
            <Card className="border-2 border-purple-100 shadow-xl p-8 text-center">
              <p className="text-slate-600">Booking details confirmed. Check your dashboard for digital passes.</p>
            </Card>
          ) : (
            bookings.map((booking, idx) => {
              const bRef = booking.booking_reference || `KDS-00${idx + 1}`;
              const cName = booking.child?.name || 'Child';
              const cAge = booking.child?.age;
              const perChildUnitPrice = booking.event?.price || 0;
              const perChildTotal = perChildUnitPrice > 0
                ? (perChildUnitPrice + (50 / bookings.length) + Math.round(perChildUnitPrice * 0.18)).toLocaleString('en-IN')
                : '—';

              return (
                <Card key={booking.id || idx} className="border-2 border-purple-100 shadow-xl shadow-purple-900/5 overflow-hidden">
                  {/* Ticket header band */}
                  <div className="bg-purple-600 px-8 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-purple-200 text-xs font-bold uppercase tracking-wider">
                        Digital Admission Pass {bookings.length > 1 ? `(${idx + 1} of ${bookings.length})` : ''}
                      </p>
                      <p className="text-white font-black text-xl tracking-tight">Kidspire</p>
                    </div>
                    <Badge className="bg-green-400 text-green-900 font-bold text-xs px-3 py-1">CONFIRMED</Badge>
                  </div>

                  <CardContent className="p-6 sm:p-8">
                    {/* Booking ref */}
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-dashed border-slate-200">
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">Booking Reference</p>
                        <p className="font-mono font-bold text-slate-900 text-lg tracking-wider">{bRef}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 uppercase">Paid ✓</Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      {/* Event details */}
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Event</p>
                          <p className="font-bold text-slate-900">{booking.event?.title || eventTitle}</p>
                          {booking.event?.category && (
                            <Badge variant="pill" className="mt-1 bg-purple-100 text-purple-800 text-xs">{booking.event.category}</Badge>
                          )}
                          {booking.tier_name && (
                            <Badge variant="pill" className="mt-1 ml-1.5 bg-indigo-100 text-indigo-800 text-xs">Tier: {booking.tier_name}</Badge>
                          )}
                        </div>

                        <div className="flex items-start gap-2">
                          <User className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs text-slate-400 font-medium">Ticket Holder</p>
                            <p className="text-sm font-bold text-slate-900">{cName} {cAge ? `· ${cAge} yrs` : ''}</p>
                          </div>
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
                      </div>

                      {/* QR Code */}
                      <div className="flex flex-col items-center justify-center border-l border-dashed border-slate-200 pl-6">
                        <div className="w-28 h-28 bg-slate-900 rounded-2xl flex items-center justify-center mb-3 relative overflow-hidden">
                          {/* Stylized QR pattern */}
                          <div className="grid grid-cols-7 gap-0.5 p-2">
                            {Array.from({ length: 49 }).map((_, i) => {
                              const seed = bRef.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
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
                        {perChildTotal !== '—' && (
                          <p className="text-xs font-bold text-slate-700 mt-1">₹{perChildTotal} paid</p>
                        )}
                      </div>
                    </div>

                    {/* Dashed divider */}
                    <div className="border-t-2 border-dashed border-slate-200 -mx-8 mb-6 relative">
                      <div className="absolute -left-3 -top-3 w-6 h-6 bg-slate-100 rounded-full border border-slate-200" />
                      <div className="absolute -right-3 -top-3 w-6 h-6 bg-slate-100 rounded-full border border-slate-200" />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Ticket className="w-4 h-4" />
                      <span>Valid only for {cName} on the event date. Non-transferable.</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 font-semibold" onClick={handleDownload}>
            <Download className="w-5 h-5 mr-2" /> Download Ticket{bookings.length > 1 ? 's' : ''}
          </Button>

          {eventObj && (
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 sm:flex-none h-14 border-purple-200 text-purple-700 hover:bg-purple-50 font-semibold"
                onClick={() => {
                  const title = eventObj.title;
                  const dateStr = eventObj.event_date;
                  const timeStr = eventObj.event_time;
                  const location = eventObj.location || 'Online';
                  const description = `Kidspire Admission Pass. Children: ${childrenNames}. Ref: ${primaryBooking?.booking_reference || ''}`;
                  
                  const dateObj = dateStr ? new Date(dateStr) : new Date();
                  const yyyy = dateObj.getUTCFullYear();
                  const mm = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
                  const dd = String(dateObj.getUTCDate()).padStart(2, '0');
                  const startStamp = `${yyyy}${mm}${dd}T090000Z`;
                  const endStamp = `${yyyy}${mm}${dd}T110000Z`;
                  const nowStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

                  const icsContent = [
                    'BEGIN:VCALENDAR',
                    'VERSION:2.0',
                    'PRODID:-//Kidspire Events//EN',
                    'CALSCALE:GREGORIAN',
                    'METHOD:PUBLISH',
                    'BEGIN:VEVENT',
                    `UID:kidspire-${Date.now()}@kidspire.com`,
                    `DTSTAMP:${nowStamp}`,
                    `DTSTART:${startStamp}`,
                    `DTEND:${endStamp}`,
                    `SUMMARY:${title.replace(/,/g, '\\,')}`,
                    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
                    `LOCATION:${location.replace(/,/g, '\\,')}`,
                    'STATUS:CONFIRMED',
                    'END:VEVENT',
                    'END:VCALENDAR'
                  ].join('\r\n');

                  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
                  const link = document.createElement('a');
                  link.href = window.URL.createObjectURL(blob);
                  link.setAttribute('download', `${title.replace(/[^a-zA-Z0-9]/g, '_')}_event.ics`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <Calendar className="w-5 h-5 mr-2 text-purple-600" /> Download .ics
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="flex-1 sm:flex-none h-14 border-purple-200 text-purple-700 hover:bg-purple-50 font-semibold"
                onClick={() => {
                  const title = encodeURIComponent(eventObj.title);
                  const details = encodeURIComponent(`Kidspire Booking Ref: ${primaryBooking?.booking_reference}. Children: ${childrenNames}`);
                  const loc = encodeURIComponent(eventObj.location || 'Online');
                  const dateObj = new Date(eventObj.event_date);
                  const yyyy = dateObj.getFullYear();
                  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
                  const dd = String(dateObj.getDate()).padStart(2, '0');
                  const dates = `${yyyy}${mm}${dd}T090000Z/${yyyy}${mm}${dd}T110000Z`;
                  window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${loc}`, '_blank');
                }}
              >
                Google Cal ↗
              </Button>
            </div>
          )}
          <Button size="lg" className="w-full sm:w-auto h-14 font-semibold bg-purple-600 hover:bg-purple-700" asChild>
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
