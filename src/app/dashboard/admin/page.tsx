'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users, IndianRupee, Calendar, TrendingUp, Settings,
  LayoutDashboard, Ticket, AlertCircle, Loader2, ShieldAlert
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { dbService } from '@/services/db';
import { authService } from '@/services/auth';
import type { Event, Booking } from '@/types';

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
  const [events, setEvents] = useState<Event[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const load = async () => {
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

      if (org) setOrgName(org.name);
      setEvents(evts);
      setBookings(bkgs);
      setLoading(false);
    };
    load();
  }, []);

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
        <div className="text-center max-w-md">
          <ShieldAlert className="w-14 h-14 text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Organizer Access Required</h1>
          <p className="text-slate-500 mb-6">This dashboard is for verified event organizers. Sign in with an organizer account or sign up as a partner.</p>
          <div className="flex gap-3 justify-center">
            <Button asChild><Link href="/login">Log In</Link></Button>
            <Button variant="outline" asChild><Link href="/signup">Sign Up as Organizer</Link></Button>
          </div>
        </div>
      </div>
    );
  }

  const activeEventsCount = events.filter(e => e.status === 'approved').length;
  const totalRevenue = bookings.filter(b => b.payment_status === 'paid').reduce((sum, b) => sum + (b.event?.price || 0), 0);

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Partner Dashboard</h1>
            {orgName && <p className="text-slate-500 mt-1">{orgName}</p>}
          </div>
          <Link href="/dashboard/admin/events/new">
            <Button>+ Create New Event</Button>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <div className="w-full lg:w-64 shrink-0">
            <Card>
              <CardContent className="p-4 space-y-2">
                {SIDEBAR.map(({ href, label, icon: Icon }) => (
                  <Link key={label} href={href}
                    className="flex items-center px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-purple-600 rounded-xl transition-colors first:bg-purple-50 first:text-purple-700"
                  >
                    <Icon className="w-5 h-5 mr-3" /> {label}
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">Total Revenue</p>
                      <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">₹{totalRevenue.toLocaleString('en-IN')}</h3>
                    </div>
                    <div className="p-3 bg-green-100 text-green-600 rounded-xl"><IndianRupee className="w-6 h-6" /></div>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" /> From confirmed bookings
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">Total Bookings</p>
                      <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">{bookings.length}</h3>
                    </div>
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><Ticket className="w-6 h-6" /></div>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" /> Across all your events
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">Active Events</p>
                      <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">{activeEventsCount}</h3>
                    </div>
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-xl"><Calendar className="w-6 h-6" /></div>
                  </div>
                  <div className="mt-4 text-sm text-slate-500">Currently published</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Bookings & Your Events */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              <Card>
                <CardHeader><CardTitle>Recent Bookings</CardTitle></CardHeader>
                <CardContent>
                  {bookings.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-8">No bookings yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {bookings.slice(0, 5).map(b => (
                        <div key={b.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-xl hover:bg-slate-50">
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">{b.event?.title || 'Unknown event'}</p>
                            <p className="text-xs text-slate-500">Ref: {b.booking_reference}</p>
                            {b.child && <p className="text-xs text-slate-400">Child: {b.child.name}</p>}
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-slate-900 text-sm">₹{b.event?.price?.toLocaleString('en-IN') || 0}</p>
                            <Badge variant="success" className="mt-1 bg-green-50 text-green-700 text-xs">
                              {b.payment_status === 'paid' ? 'Paid' : b.payment_status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Your Events</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.map(event => {
                      const percentSold = event.seats_total > 0
                        ? Math.round(((event.seats_total - event.seats_available) / event.seats_total) * 100)
                        : 0;
                      return (
                        <div key={event.id} className="flex flex-col p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors gap-3">
                          <div className="flex items-start">
                            <div className="w-14 h-14 bg-slate-200 rounded-lg mr-3 overflow-hidden shrink-0">
                              <img src={event.image_url || 'https://images.unsplash.com/photo-1574629810360-7efbb192569a?auto=format&fit=crop&q=80&w=150'} alt={event.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <p className="font-semibold text-slate-900 text-sm truncate">{event.title}</p>
                                <Badge
                                  variant={event.status === 'approved' ? 'success' : event.status === 'pending_review' ? 'warning' : 'default'}
                                  className={`ml-2 shrink-0 text-xs ${event.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}`}
                                >
                                  {event.status === 'approved' ? 'Approved' : event.status === 'pending_review' ? 'Pending' : 'Rejected'}
                                </Badge>
                              </div>
                              <p className="text-xs text-slate-500 mb-2">
                                {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${percentSold}%` }} />
                              </div>
                              <p className="text-[10px] text-slate-400 mt-1 text-right">{event.seats_total - event.seats_available}/{event.seats_total} Sold</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild className="flex-1">
                              <Link href={`/dashboard/admin/events/${event.id}/edit`}>Edit</Link>
                            </Button>
                            <Button size="sm" asChild className="flex-1">
                              <Link href={`/events/${event.id}`}>View</Link>
                            </Button>
                          </div>
                          {event.status === 'rejected' && event.rejection_reason && (
                            <div className="flex items-start bg-red-50 text-red-700 p-2 rounded-md text-xs">
                              <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                              <p><strong>Reason:</strong> {event.rejection_reason}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {events.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-sm text-slate-500 mb-4">No events yet. Create your first event!</p>
                        <Button asChild><Link href="/dashboard/admin/events/new">+ Create Event</Link></Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
