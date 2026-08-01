import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';

export const dynamic = 'force-dynamic';

/**
 * GET /api/cron/event-reminders
 *
 * Automated Vercel Cron Job running daily at 8:00 AM UTC (1:30 PM IST).
 * 1. Queries all confirmed bookings with events occurring tomorrow (~24h away).
 * 2. Writes in-app reminder notifications.
 * 3. Dispatches 24h event reminder emails via Resend API.
 */
export async function GET(req: NextRequest) {
  try {
    // Optional Vercel Cron Secret authorization check
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized cron trigger' }, { status: 401 });
    }

    // Calculate tomorrow's date string (YYYY-MM-DD)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const supabase = createClient();
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    // Fetch active bookings
    const { data: bookings, error: bkgErr } = await supabase
      .from('bookings')
      .select('*')
      .eq('status', 'confirmed');

    if (bkgErr || !bookings) {
      return NextResponse.json({ error: 'Failed to fetch bookings', details: bkgErr?.message }, { status: 500 });
    }

    let processedCount = 0;
    let emailsSentCount = 0;

    for (const b of bookings) {
      // Fetch associated event, child, and parent
      const { data: event } = await supabase.from('events').select('*').eq('id', b.event_id).single();
      if (!event || event.event_date !== tomorrowStr) continue;

      processedCount++;

      const { data: child } = await supabase.from('children').select('*').eq('id', b.child_id).single();
      const { data: parent } = await supabase.from('parents').select('*').eq('id', b.parent_id).single();

      const eventTitle = event.title;
      const eventTime = event.event_time || 'Check listing details';
      const eventLocation = event.location || 'Online';
      const childName = child?.name || 'Your child';
      const parentEmail = parent?.email;
      const parentName = parent?.name || 'Parent';
      const bookingRef = b.booking_reference;

      // ── 1. Write In-App Notification ──────────────────────────────────────
      await supabase.from('notifications').insert([{
        parent_id: b.parent_id,
        title: `Event Tomorrow! ⏰`,
        message: `Reminder: "${eventTitle}" for ${childName} is tomorrow at ${eventTime}. Location: ${eventLocation}`,
        type: 'info',
        read: false,
      }]);

      // ── 2. Send 24h Reminder Email via Resend ─────────────────────────────
      if (RESEND_API_KEY && parentEmail) {
        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; margin: 0; padding: 40px 20px;">
            <div style="max-width: 580px; margin: 0 auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
              
              <div style="background: linear-gradient(135deg, #d97706, #b45309); padding: 40px 40px 32px; text-align: center;">
                <h1 style="color: white; font-size: 28px; font-weight: 900; margin: 0 0 8px;">Kidspire</h1>
                <p style="color: #fef3c7; font-size: 15px; margin: 0;">Event Tomorrow! ⏰</p>
              </div>

              <div style="padding: 40px;">
                <p style="font-size: 17px; color: #1e293b; margin: 0 0 24px;">Hi ${parentName},</p>
                <p style="color: #475569; line-height: 1.6; margin: 0 0 32px;">
                  This is a friendly reminder that <strong>${childName}</strong> is scheduled to attend <strong>"${eventTitle}"</strong> tomorrow!
                </p>

                <div style="background: #f8fafc; border-radius: 16px; padding: 24px; margin-bottom: 32px; border: 1px solid #e2e8f0;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; width: 130px;">Event</td><td style="padding: 8px 0; color: #1e293b; font-weight: 700; font-size: 16px;">${eventTitle}</td></tr>
                    <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Child</td><td style="padding: 8px 0; color: #1e293b; font-weight: 600;">${childName}</td></tr>
                    <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Date</td><td style="padding: 8px 0; color: #d97706; font-weight: 700;">Tomorrow (${tomorrowStr})</td></tr>
                    <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Time</td><td style="padding: 8px 0; color: #1e293b; font-weight: 600;">${eventTime}</td></tr>
                    <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Location</td><td style="padding: 8px 0; color: #1e293b;">${eventLocation}</td></tr>
                    <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Ref No.</td><td style="padding: 8px 0; color: #1e293b; font-family: monospace; font-weight: 700; font-size: 15px;">${bookingRef}</td></tr>
                  </table>
                </div>

                <div style="text-align: center; margin-bottom: 32px;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/parent" 
                     style="display: inline-block; background: #7c3aed; color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 700; font-size: 15px;">
                    View Digital Ticket →
                  </a>
                </div>

                <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; color: #94a3b8; font-size: 13px; line-height: 1.6;">
                  <p>Please arrive 10 minutes early for check-in. Visit your <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/parent" style="color: #7c3aed;">dashboard</a> to view your ticket QR code.</p>
                  <p style="margin-top: 16px;">Questions? Email us at <a href="mailto:support@kidspire.com" style="color: #7c3aed;">support@kidspire.com</a></p>
                  <p style="margin-top: 16px; color: #cbd5e1;">© ${new Date().getFullYear()} Kidspire. Making weekends special.</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `;

        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Kidspire <noreply@kidspire.com>',
            to: [parentEmail],
            subject: `⏰ Reminder: ${eventTitle} is tomorrow! — Ref ${bookingRef}`,
            html: emailHtml,
          }),
        });

        if (res.ok) emailsSentCount++;
      }
    }

    return NextResponse.json({
      success: true,
      processed: processedCount,
      emailsSent: emailsSentCount,
      targetDate: tomorrowStr,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[cron/event-reminders]', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
