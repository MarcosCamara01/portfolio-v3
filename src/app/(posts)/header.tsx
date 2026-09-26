'use client';

import Link from 'next/link';
import { useSelectedLayoutSegments } from 'next/navigation';
import type { Post } from '@/get-posts';
import { postHref } from '@/lib/post-href';
import { ArrowLeft, ArrowRight } from '@/components/common/icons';
import { formatFull, isoDate } from '@/components/blog/format';
import { JsonLd } from '@/components/common/json-ld';
import { AUTHOR, SITE_URL } from '@/lib/site';
import { splitNumber } from '@/components/posts/utils';

function useCurrentPost(posts: Post[]) {
  const segments = useSelectedLayoutSegments();
  const postId = segments?.length >= 2 ? segments[1] : null;
  const index = posts.findIndex((item) => item.id === postId);
  return { post: index === -1 ? null : posts[index], older: posts[index + 1] ?? null };
}

export function ArticleHeader({ posts }: { posts: Post[] }) {
  const { post } = useCurrentPost(posts);
  if (post == null) return null;

  const url = `${SITE_URL}${postHref(post)}`;

  return (
    <header>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.description ?? undefined,
          datePublished: isoDate(post.date),
          url,
          mainEntityOfPage: url,
          author: AUTHOR,
          keywords: post.tag ?? undefined,
          inLanguage: 'en',
        }}
      />
      <Link href="/blog" className="label press inline-flex items-center gap-2 pb-2 pt-[18px]">
        <ArrowLeft />
        All writing
      </Link>

      <p className="label flex flex-wrap gap-2 pt-2">
        <span>{formatFull(post.date)}</span>
        <span>·</span>
        <span>{post.minutes} min read</span>
        {post.tag ? (
          <>
            <span>·</span>
            <span className="bg-signal px-1.5 text-signal-on">{post.tag}</span>
          </>
        ) : null}
      </p>

      <h1 className="display mt-3.5 text-[50px] leading-[0.92] [text-wrap:balance] md:text-[80px]">
        {post.title}
      </h1>

      {post.description ? (
        <p className="mt-[18px] text-lg font-medium leading-[1.45] text-sub md:text-xl">
          {post.description}
        </p>
      ) : null}

      {post.headings.length > 2 ? (
        <nav aria-label="On this page" className="mt-8 bg-surface px-[18px] py-4">
          <div className="label pb-1.5">On this page</div>
          <ol>
            {post.headings.map((heading, i) => {
              const { number, text } = splitNumber(heading.title);
              return (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    className="group grid grid-cols-[28px_minmax(0,1fr)] gap-2 py-1.5 text-[15px] font-medium"
                  >
                    <span className="font-bold text-signal">
                      {number ?? String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="decoration-signal decoration-2 underline-offset-4 group-hover:underline">
                      {text}
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>
      ) : null}
    </header>
  );
}

export function ArticleFooter({ posts }: { posts: Post[] }) {
  const { post, older } = useCurrentPost(posts);
  if (post == null) return null;

  return (
    <aside>
      <div className="mt-16 flex flex-col gap-2.5">
        <span className="label">Written by</span>
        <span className="display text-[32px] leading-none md:text-[40px]">
          Marcos Cámara<span className="text-signal">.</span>
        </span>
        <span className="text-[15px] leading-[1.55] text-sub">
          Full-stack engineer building legal AI at Togga, San Sebastián.
        </span>
      </div>

      <nav aria-label="More posts" className="mt-7 flex flex-col bg-surface md:grid md:grid-cols-2">
        <Link href="/blog" className="press flex flex-col gap-1.5 p-4">
          <span className="label inline-flex items-center gap-2">
            <ArrowLeft />
            All writing
          </span>
          <span className="text-base font-semibold">
            {posts.length} posts since {posts.at(-1)?.year}
          </span>
        </Link>
        {older ? (
          <Link
            href={postHref(older)}
            className="latest press flex flex-col gap-1.5 bg-inv p-4 text-inv-ink"
          >
            <span className="label inline-flex items-center gap-2 text-inv-signal">
              Previous post
              <ArrowRight className="latest-arrow" />
            </span>
            <span className="text-base font-semibold leading-[1.3]">{older.title}</span>
          </Link>
        ) : null}
      </nav>
    </aside>
  );
}
