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
  Eye,
  LineChart
} from 'lucide-react';
import Link from 'next/link';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { dbService as db } from '@/services/db';
import { Event, Booking } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

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

  // Simulated platform growth trend (last 4 weeks)
  const growthTrend = [
    { label: 'Week 1', signups: 12, bookings: 18 },
    { label: 'Week 2', signups: 19, bookings: 27 },
    { label: 'Week 3', signups: 26, bookings: 39 },
    { label: 'Week 4', signups: 34, bookings: 52 },
  ];
  const maxGrowth = 60;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">

      {/* ── Sidebar Nav ────────────────────────────────────────────────── */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 shrink-0 p-6 flex flex-col justify-between shadow-sm">
        <div>
          {/* Platform Branding */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-extrabold shadow-md shadow-purple-500/20 text-lg">
              ⚡
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-card-title leading-tight">Kidspire Admin</h2>
              <span className="text-micro font-bold uppercase tracking-wider text-purple-700 bg-purple-100 border border-purple-200 px-2 py-0.5 rounded-full">
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
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-caption font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                      : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span className="bg-amber-500 text-white font-bold text-micro px-2 py-0.5 rounded-full animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card at Bottom of Sidebar */}
        <div className="pt-6 border-t border-slate-200 mt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 border border-purple-200 text-purple-700 font-bold flex items-center justify-center text-caption">
              SA
            </div>
            <div className="truncate">
              <p className="text-caption font-bold text-slate-900 truncate">Super Admin</p>
              <p className="text-micro text-slate-500 font-mono">admin@kidspire.com</p>
            </div>
          </div>
          <Link
            href="/"
            title="Exit to Website"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </aside>

      {/* ── Main Panel Content ─────────────────────────────────────────────── */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">

        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-page-title font-bold text-slate-900 capitalize flex items-center gap-3">
              {activeTab === 'overview' && 'Platform Overview'}
              {activeTab === 'events' && 'Events & Listing Approvals'}
              {activeTab === 'users' && 'User Management & Roles'}
              {activeTab === 'categories' && 'Category Taxonomy'}
              {activeTab === 'bookings' && 'Bookings & Financial Records'}
              {activeTab === 'settings' && 'Platform Configuration'}
            </h1>
            <p className="text-slate-500 text-caption mt-1">
              Manage platform events, parent accounts, organizers, and financial payout logs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/super-admin/events/new"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-caption hover:bg-purple-700 transition-all shadow-md shadow-purple-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </Link>

            <button
              onClick={loadAllAdminData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-caption font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-purple-600' : ''}`} />
              <span>Refresh Data</span>
            </button>

            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 border border-purple-200 text-caption font-semibold text-purple-700 hover:bg-purple-100 transition-all"
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
              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase text-slate-500">Total Users</span>
                  <div className="p-3 bg-purple-100 text-purple-700 rounded-2xl">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900">{users.length}</div>
                <p className="text-[11px] text-slate-500 mt-2">Active parents & event organizers</p>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase text-slate-500">Total Events</span>
                  <div className="p-3 bg-indigo-100 text-indigo-700 rounded-2xl">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900">{events.length}</div>
                <p className="text-[11px] text-slate-500 mt-2">{approvedEvents.length} approved, {pendingEvents.length} pending</p>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase text-slate-500">Pending Review</span>
                  <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-amber-600">{pendingEvents.length}</div>
                <p className="text-[11px] text-slate-500 mt-2">Awaiting approval action</p>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase text-slate-500">Est. Platform GMV</span>
                  <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-emerald-700">₹{totalRevenue.toLocaleString()}</div>
                <p className="text-[11px] text-slate-500 mt-2">Total gross ticket bookings</p>
              </div>
            </div>

            {/* Platform Growth Chart Card */}
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" /> Platform Growth & Monthly Volume
                  </h3>
                  <p className="text-caption text-slate-500">Weekly user signups and ticket bookings</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-1 text-purple-700"><span className="w-3 h-3 bg-purple-600 rounded-full inline-block" /> Bookings</span>
                  <span className="flex items-center gap-1 text-indigo-700"><span className="w-3 h-3 bg-indigo-400 rounded-full inline-block" /> Signups</span>
                </div>
              </div>

              <div className="h-44 flex items-end gap-6 pt-6 pb-2 px-4 border-b border-slate-200">
                {growthTrend.map((g, idx) => {
                  const bPct = Math.round((g.bookings / maxGrowth) * 100);
                  const sPct = Math.round((g.signups / maxGrowth) * 100);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full flex justify-center items-end gap-2 h-full">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${sPct}%` }}
                          transition={{ duration: 0.5, delay: idx * 0.1 }}
                          className="w-1/2 max-w-[24px] bg-indigo-300 rounded-t"
                          title={`Signups: ${g.signups}`}
                        />
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${bPct}%` }}
                          transition={{ duration: 0.5, delay: idx * 0.1 + 0.05 }}
                          className="w-1/2 max-w-[24px] bg-purple-600 rounded-t"
                          title={`Bookings: ${g.bookings}`}
                        />
                      </div>
                      <span className="text-micro font-semibold text-slate-500">{g.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Pending Approvals Callout */}
            {pendingEvents.length > 0 && (
              <div className="bg-amber-50/60 border border-amber-200 p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-amber-900 text-body-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    New Event Submission Approvals ({pendingEvents.length})
                  </h3>
                  <button onClick={() => setActiveTab('events')} className="text-caption text-amber-700 font-bold hover:underline">
                    View All Events →
                  </button>
                </div>

                <div className="space-y-3">
                  {pendingEvents.map(evt => (
                    <div key={evt.id} className="bg-white p-4 rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                      <div>
                        <h4 className="font-bold text-slate-900 text-body">{evt.title}</h4>
                        <p className="text-caption text-slate-500">{evt.organizer?.name || 'Organizer'} • {evt.category} • {evt.location}</p>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleApproveEvent(evt.id)}
                          className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-caption flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <CheckCircle className="w-4 h-4" /> Approve
                        </button>
                        <button
                          onClick={() => handleRejectEvent(evt.id)}
                          className="flex-1 sm:flex-none px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-xl text-caption flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: EVENTS & APPROVALS ──────────────────────────────────── */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            {/* Search & Filter bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by title, category, or city…"
                  value={eventSearch}
                  onChange={e => setEventSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-caption text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={eventStatusFilter}
                  onChange={e => setEventStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-caption font-semibold text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Events Table */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-caption text-slate-700">
                  <thead className="bg-slate-100/70 text-slate-600 font-bold uppercase tracking-wider text-micro border-b border-slate-200">
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
                  <tbody className="divide-y divide-slate-100">
                    {filteredEvents.map(event => (
                      <tr key={event.id} className="hover:bg-purple-50/30 transition-colors">
                        <td className="p-4 font-bold text-slate-900 max-w-[200px]">
                          <p className="truncate">{event.title}</p>
                          <p className="text-micro text-slate-500 font-normal">{event.organizer?.name || 'Organizer'}</p>
                        </td>
                        <td className="p-4">{event.category}</td>
                        <td className="p-4">{event.location}</td>
                        <td className="p-4 font-mono text-micro">
                          {event.event_date}
                        </td>
                        <td className="p-4 font-bold text-slate-900">₹{event.price}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-micro font-extrabold ${
                            event.status === 'approved' ? 'bg-green-100 text-green-800 border border-green-200' :
                            event.status === 'pending_review' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                            'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            {event.status === 'pending_review' ? 'Pending' : event.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1.5 items-center">
                            <span className="px-2 py-0.5 rounded text-micro font-bold bg-purple-100 text-purple-800 border border-purple-200">
                              Added by Admin
                            </span>
                            <button
                              onClick={() => handleToggleBadge(event.id, 'is_sponsored')}
                              className={`px-2 py-0.5 rounded text-micro font-bold border transition-colors cursor-pointer ${
                                event.is_sponsored
                                  ? 'bg-purple-600 text-white border-purple-600'
                                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:border-purple-300'
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
                              <button onClick={() => handleApproveEvent(event.id)} className="p-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors cursor-pointer" title="Approve">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleRejectEvent(event.id)} className="p-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors cursor-pointer" title="Reject">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button onClick={() => handleDeleteEvent(event.id)} className="p-1.5 bg-slate-100 text-slate-500 hover:text-red-600 rounded-lg transition-colors cursor-pointer" title="Delete Event">
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
            <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search user by name or email…"
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-caption text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={e => setUserRoleFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-caption font-semibold text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="parent">Parent</option>
                <option value="admin">Organizer</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-caption text-slate-700">
                  <thead className="bg-slate-100/70 text-slate-600 font-bold uppercase tracking-wider text-micro border-b border-slate-200">
                    <tr>
                      <th className="p-4">User Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Joined Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Role Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-purple-50/30 transition-colors">
                        <td className="p-4 font-bold text-slate-900">{u.name}</td>
                        <td className="p-4 font-mono text-slate-500">{u.email}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-micro font-bold ${
                            u.role === 'super_admin' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                            u.role === 'admin' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {u.role === 'super_admin' ? '⚡ Super Admin' : u.role === 'admin' ? '🎪 Organizer' : '👪 Parent'}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-micro">{u.joined_at}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-micro font-bold ${
                            u.status === 'active' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handlePromoteUser(u.id, u.role === 'parent' ? 'admin' : u.role === 'admin' ? 'super_admin' : 'parent')}
                            className="px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold rounded-lg transition-colors text-micro cursor-pointer"
                            title="Promote Role"
                          >
                            Change Role
                          </button>
                          <button
                            onClick={() => handleToggleUserStatus(u.id, u.status)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors text-micro cursor-pointer"
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
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 text-body">Event Categories ({categories.length})</h3>
              <button
                onClick={() => setShowAddCat(v => !v)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-caption flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Category
              </button>
            </div>

            {showAddCat && (
              <form onSubmit={handleAddCategory} className="bg-white border border-purple-200 p-5 rounded-2xl space-y-4 shadow-sm">
                <h4 className="font-bold text-slate-900 text-caption uppercase tracking-wider">New Category Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Category Name (e.g. Robotics)"
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-caption text-slate-900 placeholder-slate-400"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Icon Emoji (e.g. 🤖)"
                    value={newCatIcon}
                    onChange={e => setNewCatIcon(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-caption text-slate-900 placeholder-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={newCatDesc}
                    onChange={e => setNewCatDesc(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-caption text-slate-900 placeholder-slate-400"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowAddCat(false)} className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-caption">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl text-caption">Save Category</button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(cat => (
                <div key={cat.name} className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-body">{cat.name}</h4>
                      <p className="text-caption text-slate-500">{cat.description}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteCategory(cat.name)} className="text-slate-400 hover:text-red-600 p-2 cursor-pointer">
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
            <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm">
              <h3 className="font-extrabold text-slate-900 text-body-lg">Booking & Revenue Summary</h3>
              <p className="text-slate-500 text-caption">View all ticket sales, booking references, and platform payout metrics across organizers.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="text-slate-500 text-caption">Total Tickets Sold</span>
                  <div className="text-2xl font-bold text-slate-900 mt-1">42 Seats</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="text-slate-500 text-caption">Gross Platform Revenue</span>
                  <div className="text-2xl font-bold text-emerald-700 mt-1">₹18,450</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="text-slate-500 text-caption">Est. Platform Commission (10%)</span>
                  <div className="text-2xl font-bold text-purple-700 mt-1">₹1,845</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 6: SETTINGS ────────────────────────────────────────────── */}
        {activeTab === 'settings' && (
          <div className="space-y-6 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
            <h3 className="font-extrabold text-slate-900 text-body-lg">Platform Rules & Settings</h3>
            <div className="space-y-4 text-caption text-slate-700">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <p className="font-bold text-slate-900">Require Manual Approval for New Event Listings</p>
                  <p className="text-slate-500 text-caption">When enabled, all newly created events require staff review before public display.</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 font-bold rounded-full text-micro border border-green-200">ACTIVE</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <p className="font-bold text-slate-900">Default Organizer Commission Fee</p>
                  <p className="text-slate-500 text-caption">Percentage retained by platform on ticket bookings.</p>
                </div>
                <span className="font-bold text-purple-700 text-body">10.0%</span>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
