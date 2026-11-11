import { usePathname } from 'next/navigation';
import type { Post } from '@/lib/posts';

// Posts live at /{year}/{slug}; the header and footer find theirs from the URL.
export function useCurrentPost(posts: Post[]) {
  const [, year, slug] = usePathname().split('/');
  const index = posts.findIndex((item) => item.year === year && item.id === slug);
  return { post: index === -1 ? null : posts[index], older: posts[index + 1] ?? null };
}
