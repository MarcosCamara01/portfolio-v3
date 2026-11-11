import type { Metadata } from 'next';
import { getPosts } from '@/lib/posts';
import { PostList } from '@/components/blog/post-list';
import { PageHeading } from '@/components/common/page-heading';

export const metadata: Metadata = {
  title: 'Writing',
  description:
    'AI launches checked against their own docs and benchmarks, plus older posts on Next.js performance.',
};

export default async function BlogPage() {
  const posts = await getPosts();
  const since = posts.at(-1)?.year;

  return (
    <section>
      <PageHeading title="Writing">
        I read the docs, the repo and the benchmark table behind an AI launch, then write about what
        holds up. The older posts are about making Next.js fast. {posts.length} posts since {since}.
      </PageHeading>

      <PostList posts={posts} />
    </section>
  );
}
