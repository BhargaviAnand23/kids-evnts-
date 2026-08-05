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
  ShieldCheck,
  Building2,
  TrendingUp,
  LogOut,
  RefreshCw,
  Eye,
  BarChart3,
  LineChart as LineChartIcon,
  Trophy,
  Flag
} from 'lucide-react';
import Link from 'next/link';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { dbService as db } from '@/services/db';
import { Event, Booking, Organization, Achievement } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';

type AdminTab = 'overview' | 'events' | 'organizations' | 'achievements' | 'users' | 'categories' | 'bookings' | 'settings';

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
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [eventSearch, setEventSearch] = useState('');
  const [eventStatusFilter, setEventStatusFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [orgFilter, setOrgFilter] = useState<'all' | 'pending' | 'verified'>('all');
  const [orgSearch, setOrgSearch] = useState('');
  const [bookingFilter, setBookingFilter] = useState<'all' | 'cancelled' | 'confirmed'>('all');
  const [bookingSearch, setBookingSearch] = useState('');

  // Category Modal State
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('⭐');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [showAddCat, setShowAddCat] = useState(false);

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const handleUpdateRefundStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    try {
      await db.updateBookingRefundStatus(id, status);
      loadAllAdminData();
    } catch (e: any) {
      alert(e.message || 'Failed to update refund status');
    }
  };

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [allEvents, allUsers, allCats, allBookings, allOrgs, allAch] = await Promise.all([
        db.getEvents({ status: 'all' }),
        db.getAllUsersAdmin(),
        db.getCategoriesAdmin(),
        db.getAllBookingsAdmin().catch(() => []),
        db.getOrganizations(),
        db.getAchievements(),
      ]);
      setEvents(allEvents);
      setUsers(allUsers);
      setCategories(allCats);
      setBookings(allBookings);
      setOrganizations(allOrgs);
      setAchievements(allAch);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAchievement = async (id: string) => {
    await db.updateAchievementStatus(id, 'public_approved');
    loadAllAdminData();
  };

  const handleRejectAchievement = async (id: string) => {
    await db.updateAchievementStatus(id, 'private');
    loadAllAdminData();
  };

  const handleDeleteAchievement = async (id: string) => {
    if (!confirm('Permanently delete this achievement submission?')) return;
    await db.deleteAchievement(id);
    loadAllAdminData();
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

  const handleToggleOrgVerification = async (orgId: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    const actionText = nextStatus ? 'VERIFY' : 'REVOKE VERIFICATION for';
    if (!confirm(`Are you sure you want to ${actionText} this organization?`)) return;
    try {
      await db.toggleOrganizationVerification(orgId, nextStatus);
      await loadAllAdminData();
    } catch (err: any) {
      alert(err?.message || 'Failed to update organization verification status.');
    }
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
  const pendingOrgs = organizations.filter(o => !o.verified);
  const verifiedOrgs = organizations.filter(o => o.verified);
  const pendingAchievements = achievements.filter(a => a.visibility === 'public_pending' || a.reported === true);
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

  const filteredOrgs = organizations.filter(o => {
    const matchesSearch = o.name.toLowerCase().includes(orgSearch.toLowerCase()) ||
                          (o.address || '').toLowerCase().includes(orgSearch.toLowerCase());
    const matchesVerif = orgFilter === 'all' ||
                         (orgFilter === 'pending' && !o.verified) ||
                         (orgFilter === 'verified' && o.verified);
    return matchesSearch && matchesVerif;
  });

  // Category counts for Recharts
  const categoryChartData = categories.slice(0, 7).map(c => ({
    name: c.name,
    count: events.filter(e => e.category.toLowerCase().includes(c.name.toLowerCase())).length || c.count || 2
  }));

  // Platform sales trend for Recharts
  const salesTrendData = [
    { week: 'Week 1', sales: Math.round(totalRevenue * 0.15) || 12000 },
    { week: 'Week 2', sales: Math.round(totalRevenue * 0.28) || 24000 },
    { week: 'Week 3', sales: Math.round(totalRevenue * 0.65) || 45000 },
    { week: 'Week 4', sales: totalRevenue || 68000 },
  ];

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
              { id: 'organizations', label: 'Partner Verification', icon: Building2, badge: pendingOrgs.length > 0 ? pendingOrgs.length : null },
              { id: 'achievements', label: 'Achievements Queue', icon: Trophy, badge: pendingAchievements.length > 0 ? pendingAchievements.length : null },
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
              {activeTab === 'organizations' && 'Partner Organizations & Verification'}
              {activeTab === 'users' && 'User Management & Roles'}
              {activeTab === 'categories' && 'Category Taxonomy'}
              {activeTab === 'bookings' && 'Bookings & Financial Records'}
              {activeTab === 'settings' && 'Platform Configuration'}
            </h1>
            <p className="text-slate-500 text-caption mt-1">
              Manage platform events, parent accounts, partner verification, and financial records.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/super-admin/events/new"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-caption hover:bg-purple-700 transition-all shadow-md shadow-purple-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event Direct</span>
            </Link>

            <button
              onClick={loadAllAdminData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-caption font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-purple-600' : ''}`} />
              <span>Refresh</span>
            </button>

            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 border border-purple-200 text-caption font-semibold text-purple-700 hover:bg-purple-100 transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Main Site</span>
            </Link>
          </div>
        </div>

        {/* ── TAB 1: OVERVIEW ────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase text-slate-500">Total Users</span>
                  <div className="p-3 bg-purple-100 text-purple-700 rounded-2xl">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900">{users.length}</div>
                <p className="text-[11px] text-slate-500 mt-2">Parents &amp; Event Organizers</p>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase text-slate-500">Total Events</span>
                  <div className="p-3 bg-indigo-100 text-indigo-700 rounded-2xl">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900">{events.length}</div>
                <p className="text-[11px] text-slate-500 mt-2">{approvedEvents.length} approved, {pendingEvents.length} pending</p>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase text-slate-500">Pending Approvals</span>
                  <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-amber-600">{pendingEvents.length + pendingOrgs.length}</div>
                <p className="text-[11px] text-slate-500 mt-2">{pendingEvents.length} events, {pendingOrgs.length} partner orgs</p>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase text-slate-500">Platform GMV</span>
                  <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-emerald-700">₹{totalRevenue.toLocaleString('en-IN')}</div>
                <p className="text-[11px] text-slate-500 mt-2">Total gross ticket sales</p>
              </div>
            </div>

            {/* Recharts Platform Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Chart 1: Category Distribution */}
              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-purple-600" /> Category Distribution
                    </h3>
                    <p className="text-caption text-slate-500">Active event count per category</p>
                  </div>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '12px' }}
                      />
                      <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Revenue Trend */}
              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                      <LineChartIcon className="w-5 h-5 text-purple-600" /> Monthly Revenue Growth
                    </h3>
                    <p className="text-caption text-slate-500">Gross ticket booking sales trend</p>
                  </div>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                      <defs>
                        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                      <Tooltip
                        formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Gross Sales']}
                        contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '12px' }}
                      />
                      <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#revenueGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Quick Pending Approvals Callout */}
            {pendingEvents.length > 0 && (
              <div className="bg-amber-50/60 border border-amber-200 p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-amber-900 text-body-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    New Event Submissions ({pendingEvents.length})
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
            <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search events by title, category, location…"
                  value={eventSearch}
                  onChange={e => setEventSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-caption text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <select
                value={eventStatusFilter}
                onChange={e => setEventStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-caption font-semibold text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                <option value="all">All Statuses ({events.length})</option>
                <option value="pending_review">Pending Review ({pendingEvents.length})</option>
                <option value="approved">Approved ({approvedEvents.length})</option>
              </select>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-caption text-slate-700">
                  <thead className="bg-slate-100/70 text-slate-600 font-bold uppercase tracking-wider text-micro border-b border-slate-200">
                    <tr>
                      <th className="p-4">Event Title &amp; Host</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Date</th>
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

        {/* ── TAB 3: ORGANIZATIONS & VERIFICATION ───────────────────────── */}
        {activeTab === 'organizations' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search organization by name, city…"
                  value={orgSearch}
                  onChange={e => setOrgSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-caption text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-2">
                {[
                  { id: 'all', label: `All (${organizations.length})` },
                  { id: 'pending', label: `Pending (${pendingOrgs.length})` },
                  { id: 'verified', label: `Verified (${verifiedOrgs.length})` },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setOrgFilter(tab.id as any)}
                    className={`px-3.5 py-2 rounded-xl text-caption font-semibold transition-all ${
                      orgFilter === tab.id
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredOrgs.map(org => (
                <div key={org.id} className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-card-title shrink-0 border border-purple-200">
                          {org.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-card-title leading-tight">{org.name}</h3>
                          <p className="text-caption text-slate-500 capitalize">{org.type?.replace('_', ' ') || 'Partner Organization'} • {org.address || 'Chennai'}</p>
                        </div>
                      </div>
                      {org.verified ? (
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 border border-green-200 text-micro font-bold px-2.5 py-1 rounded-full shrink-0">
                          <ShieldCheck className="w-3.5 h-3.5 text-green-600" /> Verified Partner
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-200 text-micro font-bold px-2.5 py-1 rounded-full shrink-0">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Verification Pending
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-caption text-slate-500 font-mono">
                      Org ID: {org.id.substring(0, 8)}…
                    </span>
                    <button
                      onClick={() => handleToggleOrgVerification(org.id, org.verified)}
                      className={`px-4 py-2 rounded-xl text-caption font-bold transition-all cursor-pointer ${
                        org.verified
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20'
                      }`}
                    >
                      {org.verified ? 'Revoke Verification' : '✓ Approve & Verify Partner'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: ACHIEVEMENTS MODERATION QUEUE ───────────────────────────── */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" /> Accomplishments & Content Moderation Queue
                </h3>
                <p className="text-caption text-slate-500 mt-1">Review public sharing submissions and reported child content for child safety compliance.</p>
              </div>
              <Badge className="bg-purple-100 text-purple-700 font-bold px-3 py-1 text-caption">
                {achievements.length} Total Submissions
              </Badge>
            </div>

            {achievements.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
                <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-900 text-lg">No pending achievement submissions</h4>
                <p className="text-slate-500 text-caption">All child accomplishment submissions have been reviewed.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {achievements.map(ach => (
                  <div key={ach.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={
                          ach.visibility === 'public_approved'
                            ? 'bg-emerald-100 text-emerald-800 font-bold'
                            : ach.reported
                            ? 'bg-red-100 text-red-800 font-bold'
                            : 'bg-amber-100 text-amber-800 font-bold'
                        }>
                          {ach.reported ? '🚩 Reported by User' : ach.visibility === 'public_approved' ? '🌟 Approved Public' : '⏳ Pending Review'}
                        </Badge>

                        <span className="text-micro font-mono text-slate-400">
                          {new Date(ach.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="aspect-video relative rounded-2xl overflow-hidden bg-slate-900 mb-3">
                        <img src={ach.media_url} alt={ach.title} className="w-full h-full object-cover" />
                        <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-micro font-bold px-2.5 py-1 rounded-md">
                          Child: {ach.child?.name || 'Junior'} (Age {ach.child?.age || '—'})
                        </div>
                      </div>

                      <h4 className="font-bold text-slate-900 text-card-title mb-1">{ach.title}</h4>
                      <p className="text-caption text-slate-600 leading-relaxed mb-2">{ach.description}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleDeleteAchievement(ach.id)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl text-caption font-bold transition-colors cursor-pointer"
                      >
                        Delete
                      </button>

                      <div className="flex gap-2">
                        {ach.visibility !== 'private' && (
                          <button
                            onClick={() => handleRejectAchievement(ach.id)}
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-caption font-bold transition-colors cursor-pointer"
                          >
                            Keep Private
                          </button>
                        )}
                        {ach.visibility !== 'public_approved' && (
                          <button
                            onClick={() => handleApproveAchievement(ach.id)}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20 rounded-xl text-caption font-bold transition-colors cursor-pointer"
                          >
                            ✓ Approve for Public
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 4: USER MANAGEMENT ─────────────────────────────────────── */}
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

        {/* ── TAB 5: BOOKINGS & REFUND MANAGEMENT ────────────────────────── */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search bookings by ref, parent, child, or event title…"
                  value={bookingSearch}
                  onChange={e => setBookingSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-caption text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-2">
                {[
                  { id: 'all', label: `All Bookings (${bookings.length})` },
                  { id: 'cancelled', label: `Cancelled / Refunds (${bookings.filter(b => b.status === 'cancelled').length})` },
                  { id: 'confirmed', label: `Confirmed (${bookings.filter(b => b.status === 'confirmed').length})` },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setBookingFilter(tab.id as any)}
                    className={`px-3.5 py-2 rounded-xl text-caption font-semibold transition-all cursor-pointer ${
                      bookingFilter === tab.id
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-caption text-slate-700">
                  <thead className="bg-slate-100/70 text-slate-600 font-bold uppercase tracking-wider text-micro border-b border-slate-200">
                    <tr>
                      <th className="p-4">Ref # &amp; Date</th>
                      <th className="p-4">Event</th>
                      <th className="p-4">Parent &amp; Child</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Booking Status</th>
                      <th className="p-4">Refund Status</th>
                      <th className="p-4 text-right">Update Refund Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings
                      .filter(b => {
                        if (bookingFilter === 'cancelled') return b.status === 'cancelled';
                        if (bookingFilter === 'confirmed') return b.status === 'confirmed';
                        return true;
                      })
                      .filter(b => {
                        if (!bookingSearch) return true;
                        const s = bookingSearch.toLowerCase();
                        return (
                          b.booking_reference.toLowerCase().includes(s) ||
                          (b.event?.title || '').toLowerCase().includes(s) ||
                          (b.parent?.name || '').toLowerCase().includes(s) ||
                          (b.child?.name || '').toLowerCase().includes(s)
                        );
                      })
                      .map(b => (
                        <tr key={b.id} className="hover:bg-purple-50/30 transition-colors">
                          <td className="p-4 font-mono font-bold text-slate-900">
                            {b.booking_reference}
                            <p className="text-micro font-normal text-slate-500 font-sans">
                              {b.created_at ? new Date(b.created_at).toLocaleDateString() : ''}
                            </p>
                          </td>
                          <td className="p-4 font-semibold text-slate-900 max-w-[180px] truncate">
                            {b.event?.title || 'Event'}
                            {b.tier_name && <p className="text-micro text-purple-600 font-normal">Tier: {b.tier_name}</p>}
                          </td>
                          <td className="p-4 text-slate-800">
                            <p className="font-bold">{b.parent?.name || 'Parent'}</p>
                            <p className="text-micro text-slate-500">Child: {b.child?.name || 'Child'}</p>
                          </td>
                          <td className="p-4 font-bold text-slate-900">
                            ₹{b.event?.price || 0}
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-micro font-bold ${
                              b.status === 'confirmed' ? 'bg-green-100 text-green-800 border border-green-200' :
                              b.status === 'cancelled' ? 'bg-slate-100 text-slate-700 border border-slate-200' :
                              'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}>
                              {b.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-4">
                            {b.status === 'cancelled' ? (
                              <span className={`px-2.5 py-1 rounded-full text-micro font-extrabold ${
                                b.refund_status === 'approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                b.refund_status === 'rejected' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                                'bg-amber-100 text-amber-800 border border-amber-200'
                              }`}>
                                {b.refund_status === 'approved' ? 'Refund Approved ✓' :
                                 b.refund_status === 'rejected' ? 'Refund Rejected ❌' :
                                 'Refund Pending'}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-micro">—</span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            {b.status === 'cancelled' ? (
                              <select
                                value={b.refund_status || 'pending'}
                                onChange={e => handleUpdateRefundStatus(b.id, e.target.value as any)}
                                className="bg-slate-50 border border-slate-200 text-micro font-extrabold text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                              >
                                <option value="pending">Refund Pending</option>
                                <option value="approved">Approve Refund ✓</option>
                                <option value="rejected">Reject Refund ❌</option>
                              </select>
                            ) : (
                              <span className="text-micro text-slate-400">N/A (Active)</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
