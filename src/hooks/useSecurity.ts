import { useState, useEffect, useCallback } from 'react';
import { SecurityEngine, RateLimitTier, BucketState } from '../engines/SecurityEngine';

const getInitialBuckets = (): Record<RateLimitTier, BucketState> => {
  const saved = localStorage.getItem('civiciq_rate_limits');
  if (saved) {
    try { return JSON.parse(saved) as Record<RateLimitTier, BucketState>; }
    catch { /* fallback */ }
  }
  return SecurityEngine.initializeBuckets();
};

export const useRateLimit = () => {
  const [buckets, setBuckets] = useState<Record<RateLimitTier, BucketState>>(getInitialBuckets);

  useEffect(() => {
    localStorage.setItem('civiciq_rate_limits', JSON.stringify(buckets));
  }, [buckets]);

  const checkLimit = useCallback((tier: RateLimitTier) => {
    const result = SecurityEngine.checkLimit(tier, buckets[tier]);
    if (result.allowed) {
      setBuckets(prev => ({ ...prev, [tier]: result.updatedBucket }));
    }
    return { allowed: result.allowed, remaining: result.remaining, resetTime: result.resetTime };
  }, [buckets]);

  return { checkLimit };
};
