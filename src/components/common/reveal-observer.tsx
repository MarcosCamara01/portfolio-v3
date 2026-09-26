'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Scroll entrances for `[data-reveal]` elements. Nothing is hidden in the server
// HTML: after hydration, elements still below the fold get `data-pending` (hidden,
// off-screen so nothing flashes) and switch to `data-inview` when they scroll in.
// Anything already on screen stays as it is, so it never delays first paint or LCP.
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          [...el.children].forEach((child, i) =>
            (child as HTMLElement).style.setProperty('--i', String(i))
          );
          delete el.dataset.pending;
          el.dataset.inview = '';
          observer.unobserve(el);
        }
      },
      { rootMargin: '0px 0px -12% 0px' }
    );

    const fold = window.innerHeight;
    document
      .querySelectorAll<HTMLElement>('[data-reveal]:not([data-inview]):not([data-pending])')
      .forEach((el) => {
        if (el.getBoundingClientRect().top < fold) return;
        el.dataset.pending = '';
        observer.observe(el);
      });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
