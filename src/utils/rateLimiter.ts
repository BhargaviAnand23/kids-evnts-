/**
 * Utility for basic rate limiting on form submissions & API routes.
 * Limits submissions per key (IP address or client identifier) per time window.
 */

const ipStore = new Map<string, number[]>();

/**
 * Server-side rate limiter by IP / Key
 */
export function checkRateLimit(
  key: string,
  limit: number = 5,
  windowMs: number = 60 * 60 * 1000 // 1 hour
): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const windowStart = now - windowMs;

  let timestamps = ipStore.get(key) || [];
  timestamps = timestamps.filter(ts => ts > windowStart);

  if (timestamps.length >= limit) {
    const oldest = timestamps[0];
    return {
      allowed: false,
      remaining: 0,
      resetMs: oldest + windowMs - now,
    };
  }

  timestamps.push(now);
  ipStore.set(key, timestamps);

  return {
    allowed: true,
    remaining: limit - timestamps.length,
    resetMs: windowMs,
  };
}

/**
 * Client-side rate limiter using localStorage to prevent form spamming.
 */
export function checkClientRateLimit(
  key: string,
  limit: number = 5,
  windowMs: number = 60 * 60 * 1000
): { allowed: boolean; message?: string } {
  if (typeof window === 'undefined') return { allowed: true };

  const storageKey = `kidspire_ratelimit_${key}`;
  const now = Date.now();
  const windowStart = now - windowMs;

  let timestamps: number[] = [];
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) timestamps = JSON.parse(raw);
  } catch (e) {
    timestamps = [];
  }

  timestamps = timestamps.filter(ts => typeof ts === 'number' && ts > windowStart);

  if (timestamps.length >= limit) {
    return {
      allowed: false,
      message: 'Too many submissions, please try again later.',
    };
  }

  timestamps.push(now);
  try {
    localStorage.setItem(storageKey, JSON.stringify(timestamps));
  } catch (e) {}

  return { allowed: true };
}
