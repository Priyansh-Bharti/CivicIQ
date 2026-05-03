import { SECURITY_LIMITS } from '../constants';

/** Tier for rate limiting buckets. */
export type RateLimitTier = 'GENERAL' | 'AUTH' | 'AI';

/** State of a single token-bucket. */
export interface BucketState {
  /** Current token count. */
  tokens: number;
  /** Timestamp of last refill. */
  lastRefill: number;
}

/** Result of a rate-limit check. */
export interface LimitResult {
  /** Whether the request is allowed. */
  allowed: boolean;
  /** Remaining tokens in the bucket. */
  remaining: number;
  /** Timestamp when the bucket will reset. */
  resetTime: number;
  /** Updated bucket state after this check. */
  updatedBucket: BucketState;
}

/**
 * Security Engine
 * Pure logic for rate limiting, anomaly detection, and input sanitization.
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
    
    /** Token refill calculation using the token-bucket algorithm. */
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
      updatedBucket: currentBucket
    };
  }

  /**
   * Initializes a new set of buckets for all tiers.
   * @param {number} now The current timestamp.
   * @returns {Record<RateLimitTier, BucketState>}
   */
  public static initializeBuckets(now: number = Date.now()): Record<RateLimitTier, BucketState> {
    return {
      GENERAL: { tokens: SECURITY_LIMITS.GENERAL.MAX, lastRefill: now },
      AUTH:    { tokens: SECURITY_LIMITS.AUTH.MAX,    lastRefill: now },
      AI:      { tokens: SECURITY_LIMITS.AI.MAX,      lastRefill: now },
    };
  }

  /**
   * Strips HTML tags and encodes dangerous characters to prevent XSS.
   * @param {string} input Raw user-supplied string.
   * @returns {string} The sanitized string safe for rendering.
   */
  public static sanitizeHtml(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .trim();
  }

  /**
   * Assigns a suspicion score (0–100) to a user input.
   * Higher scores indicate more suspicious activity.
   * @param {string} input The user input string.
   * @returns {number} Suspicion score.
   */
  public static scoreSuspicion(input: string): number {
    /** Weight factors for suspicious patterns. */
    let score = 0;
    if (input.length > 400)           score += 20;  // very long input
    if (/<[^>]*>/.test(input))         score += 30;  // HTML tags
    if (/script/gi.test(input))        score += 40;  // script keywords
    if (/ignore.*instruction/gi.test(input)) score += 50; // prompt injection
    if (/\bdan\b/gi.test(input))       score += 40;  // jailbreak keyword
    if (/system.{0,10}prompt/gi.test(input)) score += 50; // system prompt exfil
    return Math.min(score, 100);
  }

  /**
   * Returns true if the suspicion score exceeds the danger threshold.
   * @param {string} input The user input string.
   * @returns {boolean} Whether the input is considered anomalous.
   */
  public static detectAnomaly(input: string): boolean {
    return SecurityEngine.scoreSuspicion(input) >= 40;
  }
}
