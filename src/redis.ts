import { Redis } from '@upstash/redis';

type TweetCache = {
  get: <T>(key: string) => Promise<T | null>;
  set: (key: string, value: unknown) => Promise<'OK'>;
};

const mockCache: TweetCache = {
  get: async () => null,
  set: async () => 'OK',
};

let client: TweetCache | null = null;

function getClient(): TweetCache {
  if (client) return client;

  if (process.env.NODE_ENV !== 'production') {
    client = mockCache;
    return client;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      'UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set in production'
    );
  }

  client = new Redis({ url, token }) as TweetCache;
  return client;
}

const redis: TweetCache = {
  get: (key) => getClient().get(key),
  set: (key, value) => getClient().set(key, value),
};

export default redis;
