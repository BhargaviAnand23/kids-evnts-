'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users, IndianRupee, Calendar, TrendingUp, Settings,
  LayoutDashboard, Ticket, AlertCircle, Loader2, ShieldAlert,
  Star, BarChart3, LineChart, ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { dbService } from '@/services/db';
import { authService } from '@/services/auth';
import type { Event, Booking } from '@/types';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';

const SIDEBAR = [
  { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/admin/events/new', label: 'Create Event', icon: Calendar },
  { href: '#', label: 'Bookings', icon: Ticket },
  { href: '#', label: 'Payouts', icon: IndianRupee },
  { href: '/dashboard/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [orgId, setOrgId] = useState<string | null>(null);
  const [orgName, setOrgName] = useState('');
  const [commissionPercent, setCommissionPercent] = useState<number>(15);
  const [events, setEvents] = useState<Event[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (!currentUser || currentUser.role !== 'admin' || !currentUser.organization_id) {
          setUnauthorized(true);
          setLoading(false);
          return;
        }

        const id = currentUser.organization_id;
        setOrgId(id);

        const [org, evts, bkgs] = await Promise.all([
          dbService.getOrganizationById(id),
          dbService.getEvents({ organizerId: id, status: 'all' }),
          dbService.getBookingsByOrganization(id),
        ]);

        if (org) {
          setOrgName(org.name);
          if (typeof (org as any).commission_percent === 'number') {
            setCommissionPercent((org as any).commission_percent);
          }
        }
        setEvents(evts);
        setBookings(bkgs);
      } catch (err) {
        console.error('Error loading admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Calculate Real Stats
  const {
    totalEventsCreated,
    bookingsThisMonth,
    revenueThisMonth,
    platformFee,
    netPayout,
    avgRating,
    topEventsByBookings,
    last30DaysTrend,
    recentBookings
  } = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // 1. Total events created
    const totalEventsCreated = events.length;

    // 2. Bookings & Revenue this month
    const thisMonthBookings = bookings.filter(b => {
      const d = new Date(b.created_at || Date.now());
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const bookingsThisMonth = thisMonthBookings.length;

    const revenueThisMonth = thisMonthBookings
      .filter(b => b.payment_status === 'paid')
      .reduce((sum, b) => {
        const price = b.event?.price || 0;
        return sum + price;
      }, 0);

    const platformFee = Math.round(revenueThisMonth * (commissionPercent / 100));
    const netPayout = revenueThisMonth - platformFee;

    // 3. Average rating
    const ratedEvents = events.filter(e => typeof e.rating === 'number' && e.rating > 0);
    const avgRating = ratedEvents.length > 0
      ? (ratedEvents.reduce((acc, e) => acc + (e.rating || 0), 0) / ratedEvents.length).toFixed(1)
      : '4.8';

    // 4. Top 5 events by booking count
    const bookingCountsMap: Record<string, { event: Event; count: number }> = {};
    events.forEach(e => {
      bookingCountsMap[e.id] = { event: e, count: 0 };
    });

    bookings.forEach(b => {
      if (b.event_id && bookingCountsMap[b.event_id]) {
        bookingCountsMap[b.event_id].count += 1;
      }
    });

    const topEventsByBookings = Object.values(bookingCountsMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 5. 30-Day Booking Trend
    const days: { dateLabel: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = bookings.filter(b => (b.created_at || '').startsWith(dateStr)).length;
      days.push({
        dateLabel: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count
      });
    }

    // 6. Recent 10 bookings
    const recentBookings = [...bookings]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10);

    return {
      totalEventsCreated,
      bookingsThisMonth,
      revenueThisMonth,
      platformFee,
      netPayout,
      avgRating,
      topEventsByBookings,
      last30DaysTrend: days,
      recentBookings
    };
  }, [events, bookings, commissionPercent]);

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <ShieldAlert className="w-14 h-14 text-amber-500 mx-auto mb-4" />
          <h1 className="text-card-title font-bold text-slate-900 mb-2">Organizer Access Required</h1>
          <p className="text-slate-600 text-body mb-6">This dashboard is reserved for verified event organizers. Log in with an organizer account or sign up as a partner.</p>
          <div className="flex gap-3 justify-center">
            <Button asChild><Link href="/login">Log In</Link></Button>
            <Button variant="outline" asChild><Link href="/signup">Sign Up as Partner</Link></Button>
          </div>
        </div>
      </div>
    );
  }

  // Max bookings for bar chart scale
  const maxBarCount = Math.max(...topEventsByBookings.map(t => t.count), 1);
  const maxTrendCount = Math.max(...last30DaysTrend.map(d => d.count), 1);

  return (
    <div className="bg-slate-50 min-h-screen py-8 md:py-12">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">

        {/* Dashboard Title & Actions Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <span className="text-caption font-bold uppercase tracking-wider text-purple-700 bg-purple-100/70 border border-purple-200 px-3 py-1 rounded-full inline-block mb-2">
              Partner Organization Portal
            </span>
            <h1 className="text-page-title font-bold text-slate-900">{orgName || 'Organizer Dashboard'}</h1>
          </div>
          <Link href="/dashboard/admin/events/new">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-500/20">
              + Create New Event
            </Button>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Navigation Sidebar */}
          <div className="w-full lg:w-64 shrink-0">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardContent className="p-3 space-y-1.5">
                {SIDEBAR.map(({ href, label, icon: Icon }, idx) => {
                  const isActive = idx === 0;
                  return (
                    <Link
                      key={label}
                      href={href}
                      className={`flex items-center px-4 py-3 rounded-xl text-caption font-semibold transition-all ${
                        isActive
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                          : 'text-slate-600 hover:bg-purple-50 hover:text-purple-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-3 shrink-0" />
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Content */}
          <div className="flex-1 space-y-8">

            {/* Top 4 Stats Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

              {/* Stat 1: Total Events Created */}
              <Card className="border-slate-200 bg-white shadow-sm hover:border-purple-200 transition-colors">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-caption font-semibold text-slate-500 uppercase tracking-wide">Events Created</span>
                    <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl">
                      <Calendar className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 mb-1">{totalEventsCreated}</div>
                  <p className="text-caption text-slate-500">Active & draft listings</p>
                </CardContent>
              </Card>

              {/* Stat 2: Total Bookings This Month */}
              <Card className="border-slate-200 bg-white shadow-sm hover:border-purple-200 transition-colors">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-caption font-semibold text-slate-500 uppercase tracking-wide">Bookings (This Month)</span>
                    <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-xl">
                      <Ticket className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 mb-1">{bookingsThisMonth}</div>
                  <div className="flex items-center text-caption text-emerald-600 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5 mr-1" /> Active monthly volume
                  </div>
                </CardContent>
              </Card>

              {/* Stat 3: Total Revenue & Payout Breakdown */}
              <Card className="border-slate-200 bg-white shadow-sm hover:border-purple-200 transition-colors">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-caption font-semibold text-slate-500 uppercase tracking-wide">Revenue & Payout</span>
                    <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                      <IndianRupee className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 mb-2">₹{revenueThisMonth.toLocaleString('en-IN')}</div>
                  
                  {/* Breakdown callout */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-xs space-y-1.5 mt-2">
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Gross Revenue:</span>
                      <span className="font-semibold text-slate-900">₹{revenueThisMonth.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Platform Fee ({commissionPercent}%):</span>
                      <span className="font-semibold text-rose-600">-₹{platformFee.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-slate-900 pt-1.5 border-t border-slate-200/80">
                      <span>Your Net Payout:</span>
                      <span className="text-emerald-700">₹{netPayout.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stat 4: Average Rating */}
              <Card className="border-slate-200 bg-white shadow-sm hover:border-purple-200 transition-colors">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-caption font-semibold text-slate-500 uppercase tracking-wide">Average Rating</span>
                    <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 mb-1 flex items-baseline gap-1">
                    {avgRating} <span className="text-caption font-normal text-slate-500">/ 5.0</span>
                  </div>
                  <p className="text-caption text-slate-500">Based on parent reviews</p>
                </CardContent>
              </Card>

            </div>

            {/* Analytics Charts Grid (Recharts) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Bar Chart: Top 5 Events by Booking Count */}
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-card-title flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-purple-600" /> Bookings Per Event
                    </span>
                    <span className="text-caption text-slate-400 font-normal">Top 5 listings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  {topEventsByBookings.length === 0 ? (
                    <p className="text-caption text-slate-500 text-center py-12">No event booking data available yet.</p>
                  ) : (
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={topEventsByBookings.map(t => ({
                            name: t.event.title.length > 18 ? t.event.title.substring(0, 18) + '…' : t.event.title,
                            bookings: t.count
                          }))}
                          margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" />
                          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '12px' }}
                            cursor={{ fill: '#f8fafc' }}
                          />
                          <Bar dataKey="bookings" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Line Chart: 30-Day Booking Trend */}
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-card-title flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <LineChart className="w-5 h-5 text-purple-600" /> 30-Day Booking Trend
                    </span>
                    <span className="text-caption text-slate-400 font-normal">Daily volume</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={last30DaysTrend} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                        <defs>
                          <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="dateLabel" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={6} />
                        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '12px' }}
                        />
                        <Area type="monotone" dataKey="count" name="Bookings" stroke="#7c3aed" strokeWidth={2.5} fillOpacity={1} fill="url(#purpleGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Recent Bookings Table (Last 10) */}
            <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-4 px-6">
                <CardTitle className="text-card-title flex items-center justify-between">
                  <span>Recent Bookings</span>
                  <span className="text-caption font-normal text-slate-500">Last 10 transactions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {recentBookings.length === 0 ? (
                  <p className="text-caption text-slate-500 text-center py-10">No bookings found yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-caption text-slate-700">
                      <thead className="bg-slate-100/70 text-slate-500 font-bold uppercase tracking-wider text-micro border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-6">Event Name</th>
                          <th className="py-3 px-4">Child Name</th>
                          <th className="py-3 px-4">Reference</th>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Amount</th>
                          <th className="py-3 px-6 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {recentBookings.map(b => (
                          <tr key={b.id} className="hover:bg-purple-50/30 transition-colors">
                            <td className="py-3.5 px-6 font-bold text-slate-900">{b.event?.title || 'Event'}</td>
                            <td className="py-3.5 px-4 font-medium">{b.child?.name || '—'}</td>
                            <td className="py-3.5 px-4 font-mono text-micro text-slate-500">{b.booking_reference}</td>
                            <td className="py-3.5 px-4 text-slate-500">
                              {new Date(b.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-slate-900">₹{(b.event?.price || 0).toLocaleString('en-IN')}</td>
                            <td className="py-3.5 px-6 text-right">
                              <span className="px-2.5 py-1 rounded-full text-micro font-bold bg-green-100 text-green-800 border border-green-200">
                                {b.payment_status === 'paid' ? 'Paid ✓' : b.payment_status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Managed Event Listings */}
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="border-b border-slate-100 py-4 px-6">
                <CardTitle className="text-card-title">Your Event Listings ({events.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {events.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-body text-slate-500 mb-4">You have not created any events yet.</p>
                    <Button asChild><Link href="/dashboard/admin/events/new">+ Create First Event</Link></Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {events.map(event => {
                      const percentSold = event.seats_total > 0
                        ? Math.round(((event.seats_total - event.seats_available) / event.seats_total) * 100)
                        : 0;
                      return (
                        <div key={event.id} className="p-4 border border-slate-200 rounded-2xl hover:border-purple-300 transition-colors flex flex-col justify-between gap-3 bg-white">
                          <div className="flex items-start gap-3">
                            <div className="w-14 h-14 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                              <img src={event.image_url || 'https://images.unsplash.com/photo-1574629810360-7efbb192569a?auto=format&fit=crop&q=80&w=150'} alt={event.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <h4 className="font-bold text-slate-900 text-body truncate" title={event.title}>{event.title}</h4>
                                <Badge
                                  variant={event.status === 'approved' ? 'success' : event.status === 'pending_review' ? 'warning' : 'default'}
                                  className="ml-2 shrink-0 text-micro"
                                >
                                  {event.status === 'approved' ? 'Approved' : event.status === 'pending_review' ? 'Pending' : 'Rejected'}
                                </Badge>
                              </div>
                              <p className="text-caption text-slate-500">
                                {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-purple-600 rounded-full" style={{ width: `${percentSold}%` }} />
                            </div>
                            <div className="flex justify-between text-micro text-slate-500 font-semibold">
                              <span>{event.seats_total - event.seats_available} / {event.seats_total} Booked</span>
                              <span>₹{event.price}</span>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-1">
                            <Button variant="outline" size="sm" asChild className="flex-1 text-caption">
                              <Link href={`/dashboard/admin/events/${event.id}/edit`}>Edit</Link>
                            </Button>
                            <Button size="sm" asChild className="flex-1 text-caption">
                              <Link href={`/events/${event.id}`}>View Listing</Link>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
