import Link from 'next/link';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

// In-page anchors and external URLs are plain links (external ones open in a new tab);
// site paths go through next/link for client-side navigation.
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
