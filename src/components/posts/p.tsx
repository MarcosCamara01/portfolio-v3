import { cn } from '@/lib/utils';

export function P({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'mt-5 text-[17px] leading-[1.7] md:text-lg [blockquote_&]:m-0 [blockquote_&]:text-[length:inherit] [blockquote_&]:leading-[inherit] [li_&]:m-0 [li_&]:text-[length:inherit]',
        className
      )}
    >
      {children}
    </p>
  );
}
