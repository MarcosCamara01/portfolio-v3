import Link from 'next/link';
import type { Post } from '@/get-posts';
import { postHref } from '@/lib/post-href';
import { ArrowRight } from '../common/icons';
import { formatMonth } from './format';

export function LatestPost({
  post,
  withDescription = false,
}: {
  post: Post;
  withDescription?: boolean;
}) {
  return (
    <Link
      href={postHref(post)}
      className="latest press flex flex-col gap-2.5 bg-inv p-4 text-inv-ink md:p-[22px]"
    >
      <span className="label flex items-center gap-2 text-inv-signal">
        Latest · {formatMonth(post.date)} · {post.minutes} min
        <ArrowRight size={13} className="latest-arrow" />
      </span>
      <span className="display latest-title text-[30px] leading-[0.98] md:text-[40px]">
        {post.title}
      </span>
      {withDescription && post.description ? (
        <span className="text-base leading-normal opacity-85">{post.description}</span>
      ) : null}
    </Link>
  );
}
