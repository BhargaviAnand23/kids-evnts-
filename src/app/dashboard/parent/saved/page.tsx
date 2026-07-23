'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Ticket, User, Settings, Calendar, MapPin, Trash2, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { authService } from '@/services/auth';
import { dbService } from '@/services/db';

const NAV_LINKS = [
  { href: '/dashboard/parent', label: 'My Bookings', icon: Ticket },
  { href: '/dashboard/parent/saved', label: 'Saved Events', icon: Heart },
  { href: '/dashboard/parent/profile', label: 'Profile & Kids', icon: User },
  { href: '/dashboard/parent/settings', label: 'Settings', icon: Settings },
];

export default function SavedEventsPage() {
  const pathname = usePathname();
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [parentId, setParentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) return;
      const profile = await dbService.getParentProfile(currentUser.id);
      if (!profile) return;
      setParentId(profile.id);
      const saved = await dbService.getSavedEvents(profile.id);
      setSavedItems(saved);
      setLoading(false);
    };
    load();
  }, []);

  const handleUnsave = async (eventId: string) => {
    if (!parentId) return;
    await dbService.unsaveEvent(parentId, eventId);
    setSavedItems(prev => prev.filter(s => s.event_id !== eventId));
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 sm:mb-8">My Dashboard</h1>
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
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Saved Events</h2>
            {loading ? (
              <Card><CardContent className="py-12 text-center text-slate-400">Loading saved events…</CardContent></Card>
            ) : savedItems.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <Heart className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="font-semibold text-slate-700 mb-2">No saved events yet</p>
                  <p className="text-slate-500 text-sm mb-6">Tap the heart icon on any event to save it for later.</p>
                  <Button asChild><Link href="/explore">Browse Activities</Link></Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedItems.map(item => {
                  const evt = item.event;
                  if (!evt) return null;
                  return (
                    <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="h-40 bg-slate-200">
                        <img
                          src={evt.image_url || 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&q=80&w=400'}
                          alt={evt.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-5">
                        <Badge variant="pill" className="bg-purple-100 text-purple-800 mb-2">{evt.category}</Badge>
                        <h3 className="font-bold text-slate-900 mb-3">{evt.title}</h3>
                        <div className="text-sm text-slate-500 space-y-1 mb-4">
                          <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" />{new Date(evt.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                          <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" />{evt.location}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" asChild className="flex-1">
                            <Link href={`/events/${evt.id}`}><ExternalLink className="w-4 h-4 mr-2" /> View</Link>
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50" onClick={() => handleUnsave(evt.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
