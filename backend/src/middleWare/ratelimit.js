
const RATE_LIMIT = {
  capacity: 10,           
  refillInterval: 10000,    
};

const buckets = new Map(); 

function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;

  let bucket = buckets.get(ip);
  const now = Date.now();

  if (!bucket) {
    bucket = {
      tokens: RATE_LIMIT.capacity,
      lastRefill: now,
    };
  } else {
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
    res.setHeader('X-RateLimit-Remaining', bucket.tokens);
    return next();
  } else {
    res.setHeader('Retry-After', Math.ceil(
      (RATE_LIMIT.refillInterval - (now - bucket.lastRefill)) / 1000
    ));
    return res.status(429).json({
      error: 'Too many requests, please try again later.'
    });
  }
}

export default rateLimiter;
