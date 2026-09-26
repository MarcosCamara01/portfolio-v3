import Link from 'next/link';
import { cn } from '@/lib/utils';

export function A({ children, className = '', href, ...props }: any) {
  const styles = cn('link', className);

  if (href?.[0] === '#') {
    return (
      <a href={href} className={styles} {...props}>
        {children}
      </a>
    );
  }

  if (href?.startsWith('http')) {
    return (
      <a href={href} className={styles} target="_blank" rel="noopener" {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href || ''} className={styles} {...props}>
      {children}
    </Link>
  );
}
