'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// Scroll entrances for `[data-reveal]` elements (styles in globals.css). Only elements
// still below the fold after hydration are hidden (`data-pending`) until they scroll in
// (`data-inview`); anything already on screen runs its entrance from CSS at load, so
// nothing flashes while hydrating. After the first client-side route change,
// `<html data-entered>` switches entrances off: they belong to the first page of a visit.
export function RevealObserver() {
  const pathname = usePathname();
  const first = useRef(pathname);

  // Runs before the new route paints, so no frame of a replayed entrance shows.
  useLayoutEffect(() => {
    if (pathname !== first.current) document.documentElement.dataset.entered = '';
  }, [pathname]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if ('entered' in document.documentElement.dataset) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          // A title carries its section: the list and screenshot start on its beat
          // (250ms in, see globals.css) whatever the scroll speed.
          const section = el.dataset.reveal === 'title' ? el.closest('section') : null;
          const group = section
            ? [...section.querySelectorAll<HTMLElement>('[data-reveal][data-pending]')]
            : [el];
          for (const node of group) {
            delete node.dataset.pending;
            node.dataset.inview = '';
            observer.unobserve(node);
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px' }
    );

    // Already-pending elements are observed again too: effects can run twice (Strict
    // Mode, route changes) and a pending element nobody watches would stay hidden.
    const fold = window.innerHeight;
    document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-inview])').forEach((el) => {
      if (!('pending' in el.dataset) && el.getBoundingClientRect().top < fold) return;
      el.dataset.pending = '';
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
