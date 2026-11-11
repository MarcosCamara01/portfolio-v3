import type { ReactNode } from 'react';
import { ArticleHeader } from '@/components/article/article-header';
import { ArticleFooter } from '@/components/article/article-footer';
import { getPosts } from '@/lib/posts';

export default async function Layout({ children }: { children: ReactNode }) {
  const posts = await getPosts();

  return (
    <article>
      <div
        aria-hidden
        className="read-progress fixed inset-x-0 top-0 z-50 hidden h-[3px] origin-left bg-signal"
      />
      <ArticleHeader posts={posts} />
      <div className="prose-b4">{children}</div>
      <ArticleFooter posts={posts} />
    </article>
  );
}
