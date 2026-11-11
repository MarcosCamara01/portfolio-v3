// Lives apart from posts.ts, which reads the filesystem, so client components can import it.
export function postHref(post: { id: string; year: string }) {
  return `/${post.year}/${post.id}`;
}
