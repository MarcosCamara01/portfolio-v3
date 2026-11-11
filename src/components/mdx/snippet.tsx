'use client';

import {
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';

type CodeElement = ReactElement<{ 'data-lang'?: string; children?: ReactNode }>;

function textOf(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (isValidElement(node)) return textOf((node as CodeElement).props.children);
  return '';
}

export function Snippet({ children }: { children: ReactNode }) {
  const [copied, setCopied] = useState(false);
  const [scrolls, setScrolls] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const pre = useRef<HTMLPreElement>(null);
  const code = isValidElement(children) ? (children as CodeElement) : null;
  const language = code?.props['data-lang'] ?? 'code';

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // A block that overflows has to take focus, or keyboard users can't scroll it.
  useEffect(() => {
    const el = pre.current;
    if (!el) return;
    const check = () => setScrolls(el.scrollWidth > el.clientWidth);
    const observer = new ResizeObserver(check);
    observer.observe(el);
    // The mono font loads late and widens the code without resizing the box.
    document.fonts.ready.then(check);
    document.fonts.addEventListener('loadingdone', check);
    return () => {
      observer.disconnect();
      document.fonts.removeEventListener('loadingdone', check);
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(textOf(children));
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch (err) {
      console.error('Could not copy the snippet:', err);
    }
  };

  return (
    <div className="mt-6">
      <div className="bg-code text-code-ink">
        <div className="flex items-center justify-between px-3.5 pt-2.5 font-mono text-xs uppercase tracking-[0.06em]">
          <span className="opacity-70">{language}</span>
          <span aria-live="polite" className="sr-only">
            {copied ? 'Copied to clipboard' : ''}
          </span>
          <button
            type="button"
            onClick={copy}
            aria-label="Copy code"
            data-copied={copied || undefined}
            className="copy press -mr-2 grid min-h-11 items-center px-2 uppercase tracking-[0.06em]"
          >
            <span aria-hidden className="copy-label">
              Copy
            </span>
            <span aria-hidden className="copy-label">
              Copied ✓
            </span>
          </button>
        </div>
        <pre
          ref={pre}
          tabIndex={scrolls ? 0 : undefined}
          className="overflow-x-auto overscroll-x-contain px-3.5 pb-4 pt-2 font-mono text-xs leading-[1.6] md:text-[13px]"
        >
          {children}
        </pre>
      </div>
    </div>
  );
}
