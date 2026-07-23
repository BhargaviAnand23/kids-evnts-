'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

interface QuizOption {
  label: string;
  sublabel: string;
  icon: string;
  value: string;
}

interface Question {
  id: number;
  title: string;
  subtitle: string;
  options: QuizOption[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    title: "What is your child's current energy vibe?",
    subtitle: "Help us match an activity to their natural speed",
    options: [
      { label: 'Super Energetic', sublabel: 'Loves running, jumping, and physical action', icon: '⚡', value: 'high' },
      { label: 'Creative & Focused', sublabel: 'Enjoys arts, building, and deep concentration', icon: '🎨', value: 'creative' },
      { label: 'Curious Explorer', sublabel: 'Loves discovering new concepts and solving puzzles', icon: '💡', value: 'curious' },
    ],
  },
  {
    id: 2,
    title: 'Where do they enjoy spending time most?',
    subtitle: 'Choose their preferred environment',
    options: [
      { label: 'Outdoors & Sunshine', sublabel: 'Fresh air, fields, and open grounds', icon: '☀️', value: 'outdoor' },
      { label: 'Indoor Studio / Lab', sublabel: 'Air-conditioned studios, labs, or classrooms', icon: '🏛️', value: 'indoor' },
      { label: 'Anywhere Fun!', sublabel: 'Environment does not matter as long as it is exciting', icon: '🚀', value: 'any' },
    ],
  },
  {
    id: 3,
    title: 'How do they like interacting with others?',
    subtitle: 'Group dynamics matter for great experiences',
    options: [
      { label: 'Team & Group Sports', sublabel: 'Loves playing together and making teammates', icon: '🤝', value: 'team' },
      { label: 'Solo Mastery & 1-on-1', sublabel: 'Enjoys personal progress and focused mentoring', icon: '🎯', value: 'solo' },
      { label: 'Mix of Both', sublabel: 'Comfortable in small groups or solo activities', icon: '🌈', value: 'both' },
    ],
  },
];

interface Recommendation {
  title: string;
  categorySlug: string;
  description: string;
  tag: string;
  color: string;
}

function getRecommendations(answers: Record<number, string>): Recommendation[] {
  const q1 = answers[1];
  const q2 = answers[2];

  if (q1 === 'high') {
    if (q2 === 'outdoor') {
      return [
        { title: 'Kids Soccer Camp', categorySlug: 'football', description: 'Action-packed teamwork and field drills', tag: 'Top Sports Match', color: 'bg-green-100 text-green-800' },
        { title: 'Youth Basketball League', categorySlug: 'basketball', description: 'Dribbling, shooting, and team play', tag: 'High Energy', color: 'bg-orange-100 text-orange-800' },
        { title: 'Karate & Self Defense', categorySlug: 'martial-arts', description: 'Discipline, agility, and martial technique', tag: 'Agility & Focus', color: 'bg-red-100 text-red-800' },
      ];
    }
    return [
      { title: 'Hip Hop & Street Dance', categorySlug: 'dance', description: 'Rhythmic routines and energetic music', tag: 'High Energy', color: 'bg-pink-100 text-pink-800' },
      { title: 'Weekend Swim Lessons', categorySlug: 'swimming', description: 'Water confidence and stroke mastery', tag: 'Active & Fun', color: 'bg-blue-100 text-blue-800' },
      { title: 'Karate & Martial Arts', categorySlug: 'martial-arts', description: 'Focus, balance, and confidence', tag: 'Confidence Builder', color: 'bg-purple-100 text-purple-800' },
    ];
  }

  if (q1 === 'creative') {
    return [
      { title: 'Clay Modeling & Painting', categorySlug: 'arts', description: 'Hands-on sculpting, painting, and craft', tag: 'Artistic Express', color: 'bg-amber-100 text-amber-800' },
      { title: 'Beginner Music & Guitar', categorySlug: 'music', description: 'Chords, rhythm, and song creation', tag: 'Musical Skill', color: 'bg-purple-100 text-purple-800' },
      { title: 'Youth Drama & Theater', categorySlug: 'drama', description: 'Acting, storytelling, and stage confidence', tag: 'Creative Acting', color: 'bg-violet-100 text-violet-800' },
    ];
  }

  // curious or default
  return [
    { title: 'Science Experiment Day', categorySlug: 'stem', description: 'Volcanoes, slime, and rocket physics', tag: 'Hands-on Science', color: 'bg-cyan-100 text-cyan-800' },
    { title: 'Coding with Scratch', categorySlug: 'stem', description: 'Build games with visual block coding', tag: 'STEM & Logic', color: 'bg-blue-100 text-blue-800' },
    { title: 'Youth Chess Club', categorySlug: 'chess', description: 'Strategy, tactical thinking, and patience', tag: 'Mind & Logic', color: 'bg-slate-100 text-slate-800' },
  ];
}

