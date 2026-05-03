import { describe, it, expect } from 'vitest';
import { SecurityEngine, BucketState } from '../../../src/engines/SecurityEngine';
import { SECURITY_LIMITS } from '../../../src/constants';

describe('SecurityEngine', () => {
  const now = 1000000;

  it('should initialize buckets correctly', () => {
    const buckets = SecurityEngine.initializeBuckets(now);
    expect(buckets.AI.tokens).toBe(SECURITY_LIMITS.AI.MAX);
    expect(buckets.AI.lastRefill).toBe(now);
  });

  it('should allow requests within limit', () => {
    const bucket: BucketState = { tokens: 10, lastRefill: now };
    const result = SecurityEngine.checkLimit('AI', bucket, now);
    
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(9);
    expect(result.updatedBucket.tokens).toBe(9);
    expect(result.updatedBucket.lastRefill).toBe(now);
  });

  it('should block requests exceeding limit', () => {
    const bucket: BucketState = { tokens: 0.5, lastRefill: now }; // Less than 1
    const result = SecurityEngine.checkLimit('AI', bucket, now);
    
    expect(result.allowed).toBe(false);
    expect(result.updatedBucket).toEqual(bucket);
  });

  it('should refill tokens over time', () => {
    const bucket: BucketState = { tokens: 0, lastRefill: now };
    // Pass half the window time
    const halfWindow = SECURITY_LIMITS.AI.WINDOW / 2;
    const result = SecurityEngine.checkLimit('AI', bucket, now + halfWindow);
    
    // Half window should refill half the MAX tokens
    const expectedRefill = SECURITY_LIMITS.AI.MAX / 2;
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(Math.floor(expectedRefill - 1));
  });

  it('should cap tokens at MAX', () => {
    const bucket: BucketState = { tokens: SECURITY_LIMITS.AI.MAX, lastRefill: now };
    const result = SecurityEngine.checkLimit('AI', bucket, now + 10000000); // Way in the future
    
    expect(result.updatedBucket.tokens).toBe(SECURITY_LIMITS.AI.MAX - 1);
  });
});
