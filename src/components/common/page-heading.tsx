import type { ReactNode } from 'react';
import { SplitTitle } from './split-title';

// Title and intro of the pages that are not home: /blog and the 404.
export function PageHeading({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <SplitTitle
        lines={[title]}
        className="mt-[18px] text-[clamp(64px,21.5vw,132px)] leading-[0.86] md:mt-6"
      />
      <p className="hero-intro max-w-[420px] pt-5 text-[17px] font-medium leading-[1.4] md:text-lg">
        {children}
      </p>
    </>
  );
}
