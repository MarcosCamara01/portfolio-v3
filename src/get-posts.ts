import postsData from "./posts.json";
import redis from "./redis";
import commaNumber from "comma-number";

export type Post = {
  id: string;
  date: string;
  title: string;
  views: number;
  viewsFormatted: string;
};

type Views = {
  [key: string]: string;
};

export const getPosts = async () => {
  let allViews: null | Views = null;

  try {
    allViews = await redis.hgetall("views");
  } catch (error) {
    console.error("Error fetching views from Redis:", error);
  }

  const posts = postsData.posts.map((post): Post => {
    const views = Number(allViews?.[post.id] ?? 0);
    return {
      ...post,
      views,
      viewsFormatted: commaNumber(views),
    };
  });
  return posts;
};
