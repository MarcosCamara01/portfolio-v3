'use client';

import { useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import type { Post } from '@/get-posts';
import { PostRow } from './post-row';
import { formatDay } from './format';
import { LatestPost } from './latest-post';

const ALL = 'All';

export function PostList({ posts }: { posts: Post[] }) {
  const [active, setActive] = useState(ALL);
  const reduced = useReducedMotion();
  const tags = [ALL, ...new Set(posts.map((post) => post.tag).filter((t): t is string => !!t))];
  const visible = active === ALL ? posts : posts.filter((post) => post.tag === active);

  const [latest, ...older] = visible;
  const years = older.reduce<Record<string, Post[]>>((acc, post) => {
    (acc[post.year] ??= []).push(post);
    return acc;
  }, {});
  const ordered = Object.entries(years).sort(([a], [b]) => Number(b) - Number(a));

  const spring = reduced
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 500, damping: 40 };

  return (
    <LayoutGroup>
      <div role="group" aria-label="Filter posts by topic" className="flex gap-2 pb-7 pt-5">
        {tags.map((tag) => {
          const on = tag === active;
          return (
            <button
              key={tag}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(tag)}
              className="label press relative h-11 px-4"
            >
              {on ? (
                <motion.span
                  layoutId="chip"
                  transition={spring}
                  className="absolute inset-0 bg-inv"
                  aria-hidden
                />
              ) : null}
              <span className={on ? 'relative text-inv-ink' : 'relative'}>{tag}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="popLayout" initial={false}>
        {latest ? (
          <motion.div
            key={`latest-${latest.id}`}
            layout={!reduced}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={spring}
          >
            <LatestPost post={latest} withDescription />
          </motion.div>
        ) : null}
        {ordered.map(([year, list]) => (
          <motion.section
            key={year}
            layout={!reduced}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={spring}
          >
            <div className="mt-11 flex items-baseline justify-between pb-2.5 md:mt-[72px]">
              <h2 className="display text-4xl leading-none md:text-5xl">{year}</h2>
              <span className="label">
                {list.length} {list.length === 1 ? 'post' : 'posts'}
              </span>
            </div>
            {list.map((post) => (
              <motion.div key={post.id} layout={!reduced} transition={spring}>
                <PostRow post={post} date={formatDay(post.date)} detailed />
              </motion.div>
            ))}
          </motion.section>
        ))}
      </AnimatePresence>
    </LayoutGroup>
  );
}
