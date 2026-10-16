interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const stores = new Map<string, Map<string, RateLimitEntry>>();

/**
 * Checks if a key has exceeded the maximum attempts threshold without incrementing.
 */
export function isRateLimited(
  bucketName: string,
  key: string,
  limit: number
): { isLimited: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const store = stores.get(bucketName);
  const existing = store?.get(key);

  if (!existing || existing.resetAt <= now) {
    if (existing && existing.resetAt <= now) {
      store?.delete(key);
    }
    return { isLimited: false, remaining: limit, resetAt: 0 };
  }

  if (existing.count >= limit) {
    return { isLimited: true, remaining: 0, resetAt: existing.resetAt };
  }

  return {
    isLimited: false,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
  };
}

/**
 * Increments the failure counter for a specific key upon an unsuccessful action.
 */
export function recordFailedAttempt(
  bucketName: string,
  key: string,
  limit: number,
  windowMs: number
): { isLimited: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  let store = stores.get(bucketName);
  if (!store) {
    store = new Map<string, RateLimitEntry>();
    stores.set(bucketName, store);
  }

  // Periodic cleanup if store grows
  if (store.size > 2000) {
    for (const [k, entry] of store.entries()) {
      if (entry.resetAt <= now) {
        store.delete(k);
      }
    }
  }

  const existing = store.get(key);
  if (!existing || existing.resetAt <= now) {
    const entry: RateLimitEntry = {
      count: 1,
      resetAt: now + windowMs,
    };
    store.set(key, entry);
    return {
      isLimited: entry.count >= limit,
      remaining: Math.max(0, limit - entry.count),
      resetAt: entry.resetAt,
    };
  }

  existing.count += 1;
  return {
    isLimited: existing.count >= limit,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt,
  };
}

/**
 * Rate limit check and increment in one step (ideal for public APIs like inquiry submissions).
 */
export function checkRateLimit(
  bucketName: string,
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number; resetAt: number } {
  const record = recordFailedAttempt(bucketName, key, limit, windowMs);
  return {
    success: !record.isLimited,
    remaining: record.remaining,
    resetAt: record.resetAt,
  };
}

/**
 * Resets the rate limit counter for a specific key (e.g. after successful login).
 */
export function resetRateLimit(bucketName: string, key: string): void {
  const store = stores.get(bucketName);
  if (store) {
    store.delete(key);
  }
}
