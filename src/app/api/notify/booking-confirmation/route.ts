import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';

/**
 * POST /api/notify/booking-confirmation
 *
 * Called immediately after a booking is created.
 * 1. Inserts an in-app notification into the notifications table.
 * 2. Sends a booking confirmation email via Resend (if RESEND_API_KEY is configured).
 *    If no key is set, step 2 is silently skipped — in-app notification is always written.
 *
 * Body: {
 *   parentId: string,
 *   parentEmail: string,
 *   parentName: string,
 *   eventTitle: string,
 *   eventDate: string,
 *   eventTime: string,
 *   eventLocation: string,
 *   childName: string,
 *   bookingReference: string,
 *   paidAmount?: number,
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      parentId,
      parentEmail,
      parentName,
      eventTitle,
      eventDate,
      eventTime,
      eventLocation,
      childName,
      bookingReference,
      paidAmount,
    } = body;

    if (!parentId || !bookingReference || !eventTitle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const formattedDate = eventDate
      ? new Date(eventDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
      : eventDate;

    // ── 1. In-app notification ───────────────────────────────────────────────
    // Use service-role or anon key — anon is fine since policy allows system inserts
    const supabase = createClient();
    await supabase.from('notifications').insert([{
      parent_id: parentId,
      title: `Booking confirmed! 🎉`,
      message: `Your spot for "${eventTitle}" on ${formattedDate} has been booked for ${childName}. Ref: ${bookingReference}`,
      type: 'success',
      read: false,
    }]);

    // ── 2. Email via Resend (optional — requires RESEND_API_KEY in env) ──────
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    let emailSent = false;

    if (RESEND_API_KEY && parentEmail) {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; margin: 0; padding: 40px 20px;">
          <div style="max-width: 580px; margin: 0 auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
            
            <div style="background: linear-gradient(135deg, #7c3aed, #6d28d9); padding: 40px 40px 32px; text-align: center;">
              <h1 style="color: white; font-size: 28px; font-weight: 900; margin: 0 0 8px;">Kidspire</h1>
              <p style="color: #ddd6fe; font-size: 15px; margin: 0;">Your booking is confirmed! 🎉</p>
            </div>

            <div style="padding: 40px;">
              <p style="font-size: 17px; color: #1e293b; margin: 0 0 24px;">Hi ${parentName || 'there'},</p>
              <p style="color: #475569; line-height: 1.6; margin: 0 0 32px;">
                Great news — your spot has been confirmed. Here are your booking details:
              </p>

              <div style="background: #f8fafc; border-radius: 16px; padding: 24px; margin-bottom: 32px; border: 1px solid #e2e8f0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; width: 130px;">Event</td><td style="padding: 8px 0; color: #1e293b; font-weight: 700; font-size: 16px;">${eventTitle}</td></tr>
                  <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Child</td><td style="padding: 8px 0; color: #1e293b; font-weight: 600;">${childName || '—'}</td></tr>
                  <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Date</td><td style="padding: 8px 0; color: #1e293b;">${formattedDate}</td></tr>
                  <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Time</td><td style="padding: 8px 0; color: #1e293b;">${eventTime || '—'}</td></tr>
                  <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Location</td><td style="padding: 8px 0; color: #1e293b;">${eventLocation || '—'}</td></tr>
                  ${paidAmount ? `<tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Paid</td><td style="padding: 8px 0; color: #059669; font-weight: 700;">₹${paidAmount}</td></tr>` : ''}
                  <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Ref No.</td><td style="padding: 8px 0; color: #1e293b; font-family: monospace; font-weight: 700; font-size: 15px;">${bookingReference}</td></tr>
                </table>
              </div>

              <div style="text-align: center; margin-bottom: 32px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/parent" 
                   style="display: inline-block; background: #7c3aed; color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 700; font-size: 15px;">
                  View My Ticket →
                </a>
              </div>

              <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; color: #94a3b8; font-size: 13px; line-height: 1.6;">
                <p>If you need to cancel, please do so at least 48 hours before the event for a full refund. Visit your <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/parent" style="color: #7c3aed;">dashboard</a> to manage bookings.</p>
                <p style="margin-top: 16px;">Questions? Email us at <a href="mailto:support@kidspire.com" style="color: #7c3aed;">support@kidspire.com</a></p>
                <p style="margin-top: 16px; color: #cbd5e1;">© ${new Date().getFullYear()} Kidspire. Making weekends special.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Kidspire <noreply@kidspire.com>',
          to: [parentEmail],
          subject: `✅ Booking confirmed: ${eventTitle} — Ref ${bookingReference}`,
          html: emailHtml,
        }),
      });
      emailSent = resendRes.ok;
    }

    return NextResponse.json({
      success: true,
      inAppNotification: true,
      emailSent,
      emailSkipped: !RESEND_API_KEY || !parentEmail,
    });
  } catch (err: any) {
    console.error('[notify/booking-confirmation]', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
