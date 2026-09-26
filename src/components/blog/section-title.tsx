import { cn } from '@/lib/utils';

export function SectionTitle({
  children,
  aside,
  className,
}: {
  children: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mb-3.5 mt-20 flex items-baseline justify-between md:mt-28', className)}>
      <h2 data-reveal="title" className="display text-4xl leading-none md:text-5xl">
        {children}
      </h2>
      {aside ? <span className="label">{aside}</span> : null}
    </div>
  );
}
