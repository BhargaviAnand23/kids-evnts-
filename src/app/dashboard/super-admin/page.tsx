"use client";
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { dbService as db } from '@/services/db';
import { Event } from '@/types';

export default function SuperAdminDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const allEvents = await db.getEvents({ status: 'all' });
      setEvents(allEvents);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm('Are you sure you want to approve this event?')) return;
    try {
      await db.updateEventStatus(id, 'approved');
      loadEvents();
    } catch (error) {
      console.error(error);
      alert('Failed to approve event');
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Please enter a rejection reason:');
    if (reason === null) return; // User cancelled
    
    try {
      await db.updateEventStatus(id, 'rejected', reason || 'No reason provided');
      loadEvents();
    } catch (error) {
      console.error(error);
      alert('Failed to reject event');
    }
  };

  const pendingEvents = events.filter(e => e.status === 'pending_review');
  const otherEvents = events.filter(e => e.status !== 'pending_review');

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 flex items-center">
            <LayoutDashboard className="w-8 h-8 mr-3 text-purple-600" /> Super Admin Dashboard
          </h1>
        </div>

        <div className="space-y-8">
          {/* Pending Events */}
          <Card className="border-orange-200 shadow-md">
            <CardHeader className="bg-orange-50 border-b border-orange-100 pb-4">
              <CardTitle className="text-orange-800 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Pending Review ({pendingEvents.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <p className="text-slate-500">Loading...</p>
              ) : pendingEvents.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No events pending review.</p>
              ) : (
                <div className="space-y-4">
                  {pendingEvents.map((event) => (
                    <div key={event.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-slate-200 rounded-xl bg-white gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-slate-900">{event.title}</h3>
                          <Badge variant="warning">Pending</Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-1">
                          {event.organizer?.name || 'Unknown Organizer'} • {event.category} • {event.location}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(event.event_date).toLocaleDateString()} at {event.event_time}
                        </p>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="outline" className="flex-1 md:flex-none border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleReject(event.id)}>
                          <XCircle className="w-4 h-4 mr-2" /> Reject
                        </Button>
                        <Button className="flex-1 md:flex-none bg-green-600 hover:bg-green-700" onClick={() => handleApprove(event.id)}>
                          <CheckCircle className="w-4 h-4 mr-2" /> Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* All Other Events */}
          <Card>
            <CardHeader>
              <CardTitle>All Processed Events ({otherEvents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-slate-500">Loading...</p>
              ) : otherEvents.length === 0 ? (
                <p className="text-slate-500 py-4">No processed events found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                      <tr>
                        <th className="px-4 py-3">Event</th>
                        <th className="px-4 py-3">Organizer</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {otherEvents.map((event) => (
                        <tr key={event.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium text-slate-900">{event.title}</td>
                          <td className="px-4 py-3 text-slate-600">{event.organizer?.name}</td>
                          <td className="px-4 py-3 text-slate-600">{new Date(event.event_date).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <Badge variant={event.status === 'approved' ? 'success' : 'default'} className={event.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}>
                              {event.status === 'approved' ? 'Approved' : 'Rejected'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            {event.status === 'rejected' && (
                              <Button variant="outline" size="sm" onClick={() => handleApprove(event.id)}>
                                Approve Now
                              </Button>
                            )}
                            {event.status === 'approved' && (
                              <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleReject(event.id)}>
                                Revoke
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
