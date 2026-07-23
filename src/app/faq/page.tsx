import React from 'react';
import Link from 'next/link';
import { HelpCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function FaqPage() {
  const faqs = [
    {
      q: 'How does Kidspire verify activity organizers and coaches?',
      a: 'Every school, academy, and independent coach registered on Kidspire undergoes a strict verification process. We verify business registration, safety credentials, background checks for instructors, and facility safety standards.'
    },
    {
      q: 'How do I complete a booking for my child?',
      a: 'Simply select an event or class from the Explore page, choose your child’s age bracket, enter emergency contact details, and proceed to checkout. You will immediately receive a digital confirmation pass in your dashboard and email.'
    },
    {
      q: 'What is the cancellation and refund policy?',
      a: 'Full refunds are guaranteed if you cancel up to 48 hours before the activity starts. If an organizer cancels or reschedules due to weather or unforeseen circumstances, you receive an automatic 100% refund.'
    },
    {
      q: 'What age groups are supported on Kidspire?',
      a: 'We support activities for Early Years (3-5), Kids (6-12), and Teens (13-18). Each listing clearly specifies the recommended age group.'
    },
    {
      q: 'Can I add multiple children to my parent account?',
      a: 'Yes! From your Parent Dashboard, you can register profiles for all your children, including their age and school, making future bookings quick and seamless.'
    },
    {
      q: 'What happens if a class is sold out?',
      a: 'If seats are full, you can join the Waitlist with one click. If another parent cancels, the next parent on the waitlist is automatically notified via SMS/email.'
    },
    {
      q: 'How do organization admins submit new events?',
      a: 'Verified partner admins log into their Partner Dashboard and fill out the Event Submission Form. New events enter "Pending Review" status and are reviewed by Kidspire super-admins within 24 hours before going live.'
    },
    {
      q: 'Are payments secure?',
      a: 'Absolutely. We use bank-grade 256-bit encrypted payment gateways (supporting Credit Cards, UPI, Net Banking, and digital wallets). Kidspire never stores raw credit card numbers.'
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14 md:py-16 px-6 md:px-16 lg:px-24">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full inline-block mb-3">
            Got Questions?
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-slate-600 text-base">
            Find quick answers to common questions about bookings, safety verification, payments, and cancellations.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-6 mb-12">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-colors">
              <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 flex items-start">
                <HelpCircle className="w-5 h-5 text-purple-600 mr-3 mt-0.5 shrink-0" />
                {faq.q}
              </h3>
              <p className="text-slate-600 text-base leading-relaxed pl-8">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="text-center bg-slate-900 text-white rounded-2xl p-8">
          <h3 className="text-xl font-bold mb-2">Still need help?</h3>
          <p className="text-slate-300 text-sm mb-6">Our dedicated parent support team is available Mon-Sat 9 AM to 6 PM IST.</p>
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700" asChild>
            <Link href="/contact">
              Contact Support <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}
