'use client';

import { useSelectedLayoutSegments } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { ago } from 'time-ago';
import useSWR from 'swr';
import type { Post } from '@/get-posts';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function Header({ posts }: { posts: Post[] }) {
  const segments = useSelectedLayoutSegments();
  const postId = segments?.length >= 2 ? segments[1] : null;

  const initialPost = posts.find((post) => post.id === postId);
  const { data: post, mutate } = useSWR(
    initialPost?.id ? `/api/view?id=${initialPost.id}` : null,
    fetcher,
    {
      fallbackData: initialPost,
      refreshInterval: 5000,
    }
  );

  if (initialPost == null) return <></>;

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

        <span className="pr-1.5">
          <Views id={post.id} mutate={mutate} defaultValue={post.viewsFormatted} />
        </span>
      </p>
    </>
  );
}

function Views({ id, mutate, defaultValue }: any) {
  const views = defaultValue;
  const didLogViewRef = useRef(false);

  useEffect(() => {
    if ('development' === process.env.NODE_ENV) return;
    if (!didLogViewRef.current) {
      const url = '/api/view?incr=1&id=' + encodeURIComponent(id);
      fetch(url)
        .then((res) => res.json())
        .then((obj) => {
          mutate(obj);
        })
        .catch(console.error);
      didLogViewRef.current = true;
    }
  });

  return <>{views != null ? <span>{views} views</span> : null}</>;
}
