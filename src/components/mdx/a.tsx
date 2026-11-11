import Link from 'next/link';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export function A({ children, className, href = '', ...props }: ComponentProps<'a'>) {
  const styles = cn('link', className);

  if (href.startsWith('#')) {
    return (
      <a href={href} className={styles} {...props}>
        {children}
      </a>
    );
  }

  if (href.startsWith('http')) {
    return (
      <a href={href} className={styles} target="_blank" rel="noopener" {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={styles} {...props}>
      {children}
    </Link>
  );
}
