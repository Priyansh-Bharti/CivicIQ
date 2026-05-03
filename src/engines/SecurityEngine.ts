import { SECURITY_LIMITS } from '../constants';

export type RateLimitTier = 'GENERAL' | 'AUTH' | 'AI';

export interface BucketState {
  tokens: number;
  lastRefill: number;
}

export interface LimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  updatedBucket: BucketState;
}

/**
 * Security Engine
 * Pure logic for rate limiting and security calculations.
 * Decoupled from React to ensure deterministic testing.
 */
export class SecurityEngine {
  /**
   * Calculates the result of a rate limit check.
   * @param {RateLimitTier} tier The tier to check.
   * @param {BucketState} currentBucket The current state of the bucket.
   * @param {number} now The current timestamp (provided for testability).
   * @returns {LimitResult}
   */
  public static checkLimit(
    tier: RateLimitTier,
    currentBucket: BucketState,
    now: number = Date.now()
  ): LimitResult {
    const limit = SECURITY_LIMITS[tier];
    
    // Calculate token refill
    const timePassed = now - currentBucket.lastRefill;
    const refillAmount = (timePassed / limit.WINDOW) * limit.MAX;
    const tokensWithRefill = Math.min(limit.MAX, currentBucket.tokens + refillAmount);

    if (tokensWithRefill >= 1) {
      const remainingTokens = tokensWithRefill - 1;
      return {
        allowed: true,
        remaining: Math.floor(remainingTokens),
        resetTime: currentBucket.lastRefill + limit.WINDOW,
        updatedBucket: { tokens: remainingTokens, lastRefill: now }
      };
    }

    return {
      allowed: false,
      remaining: 0,
      resetTime: currentBucket.lastRefill + limit.WINDOW,
      updatedBucket: currentBucket // No change if blocked
    };
  }

  /**
   * Initializes a new set of buckets.
   * @param {number} now The current timestamp.
   * @returns {Record<RateLimitTier, BucketState>}
   */
  public static initializeBuckets(now: number = Date.now()): Record<RateLimitTier, BucketState> {
    return {
      GENERAL: { tokens: SECURITY_LIMITS.GENERAL.MAX, lastRefill: now },
      AUTH: { tokens: SECURITY_LIMITS.AUTH.MAX, lastRefill: now },
      AI: { tokens: SECURITY_LIMITS.AI.MAX, lastRefill: now },
    };
  }
}
