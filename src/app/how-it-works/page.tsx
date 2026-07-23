import React from 'react';
import Link from 'next/link';
import { Search, CalendarCheck, Sparkles, Trophy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Discover & Filter Activities',
      icon: <Search className="w-8 h-8 text-purple-600" />,
      desc: 'Browse hundreds of sports camps, dance academies, swimming lessons, chess clubs, and art workshops. Filter by category, age group (0-5, 6-12, 13-17), location, or price.'
    },
    {
      num: '02',
      title: 'Book Seats Instantly',
      icon: <CalendarCheck className="w-8 h-8 text-indigo-600" />,
      desc: 'Select your child’s age, enter emergency contact info, and complete secure payment in seconds. Real-time inventory ensures you get instant seat confirmation.'
    },
    {
      num: '03',
      title: 'Receive Digital Pass',
      icon: <Sparkles className="w-8 h-8 text-orange-600" />,
      desc: 'Access your instant booking reference and digital ticket pass on your parent dashboard and email. Check venue directions, timing, and instructor instructions.'
    },
    {
      num: '04',
      title: 'Attend & Share Experience',
      icon: <Trophy className="w-8 h-8 text-emerald-600" />,
      desc: 'Show up at the venue for an awesome weekend session. After the class, leave verified ratings and reviews to help other parents in the community.'
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14 md:py-16 px-6 md:px-16 lg:px-24">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full inline-block mb-3">
            Simple 4-Step Process
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">How Kidspire Works</h1>
          <p className="text-slate-600 text-base">
            A seamless experience designed for busy parents to find, book, and enjoy youth activities in minutes.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="space-y-8 mb-12">
          {steps.map((step) => (
            <div key={step.num} className="flex flex-col sm:flex-row items-start gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-colors">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-slate-100">
                {step.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-bold font-mono text-purple-600 bg-purple-100 px-2 py-0.5 rounded">
                    STEP {step.num}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-slate-900">{step.title}</h3>
                </div>
                <p className="text-slate-600 text-base leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Teaser */}
        <div className="p-8 rounded-2xl bg-purple-600 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-1">Have questions about cancellations or safety?</h3>
            <p className="text-purple-100 text-base">Read our parent guide and verified organizer policies.</p>
          </div>
          <Button size="lg" className="bg-white text-purple-900 hover:bg-purple-50 shrink-0" asChild>
            <Link href="/faq">
              View FAQs <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}
