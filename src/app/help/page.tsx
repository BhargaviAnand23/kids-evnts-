'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, ChevronUp, Ticket, Calendar, CreditCard, User, Shield, Building2, HelpCircle, Mail } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'booking',
    icon: Ticket,
    label: 'Booking & Tickets',
    color: 'bg-purple-100 text-purple-600',
    faqs: [
      {
        q: 'How do I book an event for my child?',
        a: `Booking is simple: browse events on the Explore page, click on an event you like, then click "Book Now". 
        You'll choose which child the booking is for, confirm details, and pay securely. 
        You'll receive a confirmation email with a digital ticket that you can show at the venue.`
      },
      {
        q: 'Can I book for multiple children in one go?',
        a: 'Currently each booking is for one child. To register multiple children, complete separate bookings for each child. All bookings will appear in your dashboard.'
      },
      {
        q: 'What if the event is sold out?',
        a: 'If an event is sold out, you can join the waitlist. You\'ll be notified instantly via SMS and email if a seat opens up. Head to the event page and click "Join Waitlist".'
      },
      {
        q: 'How do I view or download my ticket?',
        a: 'Your digital ticket is available in your Parent Dashboard under "My Bookings". Click "View Ticket" on any booking to see it. You can also download a printable PDF version from the same screen.'
      },
      {
        q: 'Can I transfer my booking to another child?',
        a: 'Bookings are linked to a specific child profile. Please contact our support team at support@kidspire.com if you need to modify a booking.'
      },
    ]
  },
  {
    id: 'payments',
    icon: CreditCard,
    label: 'Payments & Refunds',
    color: 'bg-green-100 text-green-600',
    faqs: [
      {
        q: 'What payment methods are accepted?',
        a: 'We accept all major UPI apps (GPay, PhonePe, Paytm), Credit/Debit cards (Visa, Mastercard, Rupay), and Net Banking. All transactions are secured with 256-bit SSL encryption.'
      },
      {
        q: 'How do I get a refund?',
        a: 'Cancellations made 48+ hours before the event receive a full refund. Cancellations within 48 hours are subject to a 20% cancellation fee. To request a cancellation, go to My Dashboard → My Bookings → Cancel. Refunds are processed within 5-7 business days.'
      },
      {
        q: 'Why was there an extra platform fee?',
        a: 'Kidspire charges a small platform fee (₹50 per booking) to maintain the platform, ensure safety verification of organizers, and provide customer support. GST at 18% is applied on top of the platform fee as required by law.'
      },
      {
        q: 'Is my payment information stored securely?',
        a: 'Yes. Kidspire does not store any card or bank details. All payment processing is handled by our PCI-DSS compliant payment partners. We only receive a booking confirmation once payment is successful.'
      },
    ]
  },
  {
    id: 'events',
    icon: Calendar,
    label: 'Events & Activities',
    color: 'bg-orange-100 text-orange-600',
    faqs: [
      {
        q: 'How are events verified on Kidspire?',
        a: 'Every event on Kidspire goes through a two-step review process: first, all event details are checked by our admin team for completeness and accuracy. Second, the hosting organization must be verified by Kidspire before any event can be published. This ensures parents can book with confidence.'
      },
      {
        q: 'What age groups are events available for?',
        a: 'Events are categorized into four age brackets: Early Kids (0–5 years), Kids (6–12 years), Teens (13–17 years), and Young Adults (18+). Use the age filter on the Explore page to find events suitable for your child.'
      },
      {
        q: 'What happens if an event is cancelled by the organizer?',
        a: 'If an event is cancelled by the organizer, all registered families will be notified immediately via email and SMS. A full refund will be automatically processed within 3-5 business days with no cancellation fee.'
      },
      {
        q: 'Can I leave a review after an event?',
        a: 'Yes! After attending an event, you\'ll receive an email inviting you to leave a review. Reviews help other parents make informed decisions and help organizers improve. Go to My Dashboard → Past Bookings → Leave Review.'
      },
    ]
  },
  {
    id: 'account',
    icon: User,
    label: 'Account & Profile',
    color: 'bg-blue-100 text-blue-600',
    faqs: [
      {
        q: 'How do I add or update my child\'s profile?',
        a: 'Go to Dashboard → Profile & Kids. You can add a new child by clicking "Add Child" and entering their name, age, school, and emergency contact. You can also update existing profiles from the same page.'
      },
      {
        q: 'I forgot my password. How do I reset it?',
        a: 'Go to the Login page and click "Forgot password?". Enter your email address and we\'ll send you a reset link within a few minutes. The link is valid for 1 hour. Check your spam folder if you don\'t see the email.'
      },
      {
        q: 'How do I update my email or phone number?',
        a: 'Phone number updates are available in Dashboard → Settings → Profile. Email address changes require contacting our support team at support@kidspire.com as this is tied to your account authentication.'
      },
      {
        q: 'How do I delete my account?',
        a: 'You can request account deletion from Dashboard → Settings → Account Actions → Delete Account. Note that deleting your account will cancel any upcoming bookings and is irreversible. Pending refunds will still be processed.'
      },
    ]
  },
  {
    id: 'safety',
    icon: Shield,
    label: 'Safety & Trust',
    color: 'bg-red-100 text-red-600',
    faqs: [
      {
        q: 'How does Kidspire ensure the safety of children?',
        a: 'Safety is our top priority. All event organizers must submit verified documentation including identity proof, venue safety certifications, and coach/instructor credentials. We also require organizers to maintain liability insurance. Parents can view an organizer\'s verification status on every event page.'
      },
      {
        q: 'What should I do if I notice something unsafe at an event?',
        a: 'Report any safety concerns immediately to our 24/7 safety line at +91 98765 00001 or email safety@kidspire.com. In an emergency, always contact local emergency services first (112). We take every report seriously and will investigate promptly.'
      },
      {
        q: 'Are coaches and instructors background-checked?',
        a: 'Yes. All verified organizers are required to ensure that coaches and instructors working with children have undergone background verification. Kidspire\'s verification badge on an organizer profile confirms this requirement has been met.'
      },
    ]
  },
  {
    id: 'organizers',
    icon: Building2,
    label: 'For Organizers',
    color: 'bg-yellow-100 text-yellow-600',
    faqs: [
      {
        q: 'How do I list my events on Kidspire?',
        a: 'Sign up for an organizer account from the Sign Up page (select "Organizer"). Enter your organization details and we\'ll review your application within 2-3 business days. Once verified, you can create and publish events through your Partner Dashboard.'
      },
      {
        q: 'What does the verification process involve?',
        a: 'Verification requires: (1) organization registration proof, (2) venue safety certificates for in-person events, (3) instructor/coach credentials, (4) liability insurance proof. Our team will guide you through the process over email.'
      },
      {
        q: 'How are payouts handled?',
        a: 'Organizers receive their revenue (ticket price × seats sold, minus Kidspire\'s platform fee) within 3-5 business days after the event concludes. Payouts are made directly to the registered bank account via NEFT/RTGS.'
      },
      {
        q: 'Can I edit an event after it\'s been published?',
        a: 'Yes. You can edit event details from your Partner Dashboard → Your Events → Edit. Note that significant edits (like date, venue, or price changes) will re-submit the event for admin review, and registered families will be notified of any changes.'
      },
    ]
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border-b border-slate-100 last:border-0 transition-colors ${open ? 'bg-purple-50/50' : ''}`}>
      <button
        className="w-full text-left flex items-center justify-between p-5 gap-4"
        onClick={() => setOpen(v => !v)}
      >
        <span className="font-semibold text-slate-900 text-sm md:text-base">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-purple-600 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed whitespace-pre-line">
          {a}
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredCategories = CATEGORIES.map(cat => ({
    ...cat,
    faqs: cat.faqs.filter(
      faq =>
        !search ||
        faq.q.toLowerCase().includes(search.toLowerCase()) ||
        faq.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => !search || cat.faqs.length > 0);

  const displayCategories = activeCategory
    ? filteredCategories.filter(c => c.id === activeCategory)
    : filteredCategories;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-700 text-white py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" /> Help Center
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-4">How can we help?</h1>
          <p className="text-purple-200 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            Find answers to common questions about booking, payments, safety, and more.
          </p>
          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search help articles…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-slate-900 text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-xl"
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-16 py-12 md:py-16">
        {/* Category filter pills */}
        {!search && (
          <div className="flex flex-wrap gap-3 mb-10">
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${!activeCategory ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-600 border-slate-200 hover:border-purple-300 hover:text-purple-600'}`}
            >
              All Topics
            </button>
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${activeCategory === cat.id ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-600 border-slate-200 hover:border-purple-300 hover:text-purple-600'}`}
                >
                  <Icon className="w-4 h-4" /> {cat.label}
                </button>
              );
            })}
          </div>
        )}

        {/* FAQ Sections */}
        <div className="space-y-8">
          {displayCategories.length === 0 ? (
            <div className="text-center py-16">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No results found for "{search}". Try a different search term.</p>
            </div>
          ) : (
            displayCategories.map(cat => {
              const Icon = cat.icon;
              return (
                <div key={cat.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-4 px-6 py-5 border-b border-slate-100">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">{cat.label}</h2>
                  </div>
                  <div>
                    {cat.faqs.map((faq, i) => (
                      <FAQItem key={i} q={faq.q} a={faq.a} />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Still need help? */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 md:p-10 text-white text-center">
          <Mail className="w-10 h-10 text-purple-200 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">Still need help?</h2>
          <p className="text-purple-200 mb-6 max-w-md mx-auto">
            Our support team is available Monday–Saturday, 9am–7pm IST.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center justify-center bg-white text-purple-700 font-bold px-6 py-3 rounded-xl hover:bg-purple-50 transition-colors">
              Contact Support
            </Link>
            <a href="mailto:support@kidspire.com" className="inline-flex items-center justify-center bg-purple-500/30 border border-purple-400 text-white font-bold px-6 py-3 rounded-xl hover:bg-purple-500/50 transition-colors">
              support@kidspire.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
