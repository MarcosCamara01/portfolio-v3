import { Redis } from '@upstash/redis';

type MinimalRedis = {
  hgetall: (key: string) => Promise<Record<string, string> | null>;
  hincrby: (key: string, field: string, increment: number) => Promise<number>;
  hget: (key: string, field: string) => Promise<string | null>;
  get: <T>(key: string) => Promise<T | null>;
  set: (key: string, value: any) => Promise<'OK'>;
};

const mockRedis: MinimalRedis = {
  hgetall: async () => null,
  hincrby: async () => 0,
  hget: async () => null,
  get: async () => null,
  set: async () => 'OK',
};

let redis: MinimalRedis;

try {
  if (
    !process.env.UPSTASH_REDIS_REST_TOKEN ||
    !process.env.UPSTASH_REDIS_REST_URL ||
    process.env.NODE_ENV === 'development'
  ) {
    console.warn('Warning: Redis credentials not found or in development mode. Using mock Redis.');
    redis = mockRedis;
  } else {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    }) as MinimalRedis;
  }
} catch (error) {
  console.error('Error initializing Redis:', error);
  redis = mockRedis;
}

export default redis;
