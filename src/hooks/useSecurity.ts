/**
 * Rate Limiting Hook
 * Implements a Token Bucket algorithm to protect API endpoints from abuse.
 */

import { useState, useEffect, useCallback } from 'react';
import { SECURITY_LIMITS } from '../constants';

type RateLimitTier = 'GENERAL' | 'AUTH' | 'AI';

interface BucketState {
  /** Current number of available tokens. */
  tokens: number;
  /** Timestamp of the last token refill. */
  lastRefill: number;
}

interface LimitResult {
  /** True if the request is permitted. */
  allowed: boolean;
  /** Number of tokens remaining after this check. */
  remaining: number;
  /** Timestamp when the bucket will be fully refilled. */
  resetTime: number;
}

/**
 * Custom hook for managing client-side rate limits using a token bucket approach.
 * @returns {{ checkLimit: (tier: RateLimitTier) => LimitResult }} The limit check function.
 */
export const useRateLimit = (): { checkLimit: (tier: RateLimitTier) => LimitResult } => {
  const [buckets, setBuckets] = useState<Record<RateLimitTier, BucketState>>(() => {
    const saved = localStorage.getItem('civiciq_rate_limits');
    if (saved) {
      try {
        return JSON.parse(saved) as Record<RateLimitTier, BucketState>;
      } catch {
        // Fallback to initial state if parsing fails
      }
    }

    const initialTime = Date.now();
    return {
      GENERAL: { tokens: SECURITY_LIMITS.GENERAL.MAX, lastRefill: initialTime },
      AUTH: { tokens: SECURITY_LIMITS.AUTH.MAX, lastRefill: initialTime },
      AI: { tokens: SECURITY_LIMITS.AI.MAX, lastRefill: initialTime },
    };
  });

  useEffect(() => {
    localStorage.setItem('civiciq_rate_limits', JSON.stringify(buckets));
  }, [buckets]);

  /**
   * Checks if a request is allowed for a specific tier.
   * @param {RateLimitTier} tier The tier to check (GENERAL, AUTH, or AI).
   * @returns {LimitResult} The result of the limit check.
   */
  const checkLimit = useCallback((tier: RateLimitTier): LimitResult => {
    const now = Date.now();
    const limit = SECURITY_LIMITS[tier];
    const bucket = buckets[tier];

    // Calculate token refill based on time elapsed
    const timePassed = now - bucket.lastRefill;
    const refillAmount = (timePassed / limit.WINDOW) * limit.MAX;
    const newTokens = Math.min(limit.MAX, bucket.tokens + refillAmount);

    if (newTokens >= 1) {
      const updatedBuckets = {
        ...buckets,
        [tier]: { tokens: newTokens - 1, lastRefill: now }
      };
      setBuckets(updatedBuckets);
      return { 
        allowed: true, 
        remaining: Math.floor(newTokens - 1),
        resetTime: bucket.lastRefill + limit.WINDOW 
      };
    }

    return { 
      allowed: false, 
      remaining: 0,
      resetTime: bucket.lastRefill + limit.WINDOW 
    };
  }, [buckets]);

  return { checkLimit };
};
