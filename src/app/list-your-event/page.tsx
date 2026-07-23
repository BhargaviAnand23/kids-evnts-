'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Mail, 
  LayoutDashboard, 
  CheckCircle2, 
  Send, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Building2,
  FileText,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';

export default function ListYourEventPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    organizerName: '',
    contactName: '',
    email: '',
    phone: '',
    eventTitle: '',
    category: 'Sports',
    ageBracket: 'kids',
    date: '',
    time: '',
    location: '',
    price: '',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct pre-filled mailto URL
    const subject = encodeURIComponent(`Event Submission: ${formData.eventTitle || 'New Activity'}`);
    const body = encodeURIComponent(
      `ORGANIZER DETAILS:\n` +
      `Organization Name: ${formData.organizerName}\n` +
      `Contact Person: ${formData.contactName}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phone}\n\n` +
      `EVENT DETAILS:\n` +
      `Event Title: ${formData.eventTitle}\n` +
      `Category: ${formData.category}\n` +
      `Target Age Group: ${formData.ageBracket}\n` +
      `Date & Time: ${formData.date} at ${formData.time}\n` +
      `Location: ${formData.location}\n` +
      `Ticket Price: ₹${formData.price}\n\n` +
      `DESCRIPTION:\n${formData.description}`
    );

    window.location.href = `mailto:partner@kidspire.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14 md:py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-4 border border-purple-100">
            <Sparkles className="w-3.5 h-3.5" /> For Activity Organizers & Coaches
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            List Your Activity on Kidspire
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Reach thousands of local parents actively looking for sports camps, arts classes, music lessons, and youth events. Choose the submission method that works best for you.
          </p>
        </div>

        {/* Two Clear Options Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* Path 1: Dashboard Flow */}
          <Card className="border-2 border-purple-200/80 bg-white hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden flex flex-col justify-between">
            <CardContent className="p-8 sm:p-10 flex flex-col h-full">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6 shrink-0">
                <LayoutDashboard className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full w-fit mb-3">
                Recommended for Power Users
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Option 1: Partner Dashboard</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Create a free organizer account to list activities anytime, track attendee registrations, manage ticket sales, and view analytics in real time.
              </p>
              
              <ul className="space-y-3 text-slate-700 text-sm mb-8">
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 mr-3 shrink-0" />
                  <span>Instant self-service event listing form</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 mr-3 shrink-0" />
                  <span>Real-time seat tracking and attendee roster</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 mr-3 shrink-0" />
                  <span>Manage multiple coaches & locations</span>
                </li>
              </ul>

              <div className="mt-auto space-y-3 pt-4 border-t border-slate-100">
                <Button size="lg" className="w-full" asChild>
                  <Link href="/signup">Sign Up as Partner</Link>
                </Button>
                <Link 
                  href="/dashboard/admin/events/new" 
                  className="block text-center text-xs font-semibold text-purple-600 hover:underline pt-1"
                >
                  Already have an account? Create Event in Dashboard &rarr;
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Path 2: Email Submission Flow */}
          <Card className="border border-slate-200/80 bg-white hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden flex flex-col justify-between">
            <CardContent className="p-8 sm:p-10 flex flex-col h-full">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6 shrink-0">
                <Mail className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full w-fit mb-3">
                Simple & Hands-Free
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Option 2: Email Us Your Event Details</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Prefer not to use a dashboard? Fill out the quick details below or email us at <strong className="text-slate-900">partner@kidspire.com</strong>. Our support team will create and list your event for you.
              </p>

              <ul className="space-y-3 text-slate-700 text-sm mb-8">
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 mr-3 shrink-0" />
                  <span>No account or login required</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 mr-3 shrink-0" />
                  <span>Manual review and formatting by Kidspire team</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 mr-3 shrink-0" />
                  <span>Live on platform within 24 hours</span>
                </li>
              </ul>

              <a 
                href="#email-form" 
                className="mt-auto block w-full text-center py-3.5 px-6 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-800 transition-all text-sm"
              >
                Fill Quick Email Form Below &darr;
              </a>
            </CardContent>
          </Card>

        </div>

        {/* Email Submission Form Container */}
        <div id="email-form" className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200">
          <div className="mb-8 border-b border-slate-100 pb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Mail className="w-6 h-6 text-purple-600" /> Direct Email Submission Form
            </h2>
            <p className="text-slate-600 text-sm">
              Fill out your activity details below. Clicking send will open your email client pre-populated with your event information sent directly to <strong className="text-purple-600">partner@kidspire.com</strong>.
            </p>
          </div>

          {submitted && (
            <div className="mb-8 p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Email Draft Created!</h4>
                <p className="text-xs text-green-700">Your email client has opened with your event details pre-filled. Please click send in your email client to deliver it to partner@kidspire.com!</p>
              </div>
            </div>
          )}

          <form onSubmit={handleEmailSubmit} className="space-y-6">
            
            {/* Organizer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-400" /> Organization / Academy Name
                </label>
                <Input 
                  name="organizerName" 
                  required 
                  placeholder="e.g. Metro Youth Sports Club"
                  value={formData.organizerName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-400" /> Contact Person Name
                </label>
                <Input 
                  name="contactName" 
                  required 
                  placeholder="e.g. Coach Sarah Jenkins"
                  value={formData.contactName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-slate-400" /> Contact Email
                </label>
                <Input 
                  type="email"
                  name="email" 
                  required 
                  placeholder="coach@metroyouth.org"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-slate-400" /> Phone Number
                </label>
                <Input 
                  name="phone" 
                  required 
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Event Info */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="font-bold text-base text-slate-900 mb-4">Event & Activity Info</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Event Title</label>
                  <Input 
                    name="eventTitle" 
                    required 
                    placeholder="e.g. Junior Football Weekend Training"
                    value={formData.eventTitle}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Football">Football</option>
                      <option value="Basketball">Basketball</option>
                      <option value="Dance">Dance</option>
                      <option value="Swimming">Swimming</option>
                      <option value="Chess">Chess</option>
                      <option value="Arts & Crafts">Arts & Crafts</option>
                      <option value="Music">Music</option>
                      <option value="Martial Arts">Martial Arts</option>
                      <option value="Cycling">Cycling</option>
                      <option value="STEM">STEM & Robotics</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Target Age Group</label>
                    <select
                      name="ageBracket"
                      value={formData.ageBracket}
                      onChange={handleChange}
                      className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="early_years">Early Years (3-5 yrs)</option>
                      <option value="kids">Kids (6-12 yrs)</option>
                      <option value="teens">Teens (13-18 yrs)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-slate-400" /> Proposed Ticket Price (₹)
                    </label>
                    <Input 
                      type="number"
                      name="price" 
                      required 
                      placeholder="e.g. 500"
                      value={formData.price}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-slate-400" /> Proposed Date
                    </label>
                    <Input 
                      type="date"
                      name="date" 
                      required 
                      value={formData.date}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Time</label>
                    <Input 
                      type="time"
                      name="time" 
                      required 
                      value={formData.time}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-slate-400" /> Location / Address
                    </label>
                    <Input 
                      name="location" 
                      required 
                      placeholder="e.g. Greenwood Sports Complex, Chennai"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                    <FileText className="w-4 h-4 text-slate-400" /> Activity Description & Highlights
                  </label>
                  <textarea 
                    name="description" 
                    required 
                    rows={4}
                    placeholder="Provide details about what children will learn, equipment needed, and session structure..."
                    value={formData.description}
                    onChange={handleChange}
                    className="flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full flex items-center justify-center gap-2">
              <Send className="w-5 h-5" /> Send Event Details via Email
            </Button>
            <p className="text-center text-xs text-slate-500">
              Or email us directly with attachments at <a href="mailto:partner@kidspire.com" className="text-purple-600 font-semibold hover:underline">partner@kidspire.com</a>
            </p>
          </form>
        </div>

      </div>
    </div>
  );
}
