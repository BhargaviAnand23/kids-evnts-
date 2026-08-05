'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Settings, LayoutDashboard, Calendar, Ticket, IndianRupee,
  Building2, Mail, Phone, Globe, MapPin, Loader2, ShieldAlert,
  CheckCircle2, AlertCircle, Pencil, ExternalLink, Image as ImageIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { dbService } from '@/services/db';
import { authService } from '@/services/auth';
import type { Organization, OrganizationType } from '@/types';

const SIDEBAR = [
  { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/admin/events/new', label: 'Create Event', icon: Calendar },
  { href: '#', label: 'Bookings', icon: Ticket },
  { href: '#', label: 'Payouts', icon: IndianRupee },
  { href: '/dashboard/admin/settings', label: 'Settings', icon: Settings },
];

const ORG_TYPE_LABELS: Record<OrganizationType, string> = {
  school: 'School',
  college: 'College',
  club: 'Sports Club',
  sports_academy: 'Sports Academy',
  arts_studio: 'Arts Studio',
  camp: 'Camp / Workshop',
  independent: 'Independent Coach',
  other: 'Other',
};

export default function AdminSettingsPage() {
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'club' as OrganizationType,
    logo_url: '',
    bio: '',
    description: '',
    contact_email: '',
    phone: '',
    website: '',
    address: '',
  });

  useEffect(() => {
    const load = async () => {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser || currentUser.role !== 'admin' || !currentUser.organization_id) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }
      const organization = await dbService.getOrganizationById(currentUser.organization_id);
      if (organization) {
        setOrg(organization);
        setFormData({
          name: organization.name,
          type: organization.type,
          logo_url: organization.logo_url || '',
          bio: organization.bio || '',
          description: organization.description || '',
          contact_email: organization.contact_email || '',
          phone: organization.phone || '',
          website: organization.website || '',
          address: organization.address || '',
        });
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org) return;
    setSaving(true);
    setMsg(null);
    try {
      const updated = await dbService.updateOrganization(org.id, formData);
      setOrg(updated);
      setEditing(false);
      setMsg({ type: 'success', text: 'Organization profile updated successfully.' });
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Failed to save. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="bg-slate-50 min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 text-purple-600 animate-spin" /></div>;
  }

  if (unauthorized) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <ShieldAlert className="w-14 h-14 text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Organizer Access Required</h1>
          <p className="text-slate-500 mb-6">Log in as an event organizer to access settings.</p>
          <Button asChild><Link href="/login">Log In</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Partner Settings</h1>
          {org && (
            <Button variant="outline" asChild className="border-purple-200 text-purple-700 hover:bg-purple-50">
              <Link href={`/organizers/${org.id}`} target="_blank">
                <ExternalLink className="w-4 h-4 mr-2" /> View Public Profile
              </Link>
            </Button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 shrink-0">
            <Card>
              <CardContent className="p-4 space-y-2">
                {SIDEBAR.map(({ href, label, icon: Icon }) => {
                  const active = label === 'Settings';
                  return (
                    <Link key={label} href={href}
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

            {/* Organization Profile */}
            <Card>
              <CardHeader className="flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-purple-600" /> Organization Profile
                </CardTitle>
                {!editing && (
                  <Button variant="outline" size="sm" onClick={() => { setEditing(true); setMsg(null); }}>
                    <Pencil className="w-4 h-4 mr-2" /> Edit Profile
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {msg && (
                  <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg mb-4 ${msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {msg.text}
                  </div>
                )}

                {editing ? (
                  <form onSubmit={handleSave} className="space-y-4 max-w-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Organization Name</label>
                        <Input name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Metro Youth Sports Club" />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Organization Type</label>
                        <select name="type" value={formData.type} onChange={handleChange}
                          className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500">
                          {Object.entries(ORG_TYPE_LABELS).map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Logo URL</label>
                      <Input name="logo_url" value={formData.logo_url} onChange={handleChange} icon={<ImageIcon className="w-4 h-4" />} placeholder="https://example.com/logo.png" />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Short Tagline / Bio</label>
                      <Input name="bio" value={formData.bio} onChange={handleChange} placeholder="Empowering children through grassroots sports & athletics." />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-1.5 block">About / Detailed Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Tell parents more about your organization history, mission, programs, and team..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Contact Email</label>
                        <Input name="contact_email" type="email" value={formData.contact_email} onChange={handleChange} required icon={<Mail className="w-4 h-4" />} />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Phone Number (Optional)</label>
                        <Input name="phone" value={formData.phone} onChange={handleChange} icon={<Phone className="w-4 h-4" />} placeholder="+1 (555) 000-0000" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Website URL (Optional)</label>
                        <Input name="website" value={formData.website} onChange={handleChange} icon={<Globe className="w-4 h-4" />} placeholder="https://example.com" />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Address / Location</label>
                        <Input name="address" value={formData.address} onChange={handleChange} icon={<MapPin className="w-4 h-4" />} placeholder="e.g. 123 Stadium Way, Seattle, WA" />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="submit" disabled={saving} className="bg-purple-600 hover:bg-purple-700 font-bold">
                        {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Save Changes
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                    </div>
                  </form>
                ) : !org ? (
                  <p className="text-slate-500">Organization not found.</p>
                ) : (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="w-20 h-20 rounded-2xl bg-purple-100 border border-purple-200 overflow-hidden flex items-center justify-center text-purple-700 font-bold text-3xl shrink-0">
                        {org.logo_url ? (
                          <img src={org.logo_url} alt={org.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{org.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <h2 className="font-bold text-slate-900 text-xl">{org.name}</h2>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge className="bg-purple-100 text-purple-800 text-xs font-semibold">{ORG_TYPE_LABELS[org.type] || org.type}</Badge>
                          {org.verified && (
                            <Badge variant="success" className="bg-emerald-50 text-emerald-700 text-xs font-semibold">✓ Verified Partner</Badge>
                          )}
                        </div>
                        {org.bio && <p className="text-slate-600 text-sm mt-2">{org.bio}</p>}
                      </div>
                    </div>

                    {org.description && (
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/70">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">About</p>
                        <p className="text-slate-700 text-sm leading-relaxed">{org.description}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2.5 text-sm text-slate-600">
                        <Mail className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>{org.contact_email}</span>
                      </div>
                      {org.phone && (
                        <div className="flex items-center gap-2.5 text-sm text-slate-600">
                          <Phone className="w-4 h-4 text-purple-600 shrink-0" />
                          <span>{org.phone}</span>
                        </div>
                      )}
                      {org.website && (
                        <div className="flex items-center gap-2.5 text-sm text-slate-600">
                          <Globe className="w-4 h-4 text-purple-600 shrink-0" />
                          <a href={org.website} target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 underline">
                            {org.website}
                          </a>
                        </div>
                      )}
                      {org.address && (
                        <div className="flex items-center gap-2.5 text-sm text-slate-600">
                          <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
                          <span>{org.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Verification Status */}
            <Card>
              <CardHeader>
                <CardTitle>Verification Status</CardTitle>
              </CardHeader>
              <CardContent>
                {org?.verified ? (
                  <div className="flex items-start gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-emerald-900">Your organization is verified</p>
                      <p className="text-emerald-700 text-sm mt-1">Your events are eligible to be published on Kidspire after admin review.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4 p-4 bg-orange-50 border border-orange-200 rounded-2xl">
                    <AlertCircle className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-orange-900">Verification Pending</p>
                      <p className="text-orange-700 text-sm mt-1">Your organization is under review. Events will be held for approval until verification is complete. Email <span className="font-semibold">partner@kidspire.com</span> to expedite.</p>
                    </div>
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
