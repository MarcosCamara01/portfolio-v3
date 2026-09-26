'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';

const REST = 62;
const PEAK = 100;
const RADIUS = 160;

// A display title set letter by letter: the letters rise out of a mask on load,
// the signal dot lands last, and afterwards the letter nearest the pointer (or
// finger) widens on Archivo's `wdth` axis, with its neighbours following.
export function SplitTitle({
  lines,
  className,
  interactive = true,
}: {
  lines: string[];
  className?: string;
  interactive?: boolean;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const centers = useRef<{ el: HTMLElement; x: number; y: number }[]>([]);
  const frame = useRef(0);

  const measure = () => {
    const chars = ref.current?.querySelectorAll<HTMLElement>('[data-char]') ?? [];
    centers.current = [...chars].map((el) => {
      const r = el.getBoundingClientRect();
      return { el, x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
  };

  const onMove = (event: React.PointerEvent) => {
    if (!interactive || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const { clientX, clientY } = event;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      for (const { el, x, y } of centers.current) {
        const distance = Math.hypot(clientX - x, (clientY - y) * 1.6);
        const pull = Math.max(0, 1 - distance / RADIUS);
        el.style.fontStretch = `${REST + (PEAK - REST) * pull * pull}%`;
      }
    });
  };

  const onLeave = () => {
    cancelAnimationFrame(frame.current);
    for (const { el } of centers.current) el.style.fontStretch = '';
  };

  let index = 0;

  return (
    <h1
      ref={ref}
      aria-label={lines.join(' ')}
      onPointerEnter={measure}
      onPointerDown={(event) => {
        measure();
        onMove(event);
      }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerCancel={onLeave}
      onPointerUp={(event) => event.pointerType === 'touch' && onLeave()}
      className={cn('display split-title touch-pan-y select-none', className)}
    >
      {lines.map((line, lineIndex) => (
        <span key={line} aria-hidden className="split-line">
          {[...line].map((char) => (
            <span
              key={index}
              data-char
              className="split-char"
              style={{ '--i': index++ } as React.CSSProperties}
            >
              {char}
            </span>
          ))}
          {lineIndex === lines.length - 1 ? (
            <span className="split-dot text-signal" style={{ '--i': index } as React.CSSProperties}>
              .
            </span>
          ) : null}
        </span>
      ))}
    </h1>
  );
}
