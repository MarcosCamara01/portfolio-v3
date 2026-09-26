'use client';

import { isValidElement, useState, type ReactElement, type ReactNode } from 'react';
import { Caption } from './caption';

type CodeElement = ReactElement<{ 'data-lang'?: string; children?: ReactNode }>;

function textOf(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (isValidElement(node)) return textOf((node as CodeElement).props.children);
  return '';
}

export const Snippet = ({ children, scroll = true, caption = null }: any) => {
  const [copied, setCopied] = useState(false);
  const code = isValidElement(children) ? (children as CodeElement) : null;
  const language = code?.props['data-lang'] ?? 'code';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(textOf(children));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (err) {
      console.error('Could not copy the snippet:', err);
    }
  };

  return (
    <div className="mt-6">
      <div className="bg-code text-code-ink">
        <div className="flex items-center justify-between px-3.5 pt-2.5 font-mono text-xs uppercase tracking-[0.06em]">
          <span className="opacity-70">{language}</span>
          <button
            type="button"
            onClick={copy}
            aria-live="polite"
            className="press -mr-2 min-h-11 px-2 uppercase tracking-[0.06em] opacity-70 transition-opacity hover:opacity-100"
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
        </div>
        <pre
          className={`px-3.5 pb-4 pt-2 font-mono text-xs leading-[1.6] md:text-[13px] ${
            scroll ? 'overflow-x-auto' : 'whitespace-pre-wrap break-all'
          }`}
        >
          {children}
        </pre>
      </div>

      {caption != null ? <Caption>{caption}</Caption> : null}
    </div>
  );
};