export function ActivityQuiz() {
  const [currentStep, setCurrentStep] = useState(0); // 0 = start, 1..3 = questions, 4 = result
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleSelectOption = (questionId: number, value: string) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    if (questionId < 3) {
      setCurrentStep(questionId + 1);
    } else {
      setCurrentStep(4);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(1);
  };

  const activeQuestion = QUESTIONS[currentStep - 1];

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-purple-50/60 to-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Activity Finder Quiz
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Find Your Child's Ideal Activity in 30 Seconds
          </h2>
        </div>

        <Card className="border-purple-100 shadow-xl shadow-purple-900/5 bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden">
          <CardContent className="p-6 sm:p-10">

            {/* Step 0: Welcome State */}
            {currentStep === 0 && (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-5 text-3xl">
                  🎯
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                  Not sure what to book next?
                </h3>
                <p className="text-slate-600 max-w-md mx-auto mb-8 text-sm sm:text-base leading-relaxed">
                  Answer 3 quick questions about your child's personality and preferences, and we'll instantly recommend top matching activities!
                </p>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-purple-500/25 hover:scale-105 transition-all text-base inline-flex items-center gap-2 cursor-pointer"
                >
                  Start 30-Sec Quiz <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Steps 1..3: Questions */}
            {currentStep >= 1 && currentStep <= 3 && activeQuestion && (
              <div>
                {/* Progress bar */}
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
                  <span>Question {currentStep} of 3</span>
                  <span>{Math.round((currentStep / 3) * 100)}% Completed</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full mb-8 overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                  />
                </div>

                <div className="mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                    {activeQuestion.title}
                  </h3>
                  <p className="text-slate-500 text-sm">{activeQuestion.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {activeQuestion.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSelectOption(activeQuestion.id, opt.value)}
                      className="flex flex-col items-center text-center p-5 rounded-2xl border-2 border-slate-100 hover:border-purple-500 hover:bg-purple-50/50 transition-all cursor-pointer group"
                    >
                      <span className="text-3xl mb-3 group-hover:scale-110 transition-transform">{opt.icon}</span>
                      <span className="font-bold text-slate-900 text-sm mb-1 group-hover:text-purple-700">{opt.label}</span>
                      <span className="text-xs text-slate-500 leading-tight">{opt.sublabel}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Results */}
            {currentStep === 4 && (
              <div>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold mb-3">
                    <CheckCircle2 className="w-4 h-4" /> Recommended for your child
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    Here are your top activity matches!
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {getRecommendations(answers).map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between hover:shadow-md transition-shadow"
                    >
                      <div>
                        <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-3 ${rec.color}`}>
                          {rec.tag}
                        </span>
                        <h4 className="font-bold text-slate-900 text-base mb-1">{rec.title}</h4>
                        <p className="text-xs text-slate-500 mb-4">{rec.description}</p>
                      </div>
                      <Link
                        href={`/explore?category=${rec.categorySlug}`}
                        className="text-xs font-bold text-purple-600 hover:text-purple-800 inline-flex items-center gap-1 mt-auto"
                      >
                        Explore Events <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>

                <div className="text-center pt-2">
                  <button
                    onClick={handleReset}
                    className="text-xs text-slate-500 font-semibold hover:text-purple-600 inline-flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
                  </button>
                </div>
              </div>
            )}

          </CardContent>
        </Card>

      </div>
    </section>
  );
}
