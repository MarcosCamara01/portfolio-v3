import { useSelectedLayoutSegments } from 'next/navigation';
import type { Post } from '@/lib/posts';

// Layouts don't receive the page's params, so the article header and footer (rendered by
// the (posts) layout) find their post from the URL segments: {year}/{slug}.
export function useCurrentPost(posts: Post[]) {
  const segments = useSelectedLayoutSegments();
  const postId = segments?.length >= 2 ? segments[1] : null;
  const index = posts.findIndex((item) => item.id === postId);
  return { post: index === -1 ? null : posts[index], older: posts[index + 1] ?? null };
}
