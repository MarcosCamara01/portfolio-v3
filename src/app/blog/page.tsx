import { PostsTable } from "@/components/blog/postsTable";
import { getPosts } from "@/get-posts";

const Blog = async () => {
  const posts = await getPosts();

  return (
    <section className="min-h-[calc(100dvh-108px)] md:min-h-[calc(100dvh-152px)]">
      <PostsTable posts={posts} />
    </section>
  );
};

export default Blog;
