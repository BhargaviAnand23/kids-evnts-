import React from 'react';

export default function TermsPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14 md:py-16 px-6 md:px-16 lg:px-24">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full inline-block mb-3">
          Effective Date: July 2026
        </span>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 md:mb-8">Terms of Service</h1>
        
        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-base space-y-6">
          <p className="text-base text-slate-700">
            Welcome to Kidspire. By accessing or using our platform to search, list, or book youth activities, you agree to comply with these Terms of Service.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 pt-4 border-t border-slate-100">1. User Account & Eligibility</h2>
          <p>
            Bookings must be conducted by an adult parent, legal guardian, or authorized representative aged 18 or older. Parents are responsible for providing accurate child age information and emergency contact details.
          </p>

          <h2 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-100">2. Activity Bookings & Passes</h2>
          <p>
            Each confirmed booking generates a unique Kidspire digital pass. Passes are non-transferable without prior notice to the organizer. Parents must ensure children arrive promptly for scheduled sessions with appropriate gear as specified by the organizer.
          </p>

          <h2 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-100">3. Partner & Organizer Responsibilities</h2>
          <p>
            Activity organizers (academies, schools, studios, coaches) warrant that all events submitted for moderation:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Comply with local safety regulations, instructor background verifications, and medical first-aid readiness.</li>
            <li>Maintain accurate seat availability and honor all confirmed Kidspire bookings.</li>
            <li>Accurately represent event dates, age brackets, pricing, and location details.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-100">4. Moderation & Event Approval</h2>
          <p>
            Kidspire reserves the right to review, reject, or unpublish any event listing that fails safety checks or violates community standards. Events submitted by organization admins require Super Admin approval prior to public listing.
          </p>
        </div>
      </div>
    </div>
  );
}
