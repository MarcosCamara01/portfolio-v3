import postsData from './posts.json';
import commaNumber from 'comma-number';

export type Post = {
  id: string;
  date: string;
  title: string;
  views: number;
  viewsFormatted: string;
};

// Build time: returns posts with 0 views
// Client time: SWR fetches actual views from /api/posts
export const getPosts = async () => {
  const posts = postsData.posts.map((post): Post => {
    return {
      ...post,
      views: 0,
      viewsFormatted: commaNumber(0),
    };
  });
  return posts;
};
