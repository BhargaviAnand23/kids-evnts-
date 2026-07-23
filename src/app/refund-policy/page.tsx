import React from 'react';

export default function RefundPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14 md:py-16 px-6 md:px-16 lg:px-24">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full inline-block mb-3">
          Parent Guarantee
        </span>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 md:mb-8">Refund Policy</h1>
        
        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-base space-y-6">
          <p className="text-base text-slate-700">
            We understand that family schedules can change unexpectedly. Kidspire offers a fair, transparent refund and cancellation policy for all activity bookings.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 pt-4 border-t border-slate-100">1. Parent Cancellations</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>48+ Hours Before Session:</strong> Cancel up to 48 hours before the event start time for a 100% full refund credited to your original payment method.</li>
            <li><strong>Within 24-48 Hours:</strong> Cancellations made between 24 to 48 hours prior to start time receive a 70% refund or full credit pass for a future session.</li>
            <li><strong>Under 24 Hours:</strong> Cancellations within 24 hours of session start are non-refundable, as organizers reserve venue slots and staff based on final headcount.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-100">2. Organizer Cancellations & Rescheduling</h2>
          <p>
            If an activity session is cancelled or postponed due to adverse weather, facility maintenance, or organizer emergency:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You will be notified immediately via SMS and Email.</li>
            <li>You will receive an automatic 100% full refund with zero processing fees.</li>
            <li>If a waitlist parent is next in line, available seats are automatically offered to the waitlist queue.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-100">3. How Refunds Are Processed</h2>
          <p>
            Approved refunds are initiated automatically by our system and process back to your card, bank, or UPI wallet within 3 to 5 business days. For assistance, contact <span className="text-purple-600 font-semibold">refunds@kidspire.com</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
