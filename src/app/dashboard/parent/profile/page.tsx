'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Heart, Ticket, User, Settings, Plus, Pencil, Trash2,
  Loader2, AlertCircle, CheckCircle2, Phone, BookOpen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { authService } from '@/services/auth';
import { dbService } from '@/services/db';
import type { Parent, Child, School } from '@/types';

const NAV_LINKS = [
  { href: '/dashboard/parent', label: 'My Bookings', icon: Ticket },
  { href: '/dashboard/parent/saved', label: 'Saved Events', icon: Heart },
  { href: '/dashboard/parent/profile', label: 'Profile & Kids', icon: User },
  { href: '/dashboard/parent/settings', label: 'Settings', icon: Settings },
];

const ageBracketLabel = (age: number) => {
  if (age <= 5) return 'Early Kids (0-5)';
  if (age <= 12) return 'Kids (6-12)';
  if (age <= 17) return 'Teens (13-17)';
  return 'Young Adult (18+)';
};

export default function ProfileKidsPage() {
  const pathname = usePathname();
  const [parent, setParent] = useState<Parent | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit profile state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Add child state
  const [showAddChild, setShowAddChild] = useState(false);
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [childSchoolId, setChildSchoolId] = useState('');
  const [childEmergency, setChildEmergency] = useState('');
  const [childSaving, setChildSaving] = useState(false);
  const [childMsg, setChildMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) return;
      const profile = await dbService.getParentProfile(currentUser.id);
      if (!profile) return;
      setParent(profile);
      setProfileName(profile.name);
      setProfilePhone(profile.phone || '');
      const [kids, schoolList] = await Promise.all([
        dbService.getChildren(profile.id),
        dbService.getSchools(),
      ]);
      setChildren(kids);
      setSchools(schoolList);
      setLoading(false);
    };
    load();
  }, []);

  const saveProfile = async () => {
    if (!parent) return;
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      const updated = await dbService.updateParentProfile(parent.id, { name: profileName, phone: profilePhone });
      setParent(updated);
      setEditingProfile(false);
      setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
    } catch {
      setProfileMsg({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setProfileSaving(false);
    }
  };

  const addChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parent) return;
    if (!childName || !childAge) { setChildMsg({ type: 'error', text: 'Name and age are required.' }); return; }
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
      setChildMsg({ type: 'success', text: `${newChild.name} added successfully!` });
    } catch {
      setChildMsg({ type: 'error', text: 'Failed to add child. Please try again.' });
    } finally {
      setChildSaving(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 sm:mb-8">My Dashboard</h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <Card>
              <CardContent className="p-4 space-y-2">
                {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href;
                  return (
                    <Link key={href} href={href}
                      className={`flex items-center px-4 py-3 rounded-xl font-medium transition-colors ${active ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-slate-50 hover:text-purple-600'}`}
                    >
                      <Icon className="w-5 h-5 mr-3" /> {label}
                    </Link>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">

            {/* Parent Profile Card */}
            <Card>
              <CardHeader className="flex-row items-center justify-between pb-2">
                <CardTitle>Parent Profile</CardTitle>
                {!editingProfile && (
                  <Button variant="outline" size="sm" onClick={() => { setEditingProfile(true); setProfileMsg(null); }}>
                    <Pencil className="w-4 h-4 mr-2" /> Edit
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-slate-400">Loading…</p>
                ) : !parent ? (
                  <p className="text-slate-500">No profile found.</p>
                ) : editingProfile ? (
                  <div className="space-y-4 max-w-sm">
                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">Full Name</label>
                      <Input value={profileName} onChange={e => setProfileName(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">Phone Number</label>
                      <Input icon={<Phone className="w-4 h-4" />} placeholder="+91 98765 43210" value={profilePhone} onChange={e => setProfilePhone(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">Email</label>
                      <Input value={parent.email} disabled className="opacity-60" />
                      <p className="text-xs text-slate-400 mt-1">Email cannot be changed here.</p>
                    </div>
                    {profileMsg && (
                      <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${profileMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {profileMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        {profileMsg.text}
                      </div>
                    )}
                    <div className="flex gap-3 pt-2">
                      <Button onClick={saveProfile} disabled={profileSaving}>
                        {profileSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setEditingProfile(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {profileMsg && (
                      <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-green-50 text-green-700 mb-3">
                        <CheckCircle2 className="w-4 h-4" /> {profileMsg.text}
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl">
                        {parent.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-lg">{parent.name}</p>
                        <p className="text-slate-500 text-sm">{parent.email}</p>
                        {parent.phone && <p className="text-slate-500 text-sm">{parent.phone}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Children */}
            <Card>
              <CardHeader className="flex-row items-center justify-between pb-2">
                <CardTitle>My Children</CardTitle>
                <Button size="sm" onClick={() => { setShowAddChild(v => !v); setChildMsg(null); }}>
                  <Plus className="w-4 h-4 mr-2" /> Add Child
                </Button>
              </CardHeader>
              <CardContent>
                {childMsg && (
                  <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg mb-4 ${childMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {childMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {childMsg.text}
                  </div>
                )}

                {showAddChild && (
                  <form onSubmit={addChild} className="bg-purple-50 border border-purple-100 rounded-2xl p-5 mb-6 space-y-4">
                    <h4 className="font-bold text-slate-900">Add New Child</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-slate-700 mb-2 block">Child's Name *</label>
                        <Input placeholder="e.g. Aarav" value={childName} onChange={e => setChildName(e.target.value)} required />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-slate-700 mb-2 block">Age *</label>
                        <Input type="number" placeholder="8" min={1} max={18} value={childAge} onChange={e => setChildAge(e.target.value)} required />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-slate-700 mb-2 block">School (optional)</label>
                        <select
                          value={childSchoolId}
                          onChange={e => setChildSchoolId(e.target.value)}
                          className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">-- Select school --</option>
                          {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-slate-700 mb-2 block">Emergency Contact (optional)</label>
                        <Input icon={<Phone className="w-4 h-4" />} placeholder="+91 98765 43210" value={childEmergency} onChange={e => setChildEmergency(e.target.value)} />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button type="submit" disabled={childSaving}>
                        {childSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                        Add Child
                      </Button>
                      <Button variant="outline" type="button" onClick={() => setShowAddChild(false)}>Cancel</Button>
                    </div>
                  </form>
                )}

                {loading ? (
                  <p className="text-slate-400">Loading…</p>
                ) : children.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No children added yet. Click "Add Child" to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {children.map(child => (
                      <div key={child.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                            {child.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{child.name}</p>
                            <p className="text-sm text-slate-500">{child.age} years · {ageBracketLabel(child.age)}</p>
                            {child.school && <p className="text-xs text-slate-400">{child.school.name}</p>}
                          </div>
                        </div>
                        <Badge variant="pill" className="bg-purple-50 text-purple-700">{child.age} yrs</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
