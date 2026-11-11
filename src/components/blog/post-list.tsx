'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  LayoutGroup,
  LazyMotion,
  domMax,
  m,
  useReducedMotion,
} from 'framer-motion';
import type { Post } from '@/lib/posts';
import { cn } from '@/lib/cn';
import { formatDay } from '@/lib/dates';
import { PostRow } from './post-row';
import { LatestPost } from './latest-post';

const ALL = 'All';
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

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

  const groupRef = useRef<HTMLDivElement>(null);
  // The active block is an inverted copy of the chip row, clipped to the active chip.
  // Undefined until measured, so the server HTML and first paint mark the chip statically.
  // Only a click slides it; a resize or a late font swap moves it in place.
  const [clip, setClip] = useState<{ value: string; animate: boolean }>();
  const clicked = useRef(false);

  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    const update = (animate: boolean) => {
      const chip = group.querySelector<HTMLElement>('button[aria-pressed="true"]');
      if (!chip) return;
      const { offsetTop: top, offsetLeft: left, offsetWidth: width, offsetHeight: height } = chip;
      const right = group.offsetWidth - left - width;
      const bottom = group.offsetHeight - top - height;
      const value = `inset(${top}px ${right}px ${bottom}px ${left}px)`;
      // Keep the previous state when nothing moved, so the observer's first callback
      // doesn't cancel a slide that a click just started.
      setClip((prev) => (prev?.value === value ? prev : { value, animate }));
    };
    update(clicked.current);
    clicked.current = false;
    const settle = () => update(false);
    document.fonts.ready.then(settle);
    const observer = new ResizeObserver(settle);
    observer.observe(group);
    return () => observer.disconnect();
  }, [active]);

  const spring = reduced
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 500, damping: 40 };
  // Swaps are opacity only. The leaving block fades fast and out of flow (popLayout); the
  // new one starts just before that ends, so two inverted blocks never stack.
  const swap = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: reduced ? { duration: 0 } : { delay: 0.09, duration: 0.22, ease: EASE_OUT_EXPO },
    },
    exit: {
      opacity: 0,
      transition: reduced ? { duration: 0 } : { duration: 0.12, ease: EASE_OUT_EXPO },
    },
  };
  // Position only: a section that changes height must not scale its heading.
  const layout = reduced ? false : ('position' as const);

  return (
    // domMax: the rows and sections rely on layout animations.
    <LazyMotion features={domMax} strict>
      <LayoutGroup>
        <div className="pb-7 pt-5">
          <div
            ref={groupRef}
            role="group"
            aria-label="Filter posts by topic"
            className="relative flex flex-wrap gap-2"
          >
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                aria-pressed={tag === active}
                onClick={() => {
                  if (tag === active) return;
                  clicked.current = true;
                  setActive(tag);
                }}
                className={cn(
                  'chip label press h-11 whitespace-nowrap px-4',
                  !clip && tag === active && 'bg-inv text-inv-ink'
                )}
              >
                {tag}
              </button>
            ))}
            {clip ? (
              <div
                aria-hidden
                className="chip-overlay pointer-events-none absolute inset-0 flex flex-wrap gap-2 bg-inv text-inv-ink"
                style={{ clipPath: clip.value, transition: clip.animate ? undefined : 'none' }}
              >
                {tags.map((tag) => (
                  <span key={tag} className="label flex h-11 items-center whitespace-nowrap px-4">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <AnimatePresence mode="popLayout" initial={false}>
          {latest ? (
            <m.div key={`latest-${latest.id}`} layout={layout} {...swap} transition={spring}>
              <LatestPost post={latest} withDescription />
            </m.div>
          ) : null}
          {ordered.map(([year, list]) => (
            <m.section key={year} layout={layout} {...swap} transition={spring}>
              <div className="flex items-baseline justify-between pb-2.5 pt-11 md:pt-[72px]">
                <h2 className="display text-4xl leading-none md:text-5xl">{year}</h2>
                <span className="label">
                  {list.length} {list.length === 1 ? 'post' : 'posts'}
                </span>
              </div>
              <AnimatePresence mode="popLayout" initial={false}>
                {list.map((post) => (
                  <m.div key={post.id} layout={layout} {...swap} transition={spring}>
                    <PostRow post={post} date={formatDay(post.date)} detailed />
                  </m.div>
                ))}
              </AnimatePresence>
            </m.section>
          ))}
        </AnimatePresence>
      </LayoutGroup>
    </LazyMotion>
  );
}
