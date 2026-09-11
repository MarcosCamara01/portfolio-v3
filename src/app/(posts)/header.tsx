'use client';

import { useSelectedLayoutSegments } from 'next/navigation';
import { ago } from 'time-ago';
import type { Post } from '@/get-posts';

export function Header({ posts }: { posts: Post[] }) {
  const segments = useSelectedLayoutSegments();
  const postId = segments?.length >= 2 ? segments[1] : null;
  const post = posts.find((item) => item.id === postId);

  if (post == null) return <></>;

  return (
    <>
      <h1 className="text-[26px] font-bold mb-3 dark:text-gray-100">{post.title}</h1>

      <p className="font-mono flex text-xs md:mb-10 text-gray-500 dark:text-gray-500">
        <span className="flex-grow">
          <span className="hidden md:inline">
            <span>
              <a
                href="https://twitter.com/marcoscamara01"
                className="hover:text-gray-800 dark:hover:text-gray-400"
                target="_blank"
              >
                @marcoscamara01
              </a>
            </span>

            <span className="mx-2">|</span>
          </span>

          <span suppressHydrationWarning={true}>
            {post.date} ({ago(post.date, true)} ago)
          </span>
        </span>
      </p>
    </>
  );
}
