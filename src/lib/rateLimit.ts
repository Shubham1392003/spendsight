/**
 * In-memory rate limiter for Next.js App Router API Routes.
 * Each namespace (route) has its own independent counter.
 * In a multi-region serverless deployment use @upstash/ratelimit instead.
 */

type RateLimitInfo = {
  count: number;
  resetTime: number;
};

const rateLimitCache = new Map<string, RateLimitInfo>();

export function checkRateLimit(
  ip: string,
  namespace = "default"
): { success: boolean; limit: number; remaining: number; resetTime: number } {
  const limit = 5; // Max 5 requests per namespace
  const windowMs = 60 * 1000; // per 1 minute
  const now = Date.now();

  // Key includes namespace so each route tracks independently
  const key = `${namespace}:${ip}`;
  let info = rateLimitCache.get(key);

  if (!info || now > info.resetTime) {
    info = { count: 0, resetTime: now + windowMs };
  }

  info.count += 1;
  rateLimitCache.set(key, info);

  const remaining = Math.max(0, limit - info.count);

  return {
    success: info.count <= limit,
    limit,
    remaining,
    resetTime: info.resetTime,
  };
}

