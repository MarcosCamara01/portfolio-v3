import { getPosts } from '@/get-posts';
import { PostList } from '@/components/blog/post-list';
import { SplitTitle } from '@/components/portfolio/split-title';

export const metadata = {
  title: 'Writing',
  description: 'Essays on Next.js, durable agents and multi-model systems.',
};

const Blog = async () => {
  const posts = await getPosts();
  const since = posts.at(-1)?.year;

  return (
    <section>
      <SplitTitle
        lines={['Writing']}
        className="mt-[18px] text-[clamp(64px,21.5vw,132px)] leading-[0.86] md:mt-6"
      />
      <p className="hero-intro max-w-[420px] pt-5 text-[17px] font-medium leading-[1.4] md:text-lg">
        Essays on Next.js, durable agents and multi-model systems. {posts.length} posts since{' '}
        {since}.
      </p>

      <PostList posts={posts} />
    </section>
  );
};

export default Blog;
