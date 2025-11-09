'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function useScrollFix() {
  const pathname = usePathname();
  const isStatePopped = useRef(false);

  useEffect(() => {
    const onPopState = () => (isStatePopped.current = true);

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (!isStatePopped.current) {
      window.scrollTo(0, 0);
    } else {
      isStatePopped.current = false;
    }
  }, [pathname]);
}
