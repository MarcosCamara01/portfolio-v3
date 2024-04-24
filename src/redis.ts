import { Redis } from "@upstash/redis";

if (!process.env.UPSTASH_REDIS_REST_TOKEN || !process.env.UPSTASH_REDIS_REST_URL) {
  throw new Error("UPSTASH_REDIS_REST_TOKEN or UPSTASH_REDIS_REST_URL is not defined");
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default redis;
