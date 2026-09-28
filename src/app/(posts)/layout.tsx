import { ArticleHeader, ArticleFooter } from './header';
import { getPosts } from '@/get-posts';

export default async function Layout({ children }: { children: React.ReactNode }) {
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
