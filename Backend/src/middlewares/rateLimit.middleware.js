import redis from "../lib/redisClient";

export function rateLimit({ keyPrefix = 'rate: signup', maxAttempts = 5, windowSeconds = 60 }){
    return async (req, res, next) => {
        try{
            // * extract user ip (might have error if cannot extract ip)
            const ip = req.ip || req.headers['x-forwarded-for'] || '';

            if (!ip) {
                console.warn('[RATE LIMIT] Could not extract IP address. Consider blocing or skipping rate limit');
                return next(); //allow for now, change this if rate limiting is NECESSARY
            }
            //create redis key using ip
            const redisKey = `${keyPrefix}:${ip}`;

            //increment attempts count in redis
            const attempts = await redis.incr(redisKey);

            // set TTL if 1st time trying
            if (attempts === 1) await redis.expire(redisKey, windowSeconds);

            // exceed max attempts, return 429
            else if (attempts > maxAttempts) return res.status(429).json({ message: 'Too many requests. Please try again later.'});

            //ok, continue
            next();
        } catch (err){
            console.error('[RATE LIMIT ERROR]', err);
            next();
        }
    }
}