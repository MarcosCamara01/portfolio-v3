import { cn } from '@/lib/utils';

export const Code = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  // Fenced blocks arrive as `language-xyz`; keep it readable for <Snippet>, which
  // only sees this already-rendered element.
  const language = className?.match(/language-(\S+)/)?.[1];

  return (
    <code
      data-lang={language}
      className={cn(
        className,
        `[:is(p,li,h2,h3)_&]:bg-surface
        [:is(p,li,h2,h3)_&]:px-1.5
        [:is(p,li,h2,h3)_&]:py-0.5
        [:is(p,li,h2,h3)_&]:font-mono
        [:is(p,li,h2,h3)_&]:text-[0.85em]`
      )}
    >
      {children}
    </code>
  );
};
