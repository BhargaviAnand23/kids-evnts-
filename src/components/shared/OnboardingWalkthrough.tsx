'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Search,
  Trophy,
  Ticket,
  Users,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const STORAGE_KEY = 'kidspire_has_seen_onboarding';

interface Step {
  id: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
}

const STEPS: Step[] = [
  {
    id: 1,
    icon: Sparkles,
    iconBg: 'bg-purple-600/10',
    iconColor: 'text-purple-600',
    badge: 'Welcome to Kidspire',
    title: 'Play · Explore · Shine',
    subtitle: 'Discover Top Kids Activities Near You',
    description: "Welcome to Kidspire! We help parents find, compare, and book verified sports, arts, STEM, and extracurricular activities for children.",
    highlights: [
      '⚽ Football, Swimming, Dance, Music & Coding',
      '🎟️ Instant Digital QR Tickets & Seats',
      '🛡️ 100% Verified Organizers & Safe Venues',
    ],
  },
  {
    id: 2,
    icon: Search,
    iconBg: 'bg-blue-600/10',
    iconColor: 'text-blue-600',
    badge: 'Step 2: Smart Search',
    title: 'Search & Browse Effortlessly',
    subtitle: 'Find Activities in Your City',
    description: "Use the top search bar to find classes by keyword, filter by your city (Bengaluru, Mumbai, Delhi, etc.), or filter by format like Single-day Events, Competitions, or Multi-week Courses.",
    highlights: [
      '📍 Location-based city filtering',
      '📅 Single-day events & multi-week courses',
      '💻 Online webinars & in-person workshops',
    ],
  },
  {
    id: 3,
    icon: Trophy,
    iconBg: 'bg-amber-600/10',
    iconColor: 'text-amber-600',
    badge: 'Step 3: Curated Hubs',
    title: 'Sports & Talents Hubs',
    subtitle: 'Tailored Category Exploration',
    description: "Jump straight into dedicated hubs for Sports (Football, Swimming, Martial Arts) or Talents & Hobbies (Chess, Art, Music, Robotics, Drama).",
    highlights: [
      '🏆 Sports Hub: Tournaments & coaching',
      '🎨 Talents Hub: Creative workshops & hobbies',
      '🚀 1-click quick category filters',
    ],
  },
  {
    id: 4,
    icon: Ticket,
    iconBg: 'bg-emerald-600/10',
    iconColor: 'text-emerald-600',
    badge: 'Step 4: Seamless Booking',
    title: 'Instant Booking & QR Tickets',
    subtitle: 'Hassle-Free Family Calendar',
    description: "Book seats in seconds with real-time seat availability protection. Receive digital QR tickets instantly on your phone and track all bookings in your Parent Dashboard.",
    highlights: [
      '🔒 Real-time atomic seat reservation',
      '📱 Instant mobile QR entry pass',
      '📄 Automated PDF invoices & reminders',
    ],
  },
  {
    id: 5,
    icon: Users,
    iconBg: 'bg-purple-600/10',
    iconColor: 'text-purple-600',
    badge: 'Step 5: Age Targeting',
    title: 'Targeted Age Brackets',
    subtitle: 'Perfect Fit for Every Stage',
    description: "Filter activities tailored specifically to your child's age bracket—from toddlers (0–3 yrs), young kids (4–8 yrs), pre-teens (9–12 yrs), to teenagers (13–17 yrs).",
    highlights: [
      '👶 Early Childhood (0–3 & 4–8 yrs)',
      '🎒 Pre-Teens & Youth (9–12 & 13–17 yrs)',
      '✨ Personalized parent recommendations',
    ],
  },
];

export function OnboardingWalkthrough() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    // Check if user has already seen or dismissed onboarding
    const hasSeen = localStorage.getItem(STORAGE_KEY);
    if (!hasSeen) {
      // Auto-trigger after 1.2s delay for smooth first page render
      const timer = setTimeout(() => setIsOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Expose global trigger so Footer/Help links can replay tour on demand
    const handleReplay = () => {
      setCurrentStepIndex(0);
      setIsOpen(true);
    };

    (window as any).openKidspireOnboardingTour = handleReplay;
    window.addEventListener('replay_onboarding_tour', handleReplay);

    return () => {
      window.removeEventListener('replay_onboarding_tour', handleReplay);
    };
  }, []);

  const handleDismiss = (completed = false) => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsOpen(false);
  };

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleDismiss(true);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  if (!isOpen) return null;

  const currentStep = STEPS[currentStepIndex];
  const IconComponent = currentStep.icon;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => handleDismiss(false)}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 my-auto"
        >
          {/* Top Decorative Header */}
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 p-6 text-white relative">
            <button
              onClick={() => handleDismiss(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Close walkthrough"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                {currentStep.badge}
              </span>
              <span className="text-purple-200 text-xs font-medium ml-auto">
                {currentStepIndex + 1} of {STEPS.length}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {currentStep.title}
            </h3>
            <p className="text-purple-100 text-xs sm:text-sm font-medium mt-0.5 opacity-90">
              {currentStep.subtitle}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-white/20 h-1.5 rounded-full mt-4 overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Step Icon & Description */}
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl ${currentStep.iconBg} ${currentStep.iconColor} flex items-center justify-center shrink-0`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-slate-700 text-sm leading-relaxed">
                  {currentStep.description}
                </p>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Key Highlights
              </span>
              {currentStep.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>

            {/* Dots Indicator & Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              {/* Step Dots */}
              <div className="flex items-center gap-1.5">
                {STEPS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentStepIndex
                        ? 'w-6 bg-purple-600'
                        : 'w-2 bg-slate-200 hover:bg-slate-300'
                    }`}
                    aria-label={`Go to step ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {currentStepIndex > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBack}
                    className="rounded-full px-3 text-xs"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
                  </Button>
                )}

                {!isLastStep && (
                  <button
                    onClick={() => handleDismiss(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs font-semibold px-2 transition-colors"
                  >
                    Skip Tour
                  </button>
                )}

                <Button
                  size="sm"
                  onClick={handleNext}
                  className="rounded-full px-4 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20"
                >
                  {isLastStep ? (
                    <>
                      Get Started 🚀
                    </>
                  ) : (
                    <>
                      Next <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/**
 * Reusable helper button to re-trigger the onboarding tour manually from Footer or Help pages
 */
export function ReplayTourButton({ className = '', variant = 'text' }: { className?: string; variant?: 'text' | 'button' }) {
  const triggerTour = () => {
    if (typeof window !== 'undefined') {
      if ((window as any).openKidspireOnboardingTour) {
        (window as any).openKidspireOnboardingTour();
      } else {
        window.dispatchEvent(new CustomEvent('replay_onboarding_tour'));
      }
    }
  };

  if (variant === 'button') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={triggerTour}
        className={`rounded-full border-purple-200 text-purple-700 hover:bg-purple-50 ${className}`}
      >
        <Compass className="w-4 h-4 mr-2 text-purple-600" />
        Take Guided Tour
      </Button>
    );
  }

  return (
    <button
      onClick={triggerTour}
      className={`text-slate-400 hover:text-purple-600 text-sm font-medium transition-colors inline-flex items-center gap-1.5 ${className}`}
    >
      <Compass className="w-3.5 h-3.5" />
      Take a Tour
    </button>
  );
}
