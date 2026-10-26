// Gateway Token-Bucket Rate Limiter
// Enforces 20 req/s threshold at the ingress perimeter and calculates live availability

export class TokenBucketRateLimiter {
  constructor(capacity = 20, refillRatePerSec = 20) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRatePerSec;
    this.lastRefill = Date.now();
    this.totalShed = 0;
    this.totalPassed = 0;
  }

  refill() {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsedSeconds * this.refillRate);
    this.lastRefill = now;
  }

  tryConsume(tokens = 1) {
    this.refill();
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      this.totalPassed += tokens;
      return { allowed: true, remaining: Math.floor(this.tokens), shed: 0 };
    }
    const allowed = Math.floor(this.tokens);
    const shed = tokens - allowed;
    this.tokens = 0;
    this.totalPassed += allowed;
    this.totalShed += shed;
    return { allowed: false, remaining: 0, shed };
  }

  getAvailabilityMeter() {
    this.refill();
    return Math.max(0, Math.min(100, Math.round((this.tokens / this.capacity) * 100)));
  }

  reset() {
    this.tokens = this.capacity;
    this.lastRefill = Date.now();
    this.totalShed = 0;
    this.totalPassed = 0;
  }
}
