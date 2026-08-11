import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/utils/rateLimiter';

/**
 * POST /api/list-your-event
 * Handles List Your Event submissions with rate limiting (5 submissions / hour / IP)
 */
export async function POST(req: NextRequest) {
  try {
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ip = forwardedFor?.split(',')[0].trim() || realIp || '127.0.0.1';
    const rateCheck = checkRateLimit(`list_event_${ip}`, 5, 60 * 60 * 1000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many submissions, please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { organizerName, contactName, email, eventTitle } = body;

    if (!organizerName || !email || !eventTitle) {
      return NextResponse.json(
        { error: 'Organization name, contact email, and event title are required.' },
        { status: 400 }
      );
    }

    // Process event inquiry submission
    return NextResponse.json({
      success: true,
      message: 'Your event listing inquiry has been received! Our team will review and contact you within 24 hours.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

