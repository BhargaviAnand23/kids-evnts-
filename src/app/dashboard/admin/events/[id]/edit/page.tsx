"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { dbService } from '@/services/db';
import { authService } from '@/services/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, Loader2, ShieldAlert, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import type { AgeBracket, Event } from '@/types';

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [orgId, setOrgId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Football',
    age_bracket: 'kids',
    event_date: '',
    event_time: '',
    location: '',
    price: 0,
    seats_total: 10,
    image_url: '',
  });

  useEffect(() => {
    const init = async () => {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser || currentUser.role !== 'admin' || !currentUser.organization_id) {
        setUnauthorized(true);
        setAuthLoading(false);
        return;
      }
      setOrgId(currentUser.organization_id);

      const event = await dbService.getEventById(eventId);
      if (!event) {
        setNotFound(true);
        setAuthLoading(false);
        return;
      }

      // Verify this event belongs to the logged-in organizer
      if (event.organizer_id !== currentUser.organization_id) {
        setUnauthorized(true);
        setAuthLoading(false);
        return;
      }

      setFormData({
        title: event.title,
        description: event.description || '',
        category: event.category,
        age_bracket: event.age_bracket,
        event_date: event.event_date,
        event_time: event.event_time.substring(0, 5), // HH:MM
        location: event.location,
        price: event.price,
        seats_total: event.seats_total,
        image_url: event.image_url || '',
      });
      setAuthLoading(false);
    };
    init();
  }, [eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setLoading(true);
    try {
      await dbService.updateEvent(eventId, {
        ...formData,
        age_bracket: formData.age_bracket as AgeBracket,
        // Re-submit for review if we edit a rejected event
        status: 'pending_review',
      });
      setSaved(true);
      setTimeout(() => router.push('/dashboard/admin'), 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to save changes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  if (authLoading) {
    return <div className="bg-slate-50 min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 text-purple-600 animate-spin" /></div>;
  }

  if (unauthorized) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <ShieldAlert className="w-14 h-14 text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
          <p className="text-slate-500 mb-6">You can only edit events that belong to your organization.</p>
          <Button asChild><Link href="/dashboard/admin">Back to Dashboard</Link></Button>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Event Not Found</h1>
          <p className="text-slate-500 mb-6">This event doesn't exist or has been deleted.</p>
          <Button asChild><Link href="/dashboard/admin">Back to Dashboard</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-6 md:px-16 lg:px-24">
        <Link href="/dashboard/admin" className="inline-flex items-center text-slate-500 hover:text-purple-600 text-sm font-medium mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">Edit Event</CardTitle>
            <p className="text-sm text-slate-500">Changes will re-submit the event for admin review before going live.</p>
          </CardHeader>
          <CardContent>
            {saved && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm mb-6">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> Changes saved! Redirecting to dashboard…
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">
                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-slate-700">Event Title</label>
                <Input id="title" name="title" required value={formData.title} onChange={handleChange} placeholder="e.g. Summer Soccer Camp" />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-slate-700">Description</label>
                <textarea id="description" name="description" required value={formData.description} onChange={handleChange} rows={4}
                  className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium text-slate-700">Category</label>
                  <select id="category" name="category" value={formData.category} onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500">
                    <option value="Football">Football</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Dance">Dance</option>
                    <option value="Swimming">Swimming</option>
                    <option value="Chess">Chess</option>
                    <option value="Arts & Crafts">Arts &amp; Crafts</option>
                    <option value="Music">Music</option>
                    <option value="Martial Arts">Martial Arts</option>
                    <option value="STEM & Tech">STEM &amp; Tech</option>
                    <option value="Cycling">Cycling</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="age_bracket" className="text-sm font-medium text-slate-700">Age Bracket</label>
                  <select id="age_bracket" name="age_bracket" value={formData.age_bracket} onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500">
                    <option value="early_kids">Early Kids (0–5)</option>
                    <option value="kids">Kids (6–12)</option>
                    <option value="teens">Teens (13–17)</option>
                    <option value="young_adults">Young Adults (18+)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="event_date" className="text-sm font-medium text-slate-700">Date</label>
                  <Input id="event_date" name="event_date" type="date" required value={formData.event_date} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="event_time" className="text-sm font-medium text-slate-700">Time</label>
                  <Input id="event_time" name="event_time" type="time" required value={formData.event_time} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="price" className="text-sm font-medium text-slate-700">Price (₹)</label>
                  <Input id="price" name="price" type="number" required value={formData.price} onChange={handleChange} min={0} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="seats_total" className="text-sm font-medium text-slate-700">Total Seats</label>
                  <Input id="seats_total" name="seats_total" type="number" required value={formData.seats_total} onChange={handleChange} min={1} />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium text-slate-700">Location / Venue</label>
                <Input id="location" name="location" required value={formData.location} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label htmlFor="image_url" className="text-sm font-medium text-slate-700">Event Image URL</label>
                <Input id="image_url" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://..." />
              </div>
              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</> : 'Save Changes'}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard/admin">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
