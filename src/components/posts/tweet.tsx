import { type ReactNode, Suspense } from 'react';
import { Tweet, getTweet } from 'react-tweet/api';
import { EmbeddedTweet, TweetNotFound, TweetSkeleton, type TweetProps } from 'react-tweet';
import redis from '../../redis';
import { Caption } from './caption';
import './tweet.css';

interface TweetArgs {
  id: string;
  caption: ReactNode;
}

async function getAndCacheTweet(id: string): Promise<Tweet | undefined> {
  // we first prioritize getting a fresh tweet
  try {
    const tweet = await getTweet(id);

    // @ts-ignore - tweet type from react-tweet doesn't properly type the tombstone property
    if (tweet && !tweet.tombstone) {
      // we populate the cache if we have a fresh tweet
      await redis.set(`tweet:${id}`, tweet);
      return tweet;
    }
  } catch (error) {
    console.error('tweet fetch error', error);
  }

  const cachedTweet: Tweet | null = await redis.get(`tweet:${id}`);

  // @ts-ignore - tweet type from react-tweet doesn't properly type the tombstone property
  if (!cachedTweet || cachedTweet.tombstone) return undefined;
  console.warn('tweet cache hit', id);

  return cachedTweet;
}

const TweetContent = async ({ id, components }: TweetProps) => {
  const tweet = id ? await getAndCacheTweet(id) : undefined;

  if (!tweet) {
    return <TweetNotFound />;
  }

  return <EmbeddedTweet tweet={tweet} components={components} />;
};

export const ReactTweet = (props: TweetProps) => (
  <Suspense fallback={<TweetSkeleton />}>
    <TweetContent {...props} />
  </Suspense>
);

export async function AllTweet({ id, caption }: TweetArgs) {
  return (
    <div className="tweet my-6">
      <div className={`flex justify-center`}>
        <ReactTweet id={id} />
      </div>
      {caption && <Caption>{caption}</Caption>}
    </div>
  );
}
