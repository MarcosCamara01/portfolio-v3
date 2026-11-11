'use client';

import { useEffect, useRef } from 'react';

// As long as the screenshot's curtain, which it sits next to.
const DURATION = 1000;

const format = (n: number) => n.toLocaleString('en-US');

// Counts up from zero the first time the badge scrolls into view. Digits are written
// straight to the DOM (no render per frame), and an invisible copy of the final value
// holds the badge at its final width, so the title beside it never rewraps.
export function StarCount({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const num = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    // React's own text node: writing its value keeps React's DOM in sync.
    const text = num.current?.firstChild;
    const entered = 'entered' in document.documentElement.dataset; // see RevealObserver
    if (!node || !text || entered || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      return;
    // Already on screen (or above it) when it mounts: keep the real count rather than
    // dropping to 0 in view.
    if (node.getBoundingClientRect().top < window.innerHeight) return;

    text.nodeValue = '0';
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION);
          text.nodeValue = format(Math.round(value * (1 - Math.pow(1 - t, 4))));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      text.nodeValue = format(value);
    };
  }, [value]);

  return (
    <span
      ref={ref}
      className="grid shrink-0 bg-signal px-2.5 py-1.5 text-[15px] font-bold tabular-nums text-signal-on"
    >
      <span aria-hidden className="invisible col-start-1 row-start-1">
        ★ {format(value)}
      </span>
      <span aria-hidden className="col-start-1 row-start-1 text-right">
        ★ <span ref={num}>{format(value)}</span>
      </span>
      <span className="sr-only">{format(value)} GitHub stars</span>
    </span>
  );
}
