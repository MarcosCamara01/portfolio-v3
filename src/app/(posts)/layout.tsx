import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <article>
      <div
        aria-hidden
        className="read-progress fixed inset-x-0 top-0 z-50 hidden h-[3px] origin-left bg-signal"
      />
      {children}
    </article>
  );
}
