/**
 * In-memory rate limiter for Next.js App Router API Routes.
 * Note: In a true multi-region serverless deployment (like Vercel Edge), 
 * this state does not persist across instances. For a production app with 
 * heavy traffic, Upstash Redis (@upstash/ratelimit) should be swapped in.
 * For an internship demo or single-instance deployment, this is highly effective.
 */

type RateLimitInfo = {
  count: number;
  resetTime: number;
};

const rateLimitCache = new Map<string, RateLimitInfo>();

export function checkRateLimit(ip: string): { success: boolean; limit: number; remaining: number; resetTime: number } {
  const limit = 5; // Max 5 requests
  const windowMs = 60 * 1000; // per 1 minute (60,000 ms)
  const now = Date.now();

  let info = rateLimitCache.get(ip);

  if (!info || now > info.resetTime) {
    info = { count: 0, resetTime: now + windowMs };
  }

  info.count += 1;
  rateLimitCache.set(ip, info);

  const remaining = Math.max(0, limit - info.count);

  return {
    success: info.count <= limit,
    limit,
    remaining,
    resetTime: info.resetTime
  };
}
