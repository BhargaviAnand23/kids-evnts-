import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14 md:py-16 px-6 md:px-16 lg:px-24">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full inline-block mb-3">
          Last Updated: July 2026
        </span>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 md:mb-8">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-base space-y-6">
          <p className="text-base text-slate-700">
            At Kidspire ("we", "our", "us"), we prioritize the privacy and safety of families, children, and activity partners. This Privacy Policy describes how we collect, use, and protect your information when you use our platform.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 pt-4 border-t border-slate-100">1. Information We Collect</h2>
          <p>
            We collect personal information necessary to facilitate youth activity bookings:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Parent/Guardian Information:</strong> Name, email address, phone number, and account login credentials.</li>
            <li><strong>Child Information:</strong> Child's first name, age/age bracket, emergency contact, and optional school affiliation. We do not collect or store government IDs for minors.</li>
            <li><strong>Transaction & Booking Details:</strong> Event selections, payment transaction IDs, and booking reference codes. Payments are processed securely via PCI-DSS compliant payment gateways.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-100">2. How We Use Your Information</h2>
          <p>
            Your data is used strictly for legitimate platform operations:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Processing event registrations and issuing digital admission passes.</li>
            <li>Sharing necessary attendee rosters (child name & emergency contact) with verified organizers for safety during sessions.</li>
            <li>Sending booking confirmations, waitlist slot notifications, and session updates via SMS/Email.</li>
            <li>Improving platform performance, preventing fraudulent activity, and ensuring child safety compliance.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-100">3. Child Data Protection Standards</h2>
          <p>
            Protecting children is fundamental to Kidspire. We strictly adhere to child privacy laws:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>We do not sell, trade, or rent child or family data to third-party advertisers.</li>
            <li>Child profiles are created solely under parent/guardian management accounts.</li>
            <li>Organizer access to attendee lists is strictly restricted to active confirmed bookings.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-100">4. Contact Privacy Team</h2>
          <p>
            If you have questions about your data rights or wish to request data deletion, contact our Privacy Officer at <span className="text-purple-600 font-semibold">privacy@kidspire.com</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
