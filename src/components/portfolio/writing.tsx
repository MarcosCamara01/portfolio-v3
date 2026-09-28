import Link from 'next/link';
import { getPosts } from '@/get-posts';
import { SectionTitle } from '../blog/section-title';
import { LatestPost } from '../blog/latest-post';
import { PostRow } from '../blog/post-row';
import { formatMonth } from '../blog/format';
import { ArrowRight } from '../common/icons';

export const Writing = async () => {
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
};
