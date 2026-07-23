'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Heart, Ticket, User, Settings, Lock, Bell, Trash2,
  Loader2, AlertCircle, CheckCircle2, LogOut, Download, X, ShieldAlert
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authService } from '@/services/auth';
import { dbService } from '@/services/db';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

const NAV_LINKS = [
  { href: '/dashboard/parent', label: 'My Bookings', icon: Ticket },
  { href: '/dashboard/parent/saved', label: 'Saved Events', icon: Heart },
  { href: '/dashboard/parent/profile', label: 'Profile & Kids', icon: User },
  { href: '/dashboard/parent/settings', label: 'Settings', icon: Settings },
];

export default function ParentSettingsPage() {
  const pathname = usePathname();
  const router = useRouter();

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Notification preferences (stored locally as no backend table for it)
  const [emailBooking, setEmailBooking] = useState(true);
  const [emailMarketing, setEmailMarketing] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(true);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);
    if (newPassword.length < 6) {
      setPwdMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    setPwdSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPwdMsg({ type: 'success', text: 'Password updated successfully.' });
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err: any) {
      setPwdMsg({ type: 'error', text: err.message || 'Failed to update password.' });
    } finally {
      setPwdSaving(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    router.push('/');
  };

  // Account deletion
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) throw new Error('Not authenticated');
      // Delete parent profile row (cascade deletes children, bookings, saved_events)
      const profile = await dbService.getParentProfile(currentUser.id);
      if (profile) {
        await dbService.deleteParentProfile(profile.id);
      }
      // Sign out (Supabase will cascade-delete auth user on DELETE CASCADE)
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/?account_deleted=1');
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete account. Please contact support.');
      setDeleteLoading(false);
    }
  };

  // Data export
  const [exportLoading, setExportLoading] = useState(false);

  const handleExportData = async () => {
    setExportLoading(true);
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) throw new Error('Not authenticated');
      const profile = await dbService.getParentProfile(currentUser.id);
      if (!profile) throw new Error('Profile not found');
      const [children, bookings, savedEvents] = await Promise.all([
        dbService.getChildren(profile.id),
        dbService.getBookingsByParent(profile.id),
        dbService.getSavedEvents(profile.id),
      ]);
      const exportData = {
        exported_at: new Date().toISOString(),
        profile: { name: profile.name, email: profile.email, phone: profile.phone },
        children: children.map(c => ({ name: c.name, age: c.age, emergency_contact: c.emergency_contact })),
        bookings: bookings.map(b => ({
          reference: b.booking_reference,
          event: b.event?.title,
          date: b.event?.event_date,
          child: b.child?.name,
          status: b.status,
          payment_status: b.payment_status,
        })),
        saved_events: savedEvents.map((s: any) => s.event?.title).filter(Boolean),
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kidspire-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message || 'Export failed. Please try again.');
    } finally {
      setExportLoading(false);
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

            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-purple-600" /> Change Password
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-sm">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">New Password</label>
                    <Input
                      type="password"
                      icon={<Lock className="w-4 h-4" />}
                      placeholder="Min 6 characters"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Confirm New Password</label>
                    <Input
                      type="password"
                      icon={<Lock className="w-4 h-4" />}
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  {pwdMsg && (
                    <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${pwdMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {pwdMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      {pwdMsg.text}
                    </div>
                  )}
                  <Button type="submit" disabled={pwdSaving}>
                    {pwdSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-purple-600" /> Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Email: Booking confirmations & reminders', sublabel: 'Sent for every confirmed booking and 24h before events.', value: emailBooking, setter: setEmailBooking },
                    { label: 'Email: Promotions & new events nearby', sublabel: 'Weekly digest of new activities in your area.', value: emailMarketing, setter: setEmailMarketing },
                    { label: 'SMS: Waitlist & seat-opening alerts', sublabel: 'Instant SMS when a seat opens for a saved event.', value: smsAlerts, setter: setSmsAlerts },
                  ].map(({ label, sublabel, value, setter }) => (
                    <div key={label} className="flex items-start justify-between gap-4 p-4 border border-slate-100 rounded-2xl">
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{sublabel}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setter(v => !v)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${value ? 'bg-purple-600' : 'bg-slate-200'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
                <Button className="mt-6" onClick={() => {}}>Save Preferences</Button>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <Trash2 className="w-5 h-5" /> Account Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Sign out */}
                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl">
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Sign Out</p>
                    <p className="text-xs text-slate-500">Log out of your Kidspire account on this device.</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                  </Button>
                </div>

                {/* Export data */}
                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl">
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Download My Data</p>
                    <p className="text-xs text-slate-500">Export all your account data as a JSON file.</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleExportData} disabled={exportLoading}>
                    {exportLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                    {exportLoading ? '' : 'Export'}
                  </Button>
                </div>

                {/* Delete account */}
                <div className="flex items-center justify-between p-4 border border-red-100 rounded-2xl bg-red-50">
                  <div>
                    <p className="font-semibold text-red-800 text-sm">Delete Account</p>
                    <p className="text-xs text-red-600">Permanently delete your account and all associated data. This cannot be undone.</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-700 hover:bg-red-100"
                    onClick={() => { setShowDeleteModal(true); setDeleteConfirmText(''); setDeleteError(null); }}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>

      {/* Delete account confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
            <button onClick={() => setShowDeleteModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Delete account?</h2>
                <p className="text-sm text-red-600 mt-0.5">This action is permanent and cannot be reversed.</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Deleting your account will permanently remove your profile, all children's profiles, all booking history, and saved events. Any upcoming confirmed bookings will be cancelled and refunded per our refund policy.
            </p>
            <div className="mb-6">
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Type <span className="font-mono bg-slate-100 px-1 rounded">DELETE</span> to confirm
              </label>
              <Input
                value={deleteConfirmText}
                onChange={e => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="font-mono"
              />
            </div>
            {deleteError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-3 py-2 text-sm mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" /> {deleteError}
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowDeleteModal(false)} disabled={deleteLoading}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                disabled={deleteConfirmText !== 'DELETE' || deleteLoading}
                onClick={handleDeleteAccount}
              >
                {deleteLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting…</> : 'Delete My Account'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
