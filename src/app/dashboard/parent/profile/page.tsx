'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Heart, Ticket, User, Settings, Plus, Pencil, Trash2,
  Loader2, AlertCircle, CheckCircle2, Phone, BookOpen,
  MapPin, Calendar, Mail, ShieldCheck, Camera, Sparkles,
  Share2, Star, Bell, Gift, Check, Clock, ChevronRight,
  Award, SlidersHorizontal
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { authService } from '@/services/auth';
import { dbService } from '@/services/db';
import type { Parent, Child, School, Booking, Event } from '@/types';

const NAV_LINKS = [
  { href: '/dashboard/parent', label: 'My Bookings', icon: Ticket },
  { href: '/dashboard/parent/saved', label: 'Saved Events', icon: Heart },
  { href: '/dashboard/parent/profile', label: 'Profile & Kids', icon: User },
  { href: '/dashboard/parent/settings', label: 'Settings', icon: Settings },
];

const CATEGORY_OPTIONS = [
  'Sports', 'Arts & Crafts', 'Music', 'STEM & Tech', 'Dance', 'Swimming', 'Martial Arts', 'Chess'
];

const ageBracketLabel = (age: number) => {
  if (age <= 5) return 'Early Years (Ages 3–5)';
  if (age <= 12) return 'Kids (Ages 6–12)';
  return 'Teens (Ages 13–18)';
};

