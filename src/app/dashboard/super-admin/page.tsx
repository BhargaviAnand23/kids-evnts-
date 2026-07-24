"use client";

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Tag,
  CreditCard,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Plus,
  Trash2,
  Edit,
  ShieldCheck,
  UserCheck,
  UserX,
  Sparkles,
  Flame,
  Star,
  Award,
  DollarSign,
  TrendingUp,
  Filter,
  LogOut,
  RefreshCw,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { dbService as db } from '@/services/db';
import { Event, Booking } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

type AdminTab = 'overview' | 'events' | 'users' | 'categories' | 'bookings' | 'settings';

export default function SuperAdminPage() {
  return (
    <AdminGuard>
      <SuperAdminContent />
    </AdminGuard>
  );
}

function SuperAdminContent() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // State Data
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [eventSearch, setEventSearch] = useState('');
  const [eventStatusFilter, setEventStatusFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  // Category Modal State
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('⭐');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [showAddCat, setShowAddCat] = useState(false);

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [allEvents, allUsers, allCats, allBookings] = await Promise.all([
        db.getEvents({ status: 'all' }),
        db.getAllUsersAdmin(),
        db.getCategoriesAdmin(),
        db.getBookingsByParent('parent-1').catch(() => [])
      ]);
      setEvents(allEvents);
      setUsers(allUsers);
      setCategories(allCats);
      setBookings(allBookings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Event Actions
  const handleApproveEvent = async (id: string) => {
    if (!confirm('Approve this event for public listing?')) return;
    await db.updateEventStatus(id, 'approved');
    loadAllAdminData();
  };

  const handleRejectEvent = async (id: string) => {
    const reason = prompt('Reason for rejection:');
    if (reason === null) return;
    await db.updateEventStatus(id, 'rejected', reason || 'Does not meet guidelines');
    loadAllAdminData();
  };

  const handleToggleBadge = async (eventId: string, badgeType: 'is_sponsored' | 'is_hot' | 'is_popular' | 'is_new') => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    const currentVal = (event as any)[badgeType] || false;
    await db.updateEventBadgesAdmin(eventId, { [badgeType]: !currentVal });
    loadAllAdminData();
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event from the platform?')) return;
    await db.deleteEventAdmin(id);
    loadAllAdminData();
  };

  // User Actions
  const handlePromoteUser = async (userId: string, newRole: 'parent' | 'admin' | 'super_admin') => {
    if (!confirm(`Change user role to ${newRole.toUpperCase()}?`)) return;
    await db.updateUserRoleAdmin(userId, newRole);
    loadAllAdminData();
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: 'active' | 'suspended') => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    if (!confirm(`Set user status to ${nextStatus.toUpperCase()}?`)) return;
    await db.toggleUserStatusAdmin(userId, nextStatus);
    loadAllAdminData();
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Delete user account permanently?')) return;
    await db.deleteUserAdmin(userId);
    loadAllAdminData();
  };

  // Category Actions
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await db.addCategoryAdmin({
      name: newCatName.trim(),
      icon: newCatIcon,
      description: newCatDesc.trim() || 'Activities & Events'
    });
    setNewCatName('');
    setNewCatDesc('');
    setShowAddCat(false);
    loadAllAdminData();
  };

  const handleDeleteCategory = async (name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    await db.deleteCategoryAdmin(name);
    loadAllAdminData();
  };

  // Calculations
  const pendingEvents = events.filter(e => e.status === 'pending_review');
  const approvedEvents = events.filter(e => e.status === 'approved');
  const totalRevenue = events.reduce((acc, e) => acc + (e.price * (e.seats_total - e.seats_available)), 0);

  // Filtered lists
  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
                          e.category.toLowerCase().includes(eventSearch.toLowerCase()) ||
                          (e.location || '').toLowerCase().includes(eventSearch.toLowerCase());
    const matchesStatus = eventStatusFilter === 'all' || e.status === eventStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">

      {/* ── Sidebar Nav ────────────────────────────────────────────────── */}
      <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 shrink-0 p-6 flex flex-col justify-between">
        <div>
          {/* Platform Branding */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-extrabold shadow-lg shadow-purple-500/20">
              ⚡
            </div>
            <div>
              <h2 className="font-extrabold text-white text-lg leading-tight">Kidspire Admin</h2>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                Staff Control Panel
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: null },
              { id: 'events', label: 'Events & Approvals', icon: Calendar, badge: pendingEvents.length > 0 ? pendingEvents.length : null },
              { id: 'users', label: 'User Directory', icon: Users, badge: null },
              { id: 'categories', label: 'Categories', icon: Tag, badge: null },
              { id: 'bookings', label: 'Bookings & Revenue', icon: CreditCard, badge: null },
              { id: 'settings', label: 'Platform Settings', icon: Settings, badge: null },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as AdminTab)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-orange-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-slate-800/80 mt-6">
          <div className="flex items-center justify-between">
            <div className="text-xs">
              <p className="font-bold text-slate-200">Staff Admin</p>
              <p className="text-[10px] text-slate-500 font-mono">admin@kidspire.com</p>
            </div>
            <Link href="/" className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors" title="Exit to Website">
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ────────────────────────────────────────────── */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto overflow-y-auto">

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white capitalize flex items-center gap-3">
              {activeTab === 'overview' && 'Platform Overview'}
              {activeTab === 'events' && 'Events & Listing Approvals'}
              {activeTab === 'users' && 'User Management & Roles'}
              {activeTab === 'categories' && 'Category Taxonomy'}
              {activeTab === 'bookings' && 'Bookings & Financial Records'}
              {activeTab === 'settings' && 'Platform Configuration'}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Manage platform events, parent accounts, organizers, and financial payout logs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllAdminData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-purple-400' : ''}`} />
              <span>Refresh Data</span>
            </button>

            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-xs font-semibold text-purple-300 hover:bg-purple-600/30 transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Main Site</span>
            </Link>
          </div>
        </div>

        {/* ── TAB 1: OVERVIEW ────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase text-slate-400">Total Users</span>
                  <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white">{users.length}</div>
                <p className="text-[11px] text-slate-400 mt-2">Active parents & event organizers</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase text-slate-400">Total Events</span>
                  <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white">{events.length}</div>
                <p className="text-[11px] text-slate-400 mt-2">{approvedEvents.length} approved, {pendingEvents.length} pending</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase text-slate-400">Pending Review</span>
                  <div className="p-3 bg-orange-500/10 text-orange-400 rounded-2xl">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-orange-400">{pendingEvents.length}</div>
                <p className="text-[11px] text-slate-400 mt-2">Awaiting approval action</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase text-slate-400">Est. Platform GMV</span>
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-emerald-400">₹{totalRevenue.toLocaleString()}</div>
                <p className="text-[11px] text-slate-400 mt-2">Total gross ticket bookings</p>
              </div>
            </div>

            {/* Quick Pending Approvals Callout */}
            {pendingEvents.length > 0 && (
              <div className="bg-gradient-to-r from-orange-950/40 via-slate-900 to-slate-900 border border-orange-500/30 p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-orange-300 text-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-400" />
                    New Event Submission Approvals ({pendingEvents.length})
                  </h3>
                  <button onClick={() => setActiveTab('events')} className="text-xs text-orange-400 font-bold hover:underline">
                    View All Events →
                  </button>
                </div>

                <div className="space-y-3">
                  {pendingEvents.map(evt => (
                    <div key={evt.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-white text-sm">{evt.title}</h4>
                        <p className="text-xs text-slate-400">{evt.organizer?.name || 'Organizer'} • {evt.category} • {evt.location}</p>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleApproveEvent(evt.id)}
                          className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => handleRejectEvent(evt.id)}
                          className="flex-1 sm:flex-none px-4 py-2 bg-red-600/30 hover:bg-red-600/50 text-red-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activity Log */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="font-extrabold text-white text-base">Platform Audit & Activity Log</h3>
              <div className="space-y-3 text-xs">
                {[
                  { time: '10 mins ago', text: 'New event submission: "Beginner Hip Hop Dance Course" by Rhythm Studio', type: 'info' },
                  { time: '1 hour ago', text: 'Parent user "Bhargavi Anand" booked 2 seats for Kids Soccer Camp', type: 'success' },
                  { time: '3 hours ago', text: 'Category "STEM & Tech" updated with 2 new event listings', type: 'info' },
                  { time: 'Yesterday', text: 'Organizer "Chennai Youth Soccer Club" status verified', type: 'success' },
                ].map((log, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                    <span className="text-slate-300 font-medium">{log.text}</span>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-2">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: EVENTS & APPROVALS ──────────────────────────────────── */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            {/* Search & Filter bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by title, category, or city…"
                  value={eventSearch}
                  onChange={e => setEventSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={eventStatusFilter}
                  onChange={e => setEventStatusFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Events Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-4">Event Details</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Date & Time</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Badges</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredEvents.map(event => (
                      <tr key={event.id} className="hover:bg-slate-850/50 transition-colors">
                        <td className="p-4 font-bold text-white max-w-[200px]">
                          <p className="truncate">{event.title}</p>
                          <p className="text-[10px] text-slate-400 font-normal">{event.organizer?.name || 'Organizer'}</p>
                        </td>
                        <td className="p-4">{event.category}</td>
                        <td className="p-4">{event.location}</td>
                        <td className="p-4 font-mono text-[11px]">
                          {event.event_date}
                        </td>
                        <td className="p-4 font-bold text-white">₹{event.price}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                            event.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            event.status === 'pending_review' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                            'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {event.status === 'pending_review' ? 'Pending' : event.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            <button
                              onClick={() => handleToggleBadge(event.id, 'is_sponsored')}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                                event.is_sponsored
                                  ? 'bg-purple-600 text-white border-purple-500'
                                  : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                              }`}
                              title="Toggle Sponsored Badge"
                            >
                              Sponsored
                            </button>
                          </div>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {event.status === 'pending_review' && (
                            <>
                              <button onClick={() => handleApproveEvent(event.id)} className="p-1.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/40 rounded-lg transition-colors" title="Approve">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleRejectEvent(event.id)} className="p-1.5 bg-red-600/20 text-red-400 hover:bg-red-600/40 rounded-lg transition-colors" title="Reject">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button onClick={() => handleDeleteEvent(event.id)} className="p-1.5 bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg transition-colors" title="Delete Event">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: USER MANAGEMENT ─────────────────────────────────────── */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search user by name or email…"
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={e => setUserRoleFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="parent">Parent</option>
                <option value="admin">Organizer</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-4">User Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Joined Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Role Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-slate-850/50 transition-colors">
                        <td className="p-4 font-bold text-white">{u.name}</td>
                        <td className="p-4 font-mono text-slate-400">{u.email}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            u.role === 'super_admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                            u.role === 'admin' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {u.role === 'super_admin' ? '⚡ Super Admin' : u.role === 'admin' ? '🎪 Organizer' : '👪 Parent'}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-[11px]">{u.joined_at}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.status === 'active' ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handlePromoteUser(u.id, u.role === 'parent' ? 'admin' : u.role === 'admin' ? 'super_admin' : 'parent')}
                            className="px-2.5 py-1 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 font-bold rounded-lg transition-colors text-[11px]"
                            title="Promote Role"
                          >
                            Change Role
                          </button>
                          <button
                            onClick={() => handleToggleUserStatus(u.id, u.status)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg transition-colors text-[11px]"
                          >
                            {u.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: CATEGORIES ──────────────────────────────────────────── */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <h3 className="font-bold text-white text-sm">Event Categories ({categories.length})</h3>
              <button
                onClick={() => setShowAddCat(v => !v)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Category
              </button>
            </div>

            {showAddCat && (
              <form onSubmit={handleAddCategory} className="bg-slate-900 border border-purple-500/40 p-5 rounded-2xl space-y-4">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider">New Category Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Category Name (e.g. Robotics)"
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Icon Emoji (e.g. 🤖)"
                    value={newCatIcon}
                    onChange={e => setNewCatIcon(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={newCatDesc}
                    onChange={e => setNewCatDesc(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowAddCat(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl text-xs">Save Category</button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(cat => (
                <div key={cat.name} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                      <h4 className="font-bold text-white text-sm">{cat.name}</h4>
                      <p className="text-[11px] text-slate-400">{cat.description}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteCategory(cat.name)} className="text-slate-500 hover:text-red-400 p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 5: BOOKINGS & PAYOUTS ──────────────────────────────────── */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="font-extrabold text-white text-base">Booking & Revenue Summary</h3>
              <p className="text-slate-400 text-xs">View all ticket sales, booking references, and platform payout metrics across organizers.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-slate-400 text-xs">Total Tickets Sold</span>
                  <div className="text-2xl font-bold text-white mt-1">42 Seats</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-slate-400 text-xs">Gross Platform Revenue</span>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">₹18,450</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-slate-400 text-xs">Est. Platform Commission (10%)</span>
                  <div className="text-2xl font-bold text-purple-400 mt-1">₹1,845</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 6: SETTINGS ────────────────────────────────────────────── */}
        {activeTab === 'settings' && (
          <div className="space-y-6 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <h3 className="font-extrabold text-white text-base">Platform Rules & Settings</h3>
            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div>
                  <p className="font-bold text-white">Require Manual Approval for New Event Listings</p>
                  <p className="text-slate-400 text-[11px]">When enabled, all newly created events require staff review before public display.</p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-bold rounded-full text-[10px]">ACTIVE</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div>
                  <p className="font-bold text-white">Default Organizer Commission Fee</p>
                  <p className="text-slate-400 text-[11px]">Percentage retained by platform on ticket bookings.</p>
                </div>
                <span className="font-bold text-purple-400 text-sm">10.0%</span>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
