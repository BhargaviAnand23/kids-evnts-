import React from 'react';

export default function SafetyPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14 md:py-16 px-6 md:px-16 lg:px-24">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full inline-block mb-3">
          Child Safety & Protection
        </span>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 md:mb-8">Safety Policy</h1>
        
        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-base space-y-6">
          <p className="text-base text-slate-700">
            At Kidspire, child safety is our absolute non-negotiable priority. We mandate strict safety standards for all academies, sports clubs, and coaches listed on our platform.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 pt-4 border-t border-slate-100">1. Partner Verification Standards</h2>
          <p>
            Before any event is approved and published on Kidspire, our Super Admin team verifies:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Instructor Background Verifications:</strong> Proof of background checks and identity verification for lead coaches and instructors.</li>
            <li><strong>Accreditation & Certification:</strong> Verified athletic or artistic coaching certifications from recognized bodies.</li>
            <li><strong>Facility Safety Inspections:</strong> Venues must meet local fire, sanitation, structural, and emergency access compliance standards.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-100">2. Emergency Preparedness & Supervision</h2>
          <p>
            All listed events must maintain adequate coach-to-student ratios based on age brackets:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Early Years (3-5 yrs):</strong> Maximum 1 instructor per 5 children. Parent/guardian presence required for water and high-energy sessions.</li>
            <li><strong>Kids & Teens (6-18 yrs):</strong> Maximum 1 instructor per 10 participants. Certified First-Aid kit and trained personnel present on-site.</li>
            <li>Emergency contact phone numbers are made accessible on the digital check-in roster for immediate contact if needed.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-100">3. Reporting Safety Concerns</h2>
          <p>
            If you observe any unsafe facility conditions or unprofessional conduct during an event booked via Kidspire, report it immediately to <span className="text-purple-600 font-semibold">safety@kidspire.com</span> or call our helpline <span className="text-slate-900 font-semibold">+91 (044) 4800-5900</span>. We investigate all reports within 4 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
