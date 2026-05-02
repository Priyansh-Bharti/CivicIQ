import { useState, useEffect, useCallback } from 'react';

type RateLimitTier = 'general' | 'auth' | 'ai';

interface BucketState {
  tokens: number;
  lastRefill: number;
}

const LIMITS: Record<RateLimitTier, { capacity: number; intervalMs: number }> = {
  general: { capacity: 100, intervalMs: 15 * 60 * 1000 },
  auth: { capacity: 20, intervalMs: 15 * 60 * 1000 },
  ai: { capacity: 30, intervalMs: 15 * 60 * 1000 },
};

export const useRateLimit = () => {
  const [buckets, setBuckets] = useState<Record<RateLimitTier, BucketState>>(() => {
    const saved = localStorage.getItem('civiciq_rate_limits');
    if (saved) {
      return JSON.parse(saved);
    }
    const initialTime = Date.now();
    return {
      general: { tokens: LIMITS.general.capacity, lastRefill: initialTime },
      auth: { tokens: LIMITS.auth.capacity, lastRefill: initialTime },
      ai: { tokens: LIMITS.ai.capacity, lastRefill: initialTime },
    };
  });

  useEffect(() => {
    localStorage.setItem('civiciq_rate_limits', JSON.stringify(buckets));
  }, [buckets]);

  const checkLimit = useCallback((tier: RateLimitTier): { allowed: boolean; remaining: number; resetTime: number } => {
    const now = Date.now();
    const limit = LIMITS[tier];
    const bucket = buckets[tier];

    // Calculate refill
    const timePassed = now - bucket.lastRefill;
    const refillAmount = (timePassed / limit.intervalMs) * limit.capacity;
    const newTokens = Math.min(limit.capacity, bucket.tokens + refillAmount);

    if (newTokens >= 1) {
      const updatedBuckets = {
        ...buckets,
        [tier]: {
          tokens: newTokens - 1,
          lastRefill: now
        }
      };
      setBuckets(updatedBuckets);
      return { 
        allowed: true, 
        remaining: Math.floor(newTokens - 1),
        resetTime: bucket.lastRefill + limit.intervalMs 
      };
    }

    return { 
      allowed: false, 
      remaining: 0,
      resetTime: bucket.lastRefill + limit.intervalMs 
    };
  }, [buckets]);

  return { checkLimit };
};
