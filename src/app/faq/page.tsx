'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

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

  const [openIndexes, setOpenIndexes] = useState<number[]>([0, 1]);

  const toggleFaq = (idx: number) => {
    setOpenIndexes(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14 md:py-16 px-6 md:px-16 lg:px-24">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-caption font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full inline-block mb-3">
            Got Questions?
          </span>
          <h1 className="text-page-title font-bold text-slate-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-slate-600 text-body">
            Find quick answers to common questions about bookings, safety verification, payments, and cancellations.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4 mb-12">
          {faqs.map((faq, idx) => {
            const isOpen = openIndexes.includes(idx);
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen ? 'bg-purple-50/40 border-purple-200 shadow-sm' : 'bg-slate-50 border-slate-100 hover:border-purple-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <h3 className="text-card-title font-bold text-slate-900 flex items-center gap-3">
                    <HelpCircle className={`w-5 h-5 shrink-0 transition-colors ${isOpen ? 'text-purple-600' : 'text-slate-400'}`} />
                    <span>{faq.q}</span>
                  </h3>
                  <div className={`p-1.5 rounded-full bg-white border border-slate-200/80 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 bg-purple-100 border-purple-200' : ''}`}>
                    <ChevronDown className={`w-4 h-4 ${isOpen ? 'text-purple-700' : 'text-slate-500'}`} />
                  </div>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pb-5 sm:pb-6 px-5 sm:px-6">
                        <p className="text-slate-600 text-body leading-relaxed pl-8 pt-2 border-t border-purple-200/60">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Still Have Questions */}
        <div className="text-center bg-slate-900 text-white rounded-2xl p-8">
          <h3 className="text-card-title font-bold mb-2">Still need help?</h3>
          <p className="text-slate-300 text-caption mb-6">Our dedicated parent support team is available Mon-Sat 9 AM to 6 PM IST.</p>
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
