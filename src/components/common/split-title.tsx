'use client';

import { useEffect, useRef, type CSSProperties, type PointerEvent } from 'react';
import { cn } from '@/lib/cn';

const REST = 62;
const PEAK = 100;
// 160px at the 168px desktop size; scaling with the font keeps the same number of
// neighbours following on a phone.
const RADIUS_EM = 0.95;
// Width an Archivo capital gains from wdth 62 to 100 (measured 0.25–0.28em).
const GROW_EM = 0.27;

type Char = { el: HTMLElement; line: number; x: number; y: number };

// A display title set letter by letter: the letters rise out of a mask on load, the
// signal dot lands last, and afterwards the letter nearest the pointer (or a finger
// dragging sideways) widens on Archivo's `wdth` axis, with its neighbours following.
// Each line's growth is capped by its free space, so the title never rewraps.
export function SplitTitle({ lines, className }: { lines: string[]; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const chars = useRef<Char[]>([]);
  const slack = useRef<number[]>([]);
  const size = useRef(0);
  const reduced = useRef(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const frame = useRef(0);

  useEffect(() => {
    const h1 = ref.current;
    if (!h1) return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncReduced = () => (reduced.current = query.matches);
    syncReduced();
    query.addEventListener('change', syncReduced);

    // Rest positions from layout: offset* ignore the rise transform and the page scroll,
    // so they hold while the letters animate in and after the page moves under the pointer.
    const measure = () => {
      size.current = parseFloat(getComputedStyle(h1).fontSize);
      chars.current = [];
      slack.current = [...h1.querySelectorAll<HTMLElement>('.split-line')].map((line, i) => {
        const items = [...line.children] as HTMLElement[];
        for (const el of items) {
          if (!el.hasAttribute('data-char')) continue;
          chars.current.push({
            el,
            line: i,
            x: el.offsetLeft + el.offsetWidth / 2,
            y: el.offsetTop + el.offsetHeight / 2,
          });
        }
        const last = items[items.length - 1];
        return h1.clientWidth - (last.offsetLeft + last.offsetWidth) - 2;
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(h1);
    document.fonts.ready.then(measure);

    return () => {
      observer.disconnect();
      query.removeEventListener('change', syncReduced);
      cancelAnimationFrame(frame.current);
    };
  }, []);

  const apply = (clientX: number, clientY: number) => {
    const h1 = ref.current;
    if (!h1) return;
    const box = h1.getBoundingClientRect();
    const radius = RADIUS_EM * size.current;
    const pull = chars.current.map(({ x, y }) => {
      const distance = Math.hypot(clientX - box.left - x, (clientY - box.top - y) * 1.6);
      const p = Math.max(0, 1 - distance / radius);
      return p * p;
    });
    slack.current.forEach((free, line) => {
      let grow = 0;
      chars.current.forEach((c, i) => {
        if (c.line === line) grow += pull[i] * GROW_EM * size.current;
      });
      if (grow <= free) return;
      const scale = Math.max(0, free) / grow;
      chars.current.forEach((c, i) => {
        if (c.line === line) pull[i] *= scale;
      });
    });
    chars.current.forEach(({ el }, i) => {
      el.style.setProperty('font-stretch', `${REST + (PEAK - REST) * pull[i]}%`);
    });
  };

  const onMove = (event: PointerEvent) => {
    if (reduced.current) return;
    const { clientX, clientY } = event;
    // On touch, start only once the finger moves sideways: a vertical swipe that begins
    // on the name is a scroll (touch-pan-y) and must not touch the letters.
    if (event.pointerType === 'touch' && touchStart.current) {
      const dx = Math.abs(clientX - touchStart.current.x);
      const dy = Math.abs(clientY - touchStart.current.y);
      if (dx <= dy) return;
      touchStart.current = null;
    }
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => apply(clientX, clientY));
  };

  const onLeave = () => {
    touchStart.current = null;
    cancelAnimationFrame(frame.current);
    for (const { el } of chars.current) el.style.removeProperty('font-stretch');
  };

  let index = 0;

  return (
    <h1
      ref={ref}
      aria-label={lines.join(' ')}
      onPointerDown={(event) => {
        if (event.pointerType === 'touch')
          touchStart.current = { x: event.clientX, y: event.clientY };
        else onMove(event);
      }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerCancel={onLeave}
      onPointerUp={(event) => event.pointerType === 'touch' && onLeave()}
      className={cn('display split-title touch-pan-y [@media(hover:none)]:select-none', className)}
    >
      {lines.map((line, lineIndex) => (
        <span key={line} aria-hidden className="split-line">
          {[...line].map((char) => (
            <span
              key={index}
              data-char
              className="split-char"
              style={{ '--i': index++ } as CSSProperties}
            >
              {char}
            </span>
          ))}
          {lineIndex === lines.length - 1 ? (
            <span className="split-dot text-signal" style={{ '--i': index } as CSSProperties}>
              .
            </span>
          ) : null}
        </span>
      ))}
    </h1>
  );
}
