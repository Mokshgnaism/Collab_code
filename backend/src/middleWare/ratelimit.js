// rateLimiter.js
const RATE_LIMIT = {
  capacity: 10,            // max tokens
  refillInterval: 10000,    // ms per token
};

const buckets = new Map(); // ip → { tokens, lastRefill }

function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;

  let bucket = buckets.get(ip);
  const now = Date.now();

  if (!bucket) {
    // first time: start full
    bucket = {
      tokens: RATE_LIMIT.capacity,
      lastRefill: now,
    };
  } else {
    // refill tokens
    const elapsed = now - bucket.lastRefill;
    const tokensToAdd = Math.floor(elapsed / RATE_LIMIT.refillInterval);
    if (tokensToAdd > 0) {
      bucket.tokens = Math.min(
        RATE_LIMIT.capacity,
        bucket.tokens + tokensToAdd
      );
      bucket.lastRefill += tokensToAdd * RATE_LIMIT.refillInterval;
    }
  }
  console.log(bucket.tokens);

  if (bucket.tokens > 0) {
    bucket.tokens -= 1;
    buckets.set(ip, bucket);
    // Optionally expose remaining tokens in headers:
    res.setHeader('X-RateLimit-Remaining', bucket.tokens);
    return next();
  } else {
    // no tokens left → too many requests
    res.setHeader('Retry-After', Math.ceil(
      (RATE_LIMIT.refillInterval - (now - bucket.lastRefill)) / 1000
    ));
    return res.status(429).json({
      error: 'Too many requests, please try again later.'
    });
  }
}

export default rateLimiter;
