import redis from '@/redis';
import { getPosts } from '@/get-posts';
import commaNumber from 'comma-number';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id') ?? null;

  if (id === null) {
    return NextResponse.json(
      {
        error: {
          message: 'Missing "id" query',
          code: 'MISSING_ID',
        },
      },
      { status: 400 }
    );
  }

  const posts = await getPosts();
  const post = posts.find((post) => post.id === id);

  if (post == null) {
    return NextResponse.json(
      {
        error: {
          message: 'Unknown post',
          code: 'UNKNOWN_POST',
        },
      },
      { status: 400 }
    );
  }

  if (url.searchParams.get('incr') != null) {
    const views = await redis.hincrby('views', id, 1);
    return NextResponse.json({
      ...post,
      views,
      viewsFormatted: commaNumber(views),
    });
  } else {
    const viewsStr = (await redis.hget('views', id)) ?? '0';
    const views = Number(viewsStr);
    return NextResponse.json({
      ...post,
      views,
      viewsFormatted: commaNumber(views),
    });
  }
}
