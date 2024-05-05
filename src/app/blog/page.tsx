import { PostsTable } from "@/components/blog/PostsTable";
import { getPosts } from "@/get-posts";
import React from "react";

const Blog = async () => {
  const posts = await getPosts();

  return (
    <section className="min-h-[calc(100vh-108px)] md:min-h-[calc(100vh-152px)]">
      <PostsTable posts={posts} />
    </section>
  );
};

export default Blog;
