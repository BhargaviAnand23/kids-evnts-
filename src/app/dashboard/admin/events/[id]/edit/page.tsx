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

    // Type-specific fields
    listing_type: 'event',
    registration_deadline: '',
    prize_details: '',
    eligibility_rules: '',
    session_count: '',
    session_frequency: 'Weekly',
    course_duration_weeks: '',
    curriculum_outline: '',
    is_online: false,
    join_link: ''
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

      // Format registration_deadline to YYYY-MM-DDTHH:MM for datetime-local
      let deadlineStr = '';
      if (event.registration_deadline) {
        const d = new Date(event.registration_deadline);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        deadlineStr = `${year}-${month}-${day}T${hours}:${minutes}`;
      }

      setFormData({
        title: event.title,
        description: event.description || '',
        category: event.category,
        age_bracket: event.age_bracket,
        event_date: event.event_date,
        event_time: event.event_time.substring(0, 5), // HH:MM
        location: event.location || '',
        price: event.price,
        seats_total: event.seats_total,
        image_url: event.image_url || '',

        listing_type: event.listing_type || 'event',
        registration_deadline: deadlineStr,
        prize_details: event.prize_details || '',
        eligibility_rules: event.eligibility_rules || '',
        session_count: event.session_count !== null && event.session_count !== undefined ? String(event.session_count) : '',
        session_frequency: event.session_frequency || 'Weekly',
        course_duration_weeks: event.course_duration_weeks !== null && event.course_duration_weeks !== undefined ? String(event.course_duration_weeks) : '',
        curriculum_outline: event.curriculum_outline || '',
        is_online: event.is_online || false,
        join_link: event.join_link || ''
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

    const isWebinar = formData.listing_type === 'webinar';
    const isCompetition = formData.listing_type === 'competition';
    const isCourse = formData.listing_type === 'course';

    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      age_bracket: formData.age_bracket as AgeBracket,
      event_date: formData.event_date,
      event_time: formData.event_time,
      location: isWebinar ? 'Online Webinar' : (formData.location || 'Venue TBD'),
      price: formData.price,
      seats_total: isWebinar ? 1000 : Number(formData.seats_total),
      seats_available: isWebinar ? 1000 : Number(formData.seats_total),
      image_url: formData.image_url || null,

      listing_type: formData.listing_type as any,
      is_online: isWebinar,

      // Competitions
      registration_deadline: isCompetition && formData.registration_deadline ? new Date(formData.registration_deadline).toISOString() : null,
      prize_details: isCompetition ? formData.prize_details : null,
      eligibility_rules: isCompetition ? formData.eligibility_rules : null,

      // Courses
      session_count: isCourse && formData.session_count ? Number(formData.session_count) : null,
      session_frequency: isCourse ? formData.session_frequency : null,
      course_duration_weeks: isCourse && formData.course_duration_weeks ? Number(formData.course_duration_weeks) : null,
      curriculum_outline: isCourse ? formData.curriculum_outline : null,

      // Webinars
      join_link: isWebinar ? formData.join_link : null,

      // Re-submit for review if we edit
      status: 'pending_review' as const,
    };

    try {
      await dbService.updateEvent(eventId, payload);
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
            <CardTitle className="text-2xl md:text-3xl">Edit Listing</CardTitle>
            <p className="text-sm text-slate-500">Changes will re-submit the listing for admin review before going live.</p>
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

              {/* What are you listing? */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 block">What are you listing?</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { val: 'event', label: 'Event', desc: 'Workshops, camps, day events', icon: '🎉' },
                    { val: 'competition', label: 'Competition', desc: 'Tournaments, sports meets', icon: '🏆' },
                    { val: 'course', label: 'Course', desc: 'Weekly classes, masterclasses', icon: '📚' },
                    { val: 'webinar', label: 'Webinar', desc: 'Online talks, virtual lessons', icon: '💻' },
                  ].map((type) => {
                    const isSelected = formData.listing_type === type.val;
                    return (
                      <button
                        key={type.val}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, listing_type: type.val }))}
                        className={`flex flex-col items-center justify-between p-4 rounded-2xl border-2 text-center transition-all duration-200 h-full ${
                          isSelected
                            ? 'border-purple-600 bg-purple-50/50 shadow-md shadow-purple-500/5'
                            : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="text-2xl mb-1">{type.icon}</div>
                        <div className={`font-bold text-sm ${isSelected ? 'text-purple-700' : 'text-slate-900'}`}>{type.label}</div>
                        <div className="text-[10px] text-slate-400 mt-1 leading-tight">{type.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-slate-700">Listing Title</label>
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
                    <option value="early_years">Early Years (3–5)</option>
                    <option value="kids">Kids (6–12)</option>
                    <option value="teens">Teens (13–18)</option>
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
              </div>

              {/* Event Specific: Location and Seats */}
              {formData.listing_type === 'event' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                  <div className="space-y-2">
                    <label htmlFor="location" className="text-sm font-medium text-slate-700">Location / Venue</label>
                    <Input id="location" name="location" required value={formData.location} onChange={handleChange} placeholder="e.g. Greenwood Sports Complex, Chennai" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="seats_total" className="text-sm font-medium text-slate-700">Total Seats</label>
                    <Input id="seats_total" name="seats_total" type="number" required value={formData.seats_total} onChange={handleChange} min={1} />
                  </div>
                </div>
              )}

              {/* Competition Specific */}
              {formData.listing_type === 'competition' && (
                <div className="space-y-4 border-t border-slate-100 pt-4">
                  <h4 className="font-bold text-sm text-purple-700">Competition Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="registration_deadline" className="text-sm font-medium text-slate-700">Registration Deadline</label>
                      <Input id="registration_deadline" name="registration_deadline" type="datetime-local" required value={formData.registration_deadline} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="seats_total" className="text-sm font-medium text-slate-700">Total Seats (Optional limit)</label>
                      <Input id="seats_total" name="seats_total" type="number" value={formData.seats_total} onChange={handleChange} min={1} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="location" className="text-sm font-medium text-slate-700">Venue Location</label>
                    <Input id="location" name="location" required value={formData.location} onChange={handleChange} placeholder="e.g. Greenwood Sports Complex, Chennai" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="prize_details" className="text-sm font-medium text-slate-700">Prize Details</label>
                    <textarea id="prize_details" name="prize_details" required value={formData.prize_details} onChange={handleChange} rows={2}
                      className="flex min-h-[60px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                      placeholder="e.g. ₹5000 cash prize for winner, medals for top 3" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="eligibility_rules" className="text-sm font-medium text-slate-700">Eligibility & Rules</label>
                    <textarea id="eligibility_rules" name="eligibility_rules" required value={formData.eligibility_rules} onChange={handleChange} rows={3}
                      className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                      placeholder="Enter rules, age limits, qualifications..." />
                  </div>
                </div>
              )}

              {/* Course Specific */}
              {formData.listing_type === 'course' && (
                <div className="space-y-4 border-t border-slate-100 pt-4">
                  <h4 className="font-bold text-sm text-purple-700">Course Schedule & Curriculum</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="session_count" className="text-sm font-medium text-slate-700">Session Count</label>
                      <Input id="session_count" name="session_count" type="number" required value={formData.session_count} onChange={handleChange} min={1} placeholder="e.g. 8" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="session_frequency" className="text-sm font-medium text-slate-700">Frequency</label>
                      <select id="session_frequency" name="session_frequency" value={formData.session_frequency} onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500">
                        <option value="Weekly">Weekly</option>
                        <option value="Bi-weekly">Bi-weekly</option>
                        <option value="Daily">Daily</option>
                        <option value="Twice a week">Twice a week</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="course_duration_weeks" className="text-sm font-medium text-slate-700">Duration (Weeks)</label>
                      <Input id="course_duration_weeks" name="course_duration_weeks" type="number" required value={formData.course_duration_weeks} onChange={handleChange} min={1} placeholder="e.g. 8" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-medium text-slate-700">Classroom Location</label>
                      <Input id="location" name="location" required value={formData.location} onChange={handleChange} placeholder="e.g. Classroom 3A, Greenwood Academy" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="seats_total" className="text-sm font-medium text-slate-700">Batch Capacity (Seats)</label>
                      <Input id="seats_total" name="seats_total" type="number" required value={formData.seats_total} onChange={handleChange} min={1} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="curriculum_outline" className="text-sm font-medium text-slate-700">Curriculum Outline</label>
                    <textarea id="curriculum_outline" name="curriculum_outline" required value={formData.curriculum_outline} onChange={handleChange} rows={4}
                      className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                      placeholder="Outline what kids will learn in each session..." />
                  </div>
                </div>
              )}

              {/* Webinar Specific */}
              {formData.listing_type === 'webinar' && (
                <div className="space-y-4 border-t border-slate-100 pt-4">
                  <h4 className="font-bold text-sm text-purple-700">Webinar Details</h4>
                  <div className="space-y-2">
                    <label htmlFor="join_link" className="text-sm font-medium text-slate-700">Join Link (Zoom / Meet / Live Link)</label>
                    <Input id="join_link" name="join_link" type="url" required value={formData.join_link} onChange={handleChange} placeholder="https://zoom.us/j/..." />
                  </div>
                </div>
              )}

              <div className="space-y-2 border-t border-slate-100 pt-4">
                <label htmlFor="image_url" className="text-sm font-medium text-slate-700">Listing Image URL</label>
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
