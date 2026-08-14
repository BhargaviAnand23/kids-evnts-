'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { checkClientRateLimit } from '@/utils/rateLimiter';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // 1. Client-side rate limit check (5 submissions per hour)
    const rateCheck = checkClientRateLimit('contact_form', 5, 60 * 60 * 1000);
    if (!rateCheck.allowed) {
      setError(rateCheck.message || 'Too many submissions, please try again later.');
      return;
    }

    setSubmitting(true);
    try {
      // 2. Call server API endpoint (which also enforces IP-based rate limiting)
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 429 || !res.ok) {
        setError(data.error || 'Too many submissions, please try again later.');
        return;
      }

      setSuccess('Thank you! Your message has been sent successfully. We will get back to you within 24 hours.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err?.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14 md:py-16 px-6 md:px-16 lg:px-24">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-caption font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full inline-block mb-3">
            We're Here to Help
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-3 tracking-tight leading-tight">Contact Us</h1>
          <p className="text-slate-600 text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Have questions about an activity booking, partner registration, or safety guidelines? Get in touch with our team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Details */}
          <div className="space-y-6">
            <h2 className="text-section-title font-bold text-slate-900 mb-4">Get in Touch</h2>
            
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-caption">Customer Support Email</h4>
                <p className="text-slate-600 text-caption">support@kidspire.com</p>
                <p className="text-slate-400 text-micro mt-0.5">Response within 24 hours</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-caption">Helpline & Hotline</h4>
                <p className="text-slate-600 text-caption">+91 (044) 4800-5900</p>
                <p className="text-slate-400 text-micro mt-0.5">Mon - Sat: 9:00 AM - 6:00 PM IST</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-caption">Headquarters</h4>
                <p className="text-slate-600 text-caption">Kidspire Technologies Pvt. Ltd.</p>
                <p className="text-slate-500 text-micro">Anna Salai, T. Nagar, Chennai, Tamil Nadu 600017</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mt-6">
              <h4 className="font-bold text-slate-900 text-sm mb-1">Partner Inquiries?</h4>
              <p className="text-xs text-slate-600">
                Are you a sports school or academy looking to list activities? Email <span className="text-purple-600 font-semibold">partners@kidspire.com</span>.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Send Us a Message</h3>

            {error && (
              <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Your Name</label>
                <Input
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Parent or Partner Name"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Email Address</label>
                <Input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Subject</label>
                <Input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Booking query, partnership, feedback..."
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Message</label>
                <textarea 
                  name="message"
                  required
                  rows={4} 
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  placeholder="Tell us how we can help..."
                ></textarea>
              </div>
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
                ) : (
                  <><Send className="w-4 h-4 mr-2" /> Send Message</>
                )}
              </Button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
