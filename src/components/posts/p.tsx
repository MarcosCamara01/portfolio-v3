import { cn } from '@/lib/utils';

export function P({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('my-5 [blockquote_&]:my-2', className)}>{children}</p>;
}
