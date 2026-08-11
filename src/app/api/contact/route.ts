import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/utils/rateLimiter';

/**
 * POST /api/contact
 * Handles contact form submissions with rate limiting (5 submissions / hour / IP)
 */
export async function POST(req: NextRequest) {
  try {
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ip = forwardedFor?.split(',')[0].trim() || realIp || '127.0.0.1';
    const rateCheck = checkRateLimit(`contact_${ip}`, 5, 60 * 60 * 1000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many submissions, please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    // Process contact inquiry (in production: send email / save to DB)
    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

