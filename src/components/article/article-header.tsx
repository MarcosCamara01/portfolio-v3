'use client';

import Link from 'next/link';
import type { Post } from '@/lib/posts';
import { postHref } from '@/lib/post-href';
import { ArrowLeft } from '@/components/common/icons';
import { formatFull, isoDate } from '@/lib/dates';
import { JsonLd } from '@/components/common/json-ld';
import { AUTHOR, SITE_URL } from '@/lib/site';
import { splitNumber } from '@/components/mdx/headings';
import { useCurrentPost } from './use-current-post';

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
