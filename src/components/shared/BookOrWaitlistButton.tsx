'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, Loader2, CheckCircle2, UserRound, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { authService } from '@/services/auth';
import { dbService } from '@/services/db';
import type { Child } from '@/types';

interface Props {
  eventId: string;
  seatsAvailable: number;
  listingType?: string;
  joinLink?: string | null;
  selectedTierId?: string;
}

export function BookOrWaitlistButton({ eventId, seatsAvailable, listingType, joinLink, selectedTierId }: Props) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [parentId, setParentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (listingType === 'webinar') {
    return (
      <Button size="lg" className="w-full text-sm md:text-base h-12 md:h-14 bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20" asChild>
        <a href={joinLink || '#'} target="_blank" rel="noopener noreferrer">Join Online Webinar</a>
      </Button>
    );
  }

  if (seatsAvailable > 0) {
    const bookUrl = selectedTierId ? `/events/${eventId}/book?tierId=${selectedTierId}` : `/events/${eventId}/book`;
    return (
      <Button size="lg" className="w-full text-sm md:text-base h-12 md:h-14" asChild>
        <Link href={bookUrl}>Book Now</Link>
      </Button>
    );
  }

  const handleOpenModal = async () => {
    setError(null);
    setLoading(true);
    const user = await authService.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    const profile = await dbService.getParentProfile(user.id);
    if (!profile) {
      router.push('/login');
      return;
    }
    setParentId(profile.id);
    const kids = await dbService.getChildren(profile.id);
    setChildren(kids);
    if (kids.length > 0) setSelectedChildId(kids[0].id);
    setLoading(false);
    setShowModal(true);
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentId || !selectedChildId) return;
    setJoining(true);
    setError(null);
    try {
      await dbService.joinWaitlist(eventId, selectedChildId, parentId);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to join waitlist. You may already be on it.');
    } finally {
      setJoining(false);
    }
  };

  return (
    <>
      <Button
        size="lg"
        className="w-full text-sm md:text-base h-12 md:h-14 bg-amber-600 hover:bg-amber-700 text-white shadow-md"
        onClick={handleOpenModal}
      >
        <Bell className="w-5 h-5 mr-2" /> Sold Out — Join Waitlist
      </Button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>

            {success ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">You're on the Waitlist! 🎉</h3>
                <p className="text-sm text-slate-600 mb-6">
                  We've reserved your spot in line. If another parent cancels, you'll receive an instant notification in your dashboard and email.
                </p>
                <Button className="w-full" onClick={() => setShowModal(false)}>Close</Button>
              </div>
            ) : (
              <form onSubmit={handleJoin} className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center shrink-0">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Join Event Waitlist</h3>
                    <p className="text-xs text-slate-500">Get notified the moment a seat opens</p>
                  </div>
                </div>

                {loading ? (
                  <div className="py-8 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-600" /> Loading children profile...
                  </div>
                ) : children.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-slate-600 mb-4">Please add at least one child profile in your dashboard first.</p>
                    <Button asChild className="w-full"><Link href="/dashboard/parent/profile">Add Child Profile</Link></Button>
                  </div>
                ) : (
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Select Child</label>
                    <div className="space-y-2">
                      {children.map(child => (
                        <label
                          key={child.id}
                          className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                            selectedChildId === child.id ? 'border-amber-500 bg-amber-50/50 text-amber-900 font-semibold' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="waitlist_child"
                              value={child.id}
                              checked={selectedChildId === child.id}
                              onChange={() => setSelectedChildId(child.id)}
                              className="text-amber-600 focus:ring-amber-500"
                            />
                            <UserRound className="w-4 h-4 text-slate-400" />
                            <span className="text-sm">{child.name} ({child.age} yrs)</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-3 py-2 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                  </div>
                )}

                {children.length > 0 && (
                  <Button type="submit" className="w-full h-12 bg-amber-600 hover:bg-amber-700 text-white" disabled={joining}>
                    {joining ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Joining...</> : 'Confirm Waitlist Entry'}
                  </Button>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
