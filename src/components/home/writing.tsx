import Link from 'next/link';
import { getPosts } from '@/lib/posts';
import { SectionTitle } from './section-title';
import { LatestPost } from '@/components/blog/latest-post';
import { PostRow } from '@/components/blog/post-row';
import { formatMonth } from '@/lib/dates';
import { ArrowRight } from '@/components/common/icons';

export async function Writing() {
  const [latest, ...rest] = await getPosts();

  return (
    <section>
      <SectionTitle>Writing</SectionTitle>
      <div data-reveal="list">
        {latest ? <LatestPost post={latest} /> : null}
        {rest.slice(0, 3).map((post) => (
          <PostRow key={post.id} post={post} date={formatMonth(post.date)} />
        ))}
        <Link
          href="/blog"
          className="row label flex items-center justify-between border-t border-soft py-4 text-[15px]"
        >
          <span>All posts</span>
          <ArrowRight className="row-arrow-static" />
        </Link>
      </div>
    </section>
  );
}
