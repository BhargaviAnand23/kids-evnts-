import React from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ContactPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14 md:py-16 px-6 md:px-16 lg:px-24">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full inline-block mb-3">
            We're Here to Help
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Contact Us</h1>
          <p className="text-slate-600 text-base">
            Have questions about an activity booking, partner registration, or safety guidelines? Get in touch with our team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Details */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Get in Touch</h2>
            
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">Customer Support Email</h4>
                <p className="text-slate-600 text-sm">support@kidspire.com</p>
                <p className="text-slate-400 text-xs mt-0.5">Response within 24 hours</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">Helpline & Hotline</h4>
                <p className="text-slate-600 text-sm">+91 (044) 4800-5900</p>
                <p className="text-slate-400 text-xs mt-0.5">Mon - Sat: 9:00 AM - 6:00 PM IST</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">Headquarters</h4>
                <p className="text-slate-600 text-sm">Kidspire Technologies Pvt. Ltd.</p>
                <p className="text-slate-500 text-xs">Anna Salai, T. Nagar, Chennai, Tamil Nadu 600017</p>
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
            <form className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Your Name</label>
                <Input placeholder="Parent or Partner Name" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Email Address</label>
                <Input type="email" placeholder="name@example.com" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Subject</label>
                <Input placeholder="Booking query, partnership, feedback..." />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Message</label>
                <textarea 
                  rows={4} 
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  placeholder="Tell us how we can help..."
                ></textarea>
              </div>
              <Button type="submit" className="w-full">
                <Send className="w-4 h-4 mr-2" /> Send Message
              </Button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
