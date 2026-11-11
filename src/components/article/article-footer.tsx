'use client';

import Link from 'next/link';
import type { Post } from '@/lib/posts';
import { postHref } from '@/lib/post-href';
import { X_URL } from '@/lib/site';
import { ArrowLeft, ArrowRight } from '@/components/common/icons';
import { A } from '@/components/mdx/a';
import { cn } from '@/lib/cn';
import { useCurrentPost } from './use-current-post';

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
          Full-stack developer at Togga, a workspace for law firms. If something in this post is
          wrong or out of date, tell me on <A href={X_URL}>X</A> and I&apos;ll fix it.
        </span>
      </div>

      <nav
        aria-label="More posts"
        className={cn('mt-7 flex flex-col bg-surface', older && 'md:grid md:grid-cols-2')}
      >
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
