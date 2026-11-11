import type { ReactNode } from 'react';

export function Caption({ children }: { children: ReactNode }) {
  return (
    <span className="my-3 block w-full text-center font-mono text-xs leading-normal text-sub [text-wrap:balance]">
      {children}
    </span>
  );
}
