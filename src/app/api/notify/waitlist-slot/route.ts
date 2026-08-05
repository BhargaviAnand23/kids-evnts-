import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';

/**
 * POST /api/notify/waitlist-slot
 *
 * Triggered when a booking is cancelled and a seat opens up for a waitlisted parent.
 * 1. Inserts an in-app notification for the next waitlisted parent with a 24h priority booking link.
 * 2. Dispatches an email via Resend (if RESEND_API_KEY is configured).
 *
 * Body: {
 *   parentId: string,
 *   parentEmail?: string,
 *   parentName?: string,
 *   eventTitle: string,
 *   eventId: string,
 *   childName?: string,
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
      eventId,
      childName,
    } = body;

    if (!parentId || !eventTitle || !eventId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const bookingUrl = `${appUrl}/events/${eventId}/book?priority=waitlist`;

    // ── 1. In-app notification ───────────────────────────────────────────────
    const supabase = createClient();
    await supabase.from('notifications').insert([{
      parent_id: parentId,
      title: 'Waitlist Spot Opened! 🌟',
      message: `A seat has opened up for "${eventTitle}"! Complete your booking within 24 hours: ${bookingUrl}`,
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
            
            <div style="background: linear-gradient(135deg, #7c3aed, #4c1d95); padding: 40px 40px 32px; text-align: center;">
              <h1 style="color: white; font-size: 28px; font-weight: 900; margin: 0 0 8px;">Kidspire</h1>
              <p style="color: #fef08a; font-size: 16px; font-weight: 700; margin: 0;">Waitlist Spot Available! 🌟</p>
            </div>

            <div style="padding: 40px;">
              <p style="font-size: 17px; color: #1e293b; margin: 0 0 24px;">Hi ${parentName || 'there'},</p>
              <p style="color: #475569; line-height: 1.6; margin: 0 0 24px;">
                Great news! A spot has just opened up for <strong style="color: #1e293b;">"${eventTitle}"</strong>${childName ? ` for <strong>${childName}</strong>` : ''}.
              </p>
              
              <div style="background: #fefce8; border: 1px solid #fef08a; border-radius: 16px; padding: 20px; margin-bottom: 32px; color: #854d0e; font-size: 14px; line-height: 1.5;">
                ⏰ <strong>Priority Access:</strong> You have priority reservation for 24 hours. Complete your booking before it's offered to the next family in line.
              </div>

              <div style="text-align: center; margin-bottom: 32px;">
                <a href="${bookingUrl}" 
                   style="display: inline-block; background: #7c3aed; color: white; text-decoration: none; padding: 16px 36px; border-radius: 12px; font-weight: 800; font-size: 16px; box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);">
                  Claim Spot & Book Now →
                </a>
              </div>

              <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; color: #94a3b8; font-size: 13px; line-height: 1.6;">
                <p>Questions? Email us at <a href="mailto:support@kidspire.com" style="color: #7c3aed;">support@kidspire.com</a></p>
                <p style="margin-top: 16px; color: #cbd5e1;">© ${new Date().getFullYear()} Kidspire. Making weekends special.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || 'Kidspire <notifications@kidspire.com>',
            to: [parentEmail],
            subject: `🌟 Waitlist Spot Open for ${eventTitle}! Claim your ticket`,
            html: emailHtml,
          }),
        });

        if (res.ok) emailSent = true;
      } catch (e) {
        console.warn('[waitlist-slot] Resend email failed:', e);
      }
    }

    return NextResponse.json({
      success: true,
      inAppNotifSent: true,
      emailSent,
      priorityUrl: bookingUrl,
    });
  } catch (err: any) {
    console.error('[waitlist-slot] error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
