'use client';

import { useEffect, useRef, useState } from 'react';

// As long as the screenshot's curtain, which it sits next to.
const DURATION = 1000;

// Counts up from zero the first time the badge scrolls into view.
export function StarCount({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION);
          setShown(Math.round(value * (1 - Math.pow(1 - t, 4))));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        setShown(0);
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span
      ref={ref}
      className="shrink-0 bg-signal px-2.5 py-1.5 text-[15px] font-bold tabular-nums text-signal-on"
    >
      <span aria-hidden>★ {shown}</span>
      <span className="sr-only">{value} GitHub stars</span>
    </span>
  );
}
