import Link from 'next/link';
import { cn } from '@/lib/utils';

export function A({ children, className = '', href, ...props }: any) {
  const styles =
    'border-b text-color-primary border-gray-300 transition-[border-color] hover:border-gray-600 dark:border-gray-600 dark:hover:border-gray-300';

  if (href?.[0] === '#') {
    return (
      <a href={href} className={cn(styles, className)} {...props}>
        <strong>{children}</strong>
      </a>
    );
  }

  if (href?.startsWith('http')) {
    return (
      <a href={href} className={cn(styles, className)} target="_blank" rel="noopener" {...props}>
        <strong>{children}</strong>
      </a>
    );
  }

  return (
    <Link href={href || ''} className={cn(styles, className)} {...props}>
      <strong>{children}</strong>
    </Link>
  );
}
