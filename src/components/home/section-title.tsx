import type { ReactNode } from 'react';

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3.5 mt-20 flex items-baseline justify-between md:mt-28">
      <h2 data-reveal="title" className="display text-4xl leading-none md:text-5xl">
        {children}
      </h2>
    </div>
  );
}
