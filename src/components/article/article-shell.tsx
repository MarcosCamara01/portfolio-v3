import type { ReactNode } from 'react';
import { getPosts } from '@/lib/posts';
import { ArticleHeader } from './article-header';
import { ArticleFooter } from './article-footer';

// MDX renders every post inside this wrapper (src/mdx-components.tsx), so the header is
// part of the page, not the (posts) layout: on navigation Next scrolls the new page's
// first node into view, and that has to be the title, not the first paragraph.
export async function ArticleShell({ children }: { children: ReactNode }) {
  const posts = await getPosts();

  return (
    <>
      <ArticleHeader posts={posts} />
      <div className="prose-b4">{children}</div>
      <ArticleFooter posts={posts} />
    </>
  );
}
