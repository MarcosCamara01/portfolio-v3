import { Redis } from '@upstash/redis';

type MinimalRedis = {
  hgetall: (key: string) => Promise<Record<string, string> | null>;
  hincrby: (key: string, field: string, increment: number) => Promise<number>;
  hget: (key: string, field: string) => Promise<string | null>;
  get: <T>(key: string) => Promise<T | null>;
  set: (key: string, value: any) => Promise<'OK'>;
};

// Outside production we always use a mock so local navigation never pollutes
// the real view counts.
const mockRedis: MinimalRedis = {
  hgetall: async () => null,
  hincrby: async () => 0,
  hget: async () => null,
  get: async () => null,
  set: async () => 'OK',
};

let client: MinimalRedis | null = null;

// Lazy so that `next build` succeeds without credentials, but the first
// request in a misconfigured production deployment fails loudly instead of
// silently serving zeroed view counts from the mock.
function getClient(): MinimalRedis {
  if (client) return client;

  if (process.env.NODE_ENV !== 'production') {
    client = mockRedis;
    return client;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      'UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set in production'
    );
  }

  client = new Redis({ url, token }) as MinimalRedis;
  return client;
}

const redis: MinimalRedis = {
  hgetall: (key) => getClient().hgetall(key),
  hincrby: (key, field, increment) => getClient().hincrby(key, field, increment),
  hget: (key, field) => getClient().hget(key, field),
  get: (key) => getClient().get(key),
  set: (key, value) => getClient().set(key, value),
};

export default redis;
