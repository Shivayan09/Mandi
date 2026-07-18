const buckets = new Map();

const MAX_TOKENS = 10;
const REFILL_RATE = 1;

export const rateLimiter = (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    let bucket = buckets.get(key);
    if (!bucket) {
        bucket = {
            tokens: MAX_TOKENS,
            lastRefill: now
        };
        buckets.set(key, bucket);
    }
    const elapsed = (now - bucket.lastRefill) / 1000;
    const refill = elapsed * REFILL_RATE;
    bucket.tokens = Math.min(MAX_TOKENS, bucket.tokens + refill);
    bucket.lastRefill = now;
    if (bucket.tokens >= 1) {
        bucket.tokens -= 1;
        return next();
    }
    return res.status(429).json({
        success: false,
        message: "Too many requests! Please try again later!"
    });

};