export default function ProfileKidsPage() {
  const pathname = usePathname();
  const [parent, setParent] = useState<Parent | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [savedCount, setSavedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Profile Edit State
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileCity, setProfileCity] = useState('Chennai');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Preferences State
  const [preferredCats, setPreferredCats] = useState<string[]>(['Sports', 'STEM & Tech', 'Arts & Crafts']);
  const [emailDigest, setEmailDigest] = useState(true);
  const [smsReminders, setSmsReminders] = useState(true);
  const [prefSaved, setPrefSaved] = useState(false);

  // Add Child State
  const [showAddChild, setShowAddChild] = useState(false);
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [childSchoolId, setChildSchoolId] = useState('');
  const [childEmergency, setChildEmergency] = useState('');
  const [childSaving, setChildSaving] = useState(false);
  const [childMsg, setChildMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Referral Copy State
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    const load = async () => {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) return;

      const profile = await dbService.getParentProfile(currentUser.id);
      if (!profile) return;

      setParent(profile);
      setProfileName(profile.name);
      setProfilePhone(profile.phone || '');

      // Load avatar & city from localStorage if saved
      const localAvatar = typeof window !== 'undefined' ? localStorage.getItem(`avatar_${profile.id}`) : null;
      if (localAvatar) setAvatarUrl(localAvatar);

      const localCity = typeof window !== 'undefined' ? localStorage.getItem(`city_${profile.id}`) : null;
      if (localCity) setProfileCity(localCity);

      const [kids, schoolList, parentBookings, saved] = await Promise.all([
        dbService.getChildren(profile.id),
        dbService.getSchools(),
        dbService.getBookingsByParent(profile.id),
        dbService.getSavedEvents(profile.id)
      ]);

      setChildren(kids);
      setSchools(schoolList);
      setBookings(parentBookings);
      setSavedCount(saved.length);
      setLoading(false);
    };
    load();
  }, []);

  // Avatar Upload Mock / Preset Handler
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && parent) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarUrl(result);
        if (typeof window !== 'undefined') {
          localStorage.setItem(`avatar_${parent.id}`, result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = async () => {
    if (!parent) return;
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      const updated = await dbService.updateParentProfile(parent.id, { name: profileName, phone: profilePhone });
      setParent(updated);

      if (typeof window !== 'undefined') {
        localStorage.setItem(`city_${parent.id}`, profileCity);
      }

      setEditingProfile(false);
      setProfileMsg({ type: 'success', text: 'Profile details updated successfully.' });
    } catch {
      setProfileMsg({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setProfileSaving(false);
    }
  };

  const toggleCategory = (cat: string) => {
    setPreferredCats(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
    setPrefSaved(true);
    setTimeout(() => setPrefSaved(false), 2000);
  };

  const addChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parent) return;
    if (!childName || !childAge) {
      setChildMsg({ type: 'error', text: 'Child name and age are required.' });
      return;
    }
    setChildSaving(true);
    setChildMsg(null);
    try {
      const newChild = await dbService.createChild({
        parent_id: parent.id,
        name: childName.trim(),
        age: Number(childAge),
        school_id: childSchoolId || null,
        emergency_contact: childEmergency || null,
      });
      setChildren(prev => [...prev, newChild]);
      setChildName(''); setChildAge(''); setChildSchoolId(''); setChildEmergency('');
      setShowAddChild(false);
      setChildMsg({ type: 'success', text: `${newChild.name} added to your profile!` });
    } catch {
      setChildMsg({ type: 'error', text: 'Failed to add child. Please try again.' });
    } finally {
      setChildSaving(false);
    }
  };

  const deleteChild = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from your profile?`)) return;
    try {
      await dbService.deleteChild(id);
      setChildren(prev => prev.filter(c => c.id !== id));
      setChildMsg({ type: 'success', text: `${name} removed.` });
    } catch {
      setChildMsg({ type: 'error', text: 'Failed to delete child record.' });
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText('KIDSPIRE-SPARKLE2026');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed');
  const pastBookings = bookings.filter(b => b.status === 'cancelled');

  return (
    <div className="bg-slate-50 min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Parent Account & Profile</h1>
          <p className="text-slate-600 text-sm sm:text-base mt-1">Manage your family details, registered children, activity preferences, and rewards.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-64 shrink-0">
            <Card className="rounded-3xl border border-slate-100 shadow-sm sticky top-24">
              <CardContent className="p-4 space-y-1.5">
                {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 ${
                        active
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                          : 'text-slate-600 hover:bg-purple-50 hover:text-purple-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span>{label}</span>
                      </div>
                      {active && <ChevronRight className="w-4 h-4 text-purple-200" />}
                    </Link>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quick Rewards Box */}
            <Card className="mt-6 rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 text-white p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 opacity-10">
                <Sparkles className="w-32 h-32 text-white" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-300">
                    <Sparkles className="w-3.5 h-3.5 fill-amber-300" /> Kidspire Rewards
                  </span>
                  <Award className="w-5 h-5 text-amber-300" />
                </div>
                <div className="text-3xl font-black text-white mb-1">450 <span className="text-sm font-medium text-purple-200">Points</span></div>
                <p className="text-xs text-purple-100 mb-4">Earn 50 bonus points on every booked activity!</p>
                <button
                  onClick={copyReferralCode}
                  className="w-full flex items-center justify-center gap-2 bg-white text-purple-700 font-bold py-2.5 px-4 rounded-xl text-xs shadow-md hover:bg-slate-100 transition-colors"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-purple-600" />}
                  <span>{copiedCode ? 'Code Copied!' : 'Copy Referral Code'}</span>
                </button>
              </div>
            </Card>
          </div>

          {/* Main Dashboard Content */}
          <div className="flex-1 space-y-8">
            
            {/* 1. Profile Header Card */}
            <Card className="rounded-3xl border border-slate-100 shadow-sm overflow-hidden bg-white">
              <div className="h-28 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)]" />
              </div>
              <CardContent className="px-6 pb-6 pt-0 relative">
                
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-6">
                  {/* Avatar Upload */}
                  <div className="relative group">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-xl bg-purple-100 flex items-center justify-center text-purple-700 font-black text-3xl overflow-hidden shrink-0">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : parent?.name ? (
                        parent.name.charAt(0).toUpperCase()
                      ) : (
                        'P'
                      )}
                    </div>
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-purple-700 hover:scale-110 transition-all"
                      title="Upload photo"
                    >
                      <Camera className="w-4 h-4" />
                      <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </label>
                  </div>

                  {/* Header Actions */}
                  <div className="flex flex-wrap items-center gap-3">
                    {!editingProfile ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setEditingProfile(true); setProfileMsg(null); }}
                        className="rounded-2xl font-bold border-purple-200 text-purple-700 hover:bg-purple-50"
                      >
                        <Pencil className="w-4 h-4 mr-2" /> Edit Profile
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingProfile(false)}
                        className="rounded-2xl font-bold text-slate-600"
                      >
                        Cancel
                      </Button>
                    )}
                    <Link href="/dashboard/parent/settings">
                      <Button variant="outline" size="sm" className="rounded-2xl font-bold text-slate-600">
                        <Settings className="w-4 h-4 mr-2" /> Account Settings
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Profile Details & Form */}
                {loading ? (
                  <p className="text-slate-400">Loading profile…</p>
                ) : !parent ? (
                  <p className="text-slate-500">No profile found.</p>
                ) : editingProfile ? (
                  <div className="bg-purple-50/60 border border-purple-100 rounded-3xl p-6 space-y-4 max-w-xl">
                    <h3 className="font-bold text-slate-900 text-lg">Edit Personal Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">Full Name *</label>
                        <Input value={profileName} onChange={e => setProfileName(e.target.value)} required className="rounded-xl bg-white" />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">Phone Number</label>
                        <Input icon={<Phone className="w-4 h-4 text-slate-400" />} placeholder="+91 98765 43210" value={profilePhone} onChange={e => setProfilePhone(e.target.value)} className="rounded-xl bg-white" />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">City / Preferred Location</label>
                        <Input icon={<MapPin className="w-4 h-4 text-slate-400" />} value={profileCity} onChange={e => setProfileCity(e.target.value)} className="rounded-xl bg-white" />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">Account Email</label>
                        <Input value={parent.email} disabled className="opacity-60 bg-slate-100 rounded-xl" />
                      </div>
                    </div>

                    {profileMsg && (
                      <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-2xl ${profileMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {profileMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                        <span>{profileMsg.text}</span>
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <Button onClick={saveProfile} disabled={profileSaving} className="rounded-xl font-bold bg-purple-600 hover:bg-purple-700 text-white">
                        {profileSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setEditingProfile(false)} className="rounded-xl">Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-slate-900">{parent.name}</h2>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                        @{parent.name.toLowerCase().replace(/[^a-z0-9]/g, '')}_parent
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-purple-600" />
                        <span>{profileCity}, India</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <span>Joined August 2024</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-xs">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified Parent Account
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 2. Contact & Account Info */}
            <Card className="rounded-3xl border border-slate-100 shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-purple-600" /> Contact & Account Credentials
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-0.5">Email Address</p>
                      <p className="text-sm font-semibold text-slate-900 truncate">{parent?.email}</p>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-0.5">Phone Number</p>
                      <p className="text-sm font-semibold text-slate-900">{parent?.phone || 'Not added yet'}</p>
                      <p className="text-[11px] text-slate-400 mt-1">Used for SMS booking confirmations</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Need to change your password or privacy preferences?</span>
                  <Link href="/dashboard/parent/settings" className="text-xs font-bold text-purple-600 hover:text-purple-700 hover:underline flex items-center gap-1">
                    Manage Settings <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* 3. Kids / Children Profiles */}
            <Card className="rounded-3xl border border-slate-100 shadow-sm bg-white">
              <CardHeader className="flex-row items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-600" /> Registered Children Profiles
                  </CardTitle>
                  <p className="text-xs text-slate-500 mt-0.5">Events and seat availability are age-bracket matched per child.</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => { setShowAddChild(v => !v); setChildMsg(null); }}
                  className="rounded-2xl font-bold bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-1.5" /> Add Child
                </Button>
              </CardHeader>
              <CardContent className="pt-5">
                {childMsg && (
                  <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-2xl mb-4 ${childMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {childMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                    <span>{childMsg.text}</span>
                  </div>
                )}

                {/* Add Child Form */}
                {showAddChild && (
                  <form onSubmit={addChild} className="bg-purple-50/70 border border-purple-100 rounded-3xl p-5 mb-6 space-y-4">
                    <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                      <Plus className="w-4 h-4 text-purple-600" /> Add New Child Profile
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">Child's Name *</label>
                        <Input placeholder="e.g. Aarav" value={childName} onChange={e => setChildName(e.target.value)} required className="bg-white rounded-xl" />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">Age (Years) *</label>
                        <Input type="number" placeholder="8" min={1} max={18} value={childAge} onChange={e => setChildAge(e.target.value)} required className="bg-white rounded-xl" />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">School (Optional)</label>
                        <select
                          value={childSchoolId}
                          onChange={e => setChildSchoolId(e.target.value)}
                          className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                        >
                          <option value="">-- Select school --</option>
                          {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">Emergency Contact (Optional)</label>
                        <Input icon={<Phone className="w-4 h-4 text-slate-400" />} placeholder="+91 98765 43210" value={childEmergency} onChange={e => setChildEmergency(e.target.value)} className="bg-white rounded-xl" />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button type="submit" disabled={childSaving} className="rounded-xl font-bold bg-purple-600 hover:bg-purple-700 text-white">
                        {childSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                        Save Child Profile
                      </Button>
                      <Button variant="outline" type="button" onClick={() => setShowAddChild(false)} className="rounded-xl">Cancel</Button>
                    </div>
                  </form>
                )}

                {/* Children List */}
                {loading ? (
                  <p className="text-slate-400">Loading children profiles…</p>
                ) : children.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <BookOpen className="w-10 h-10 text-purple-300 mx-auto mb-3" />
                    <h4 className="font-bold text-slate-800 text-base mb-1">No children added yet</h4>
                    <p className="text-slate-500 text-sm max-w-md mx-auto mb-4">Add your child's profile to receive age-tailored event recommendations and easy 1-click booking.</p>
                    <Button size="sm" onClick={() => setShowAddChild(true)} className="rounded-xl font-bold bg-purple-600 text-white">
                      <Plus className="w-4 h-4 mr-2" /> Add First Child
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {children.map(child => (
                      <div key={child.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-purple-50/40 hover:border-purple-200 transition-all duration-200">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-black text-lg shadow-sm shrink-0">
                            {child.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-base truncate">{child.name}</p>
                            <p className="text-xs text-slate-600 font-medium">{child.age} yrs &middot; {ageBracketLabel(child.age)}</p>
                            {child.school && <p className="text-[11px] text-purple-600 font-semibold truncate mt-0.5">🏫 {child.school.name}</p>}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => deleteChild(child.id, child.name)}
                            className="w-8 h-8 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors"
                            title="Remove child"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 4. Activity Section */}
            <Card className="rounded-3xl border border-slate-100 shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-purple-600" /> Activity Summary & Bookings
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-purple-50/80 border border-purple-100 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                      <Ticket className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-purple-900">{upcomingBookings.length}</div>
                      <div className="text-xs font-semibold text-purple-700">Upcoming Bookings</div>
                    </div>
                  </div>

                  <div className="bg-rose-50/80 border border-rose-100 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-heart-active text-white flex items-center justify-center shrink-0">
                      <Heart className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-rose-900">{savedCount}</div>
                      <div className="text-xs font-semibold text-rose-700">Saved Events</div>
                    </div>
                  </div>

                  <div className="bg-amber-50/80 border border-amber-100 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-amber-900">{pastBookings.length}</div>
                      <div className="text-xs font-semibold text-amber-700">Completed Events</div>
                    </div>
                  </div>
                </div>

                {/* Upcoming Activity Preview */}
                {upcomingBookings.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Next Upcoming Activity</h4>
                    {upcomingBookings.slice(0, 2).map(b => (
                      <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-slate-100 rounded-2xl bg-slate-50">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{b.event?.title || 'Kidspire Event'}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-purple-600" /> {b.event?.event_date || 'Upcoming'}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-purple-600" /> {b.event?.location || 'Venue'}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-3">
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            Ref: {b.booking_reference?.substring(0, 8)}
                          </span>
                          <Link href="/dashboard/parent" className="text-xs font-bold text-purple-600 hover:underline">
                            View Ticket &rarr;
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs text-slate-500 mb-2">No upcoming activity bookings right now.</p>
                    <Link href="/explore" className="text-xs font-bold text-purple-600 hover:underline">
                      Explore Activities &rarr;
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 5. Activity Preferences */}
            <Card className="rounded-3xl border border-slate-100 shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100 flex-row items-center justify-between">
                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-purple-600" /> Family Preferences & Notifications
                </CardTitle>
                {prefSaved && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <Check className="w-3.5 h-3.5" /> Preferences Saved
                  </span>
                )}
              </CardHeader>
              <CardContent className="pt-5 space-y-6">
                
                {/* Preferred Categories */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 block">
                    Preferred Activity Categories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORY_OPTIONS.map(cat => {
                      const selected = preferredCats.includes(cat);
                      return (
                        <button
                          key={cat}
                          onClick={() => toggleCategory(cat)}
                          className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                            selected
                              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20 scale-105'
                              : 'bg-slate-100 text-slate-600 hover:bg-purple-50 hover:text-purple-600'
                          }`}
                        >
                          {selected && <Check className="w-3.5 h-3.5 inline mr-1" />}
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Notifications Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-slate-900">Email Weekend Digest</p>
                      <p className="text-[11px] text-slate-500">Weekly curated event recommendations</p>
                    </div>
                    <button
                      onClick={() => setEmailDigest(v => !v)}
                      className={`w-11 h-6 rounded-full transition-colors relative ${emailDigest ? 'bg-purple-600' : 'bg-slate-300'}`}
                    >
                      <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${emailDigest ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-slate-900">SMS Booking Alerts</p>
                      <p className="text-[11px] text-slate-500">Instant reminders & venue updates</p>
                    </div>
                    <button
                      onClick={() => setSmsReminders(v => !v)}
                      className={`w-11 h-6 rounded-full transition-colors relative ${smsReminders ? 'bg-purple-600' : 'bg-slate-300'}`}
                    >
                      <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${smsReminders ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 6. Reviews & Referrals */}
            <Card className="rounded-3xl border border-slate-100 shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-400" /> Recent Ratings & Reviews
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="space-y-3">
                  <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50/60">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-900 text-sm">Kids Soccer Camp</span>
                      <div className="flex items-center gap-1 text-amber-500">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 italic">"Great coaches and active exercises! My child loved dribbling and basic team play."</p>
                    <span className="text-[10px] text-slate-400 mt-2 block">Reviewed 2 weeks ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
