'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, ShieldCheck, Flag, Loader2, Sparkles, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { dbService } from '@/services/db';
import type { Achievement } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function HighlightsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportedIds, setReportedIds] = useState<Set<string>>(new Set());
  const [reportingId, setReportingId] = useState<string | null>(null);

  useEffect(() => {
    loadHighlights();
  }, []);

  const loadHighlights = async () => {
    try {
      const data = await dbService.getAchievements({ visibility: 'public_approved' });
      setAchievements(data);
    } catch (err) {
      console.error('Error loading highlights:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async (id: string) => {
    if (!confirm('Report this content to Kidspire safety moderators for review?')) return;
    setReportingId(id);
    try {
      await dbService.reportAchievement(id);
      setReportedIds(prev => new Set(Array.from(prev).concat(id)));
    } catch (err) {
      alert('Failed to report content. Please try again.');
    } finally {
      setReportingId(null);
    }
  };

  // Extract first name only for maximum privacy
  const getSafeFirstName = (fullName?: string) => {
    if (!fullName) return 'Young Achiever';
    return fullName.trim().split(' ')[0];
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 text-caption font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100/80 px-3.5 py-1.5 rounded-full mb-4 border border-purple-200">
            <Trophy className="w-4 h-4 text-purple-600" /> Celebrated Accomplishments
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Junior Achievements & Highlights 🌟
          </h1>
          <p className="text-slate-600 text-body leading-relaxed max-w-2xl mx-auto mb-6">
            Celebrating milestones, tournament victories, and creative accomplishments from verified Kidspire activities.
          </p>

          {/* Child Safety Callout */}
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-2xl text-caption font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Strict Privacy Active: Only verified first names & age brackets are shown with explicit guardian consent.</span>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-purple-600 animate-spin mb-4" />
            <p className="text-slate-500 font-semibold text-caption">Loading verified highlights...</p>
          </div>
        ) : achievements.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-xl mx-auto p-8">
            <Trophy className="w-14 h-14 text-purple-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No public highlights yet</h3>
            <p className="text-slate-500 text-body mb-6">Be the first to share an achievement! Log in to your parent dashboard to submit a accomplishment for moderation.</p>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link href="/dashboard/parent">Post Child Achievement</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map(item => {
              const firstName = getSafeFirstName(item.child?.name);
              const ageLabel = item.child?.age ? `Age ${item.child.age}` : 'Junior';
              const isReported = reportedIds.has(item.id);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-3xl overflow-hidden flex flex-col justify-between h-full">
                    <div>
                      {/* Media container */}
                      <div className="relative aspect-video bg-slate-900 overflow-hidden group">
                        {item.media_type === 'video' ? (
                          <video src={item.media_url} controls className="w-full h-full object-cover" />
                        ) : (
                          <img
                            src={item.media_url}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                        <div className="absolute top-3 left-3 bg-purple-900/80 backdrop-blur-md text-white text-micro font-bold px-3 py-1 rounded-full border border-purple-400/40">
                          {firstName} · {ageLabel}
                        </div>
                      </div>

                      {/* Content */}
                      <CardContent className="p-6">
                        <h3 className="font-bold text-slate-900 text-card-title mb-2 leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-slate-600 text-body leading-relaxed line-clamp-3 mb-4">
                          {item.description}
                        </p>
                      </CardContent>
                    </div>

                    {/* Footer / Safety Controls */}
                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between text-caption">
                      <span className="text-slate-400 text-micro">
                        Posted by Verified {item.posted_by_role === 'parent' ? 'Parent' : 'Academy'}
                      </span>

                      {isReported ? (
                        <span className="text-amber-600 font-bold flex items-center gap-1 text-micro bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Reported to Admin
                        </span>
                      ) : (
                        <button
                          onClick={() => handleReport(item.id)}
                          disabled={reportingId === item.id}
                          className="text-slate-400 hover:text-red-600 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Report inappropriate content to safety moderators"
                        >
                          <Flag className="w-3.5 h-3.5" />
                          <span>Report</span>
                        </button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
