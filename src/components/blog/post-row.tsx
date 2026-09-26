import Link from 'next/link';
import type { Post } from '@/get-posts';
import { postHref } from '@/lib/post-href';
import { ArrowRight } from '../common/icons';

export function PostRow({
  post,
  date,
  detailed = false,
}: {
  post: Post;
  date: string;
  detailed?: boolean;
}) {
  return (
    <Link
      href={postHref(post)}
      className="row flex flex-col gap-1 border-t border-soft py-3.5 md:grid md:grid-cols-[120px_minmax(0,1fr)] md:gap-4 md:py-4"
    >
      <span className="label md:pt-0.5 md:text-[15px] md:normal-case md:tracking-normal">
        {date}
      </span>
      <span className="row-body flex flex-col gap-1.5 pr-6">
        <span className="text-[17px] font-semibold leading-[1.3] md:text-[19px]">{post.title}</span>
        {detailed && post.description ? (
          <span className="row-sub text-[15px] leading-normal text-sub">{post.description}</span>
        ) : null}
        {detailed ? (
          <span className="row-sub text-[13px] font-medium text-sub">
            {[post.tag, `${post.minutes} min`].filter(Boolean).join(' · ')}
          </span>
        ) : null}
      </span>
      <ArrowRight className="row-arrow absolute right-0 top-1/2 -translate-y-1/2" />
    </Link>
  );
}
