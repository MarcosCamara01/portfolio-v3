// Lives apart from get-posts.ts, which reads the filesystem, so client components can import it.
export const postHref = (post: { id: string; year: string }) => `/${post.year}/${post.id}`;
