'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const next = resolvedTheme === 'dark' ? 'light' : 'dark';

  const toggle = () => {
    const root = document.documentElement;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!document.startViewTransition || reduced) {
      setTheme(next);
      return;
    }

    // A short cross-fade between the two themes (styles in globals.css).
    const transition = document.startViewTransition(() => {
      // Apply the class synchronously so the transition captures the new theme;
      // next-themes then persists it.
      root.classList.toggle('dark', next === 'dark');
      root.style.colorScheme = next;
      setTheme(next);
    });
    // The browser skips the animation (e.g. a hidden tab) but still applies the update.
    transition.ready.catch(() => {});
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mounted ? `Switch to ${next} theme` : 'Switch theme'}
      className="press label flex h-11 items-center gap-2 px-2.5"
    >
      <span
        aria-hidden
        className="theme-icon size-3.5 rounded-full border-2 border-ink bg-[linear-gradient(90deg,var(--ink)_50%,transparent_50%)] dark:rotate-180"
      />
      <span className="hidden min-w-[3.2em] text-left md:inline">
        {mounted ? (next === 'dark' ? 'Dark' : 'Light') : ''}
      </span>
    </button>
  );
}
