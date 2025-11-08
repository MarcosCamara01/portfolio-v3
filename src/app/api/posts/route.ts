import { NextResponse } from 'next/server';
import { getPosts } from '@/get-posts';
import redis from '@/redis';
import commaNumber from 'comma-number';

export const dynamic = 'force-dynamic';

export async function GET() {
  const posts = await getPosts();

  let allViews: Record<string, string> | null = null;
  try {
    allViews = await redis.hgetall('views');
  } catch (error) {
    console.error('Error fetching views from Redis:', error);
  }

  const postsWithViews = posts.map((post) => {
    const views = Number(allViews?.[post.id] ?? 0);
    return {
      ...post,
      views,
      viewsFormatted: commaNumber(views),
    };
  });

  return NextResponse.json(postsWithViews);
}
