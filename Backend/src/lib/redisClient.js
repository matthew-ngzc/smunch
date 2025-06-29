import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redis = new Redis(process.env.REDIS_URL, {
  tls: {}, // required for Upstash's rediss://
});

redis.on('connect', () => console.log('[REDIS] Connected to Upstash'));
redis.on('error', (err) => console.error('[REDIS] Error:', err));

export default redis;
