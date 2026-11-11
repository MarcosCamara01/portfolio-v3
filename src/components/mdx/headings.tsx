import { Children, type ReactNode } from 'react';

// `1. Title` → number and title, so the number can be set in the signal colour.
export function splitNumber(title: string) {
  const match = title.match(/^(\d+)\.\s+([\s\S]*)$/);
  return match
    ? { number: match[1].padStart(2, '0'), text: match[2] }
    : { number: null, text: title };
}

function Anchor({ id }: { id: string }) {
  return (
    <>
      <span id={id} className="absolute -top-5" />
      <a
        href={`#${id}`}
        aria-label="Link to this section"
        className="invisible absolute -left-7 font-mono font-normal text-sub group-hover/heading:visible"
      >
        #
      </a>
    </>
  );
}

// Headings are authored as `## 1. Title [#id]`. MDX splits a heading with inline code
// or a link into several children, so the id comes off the last one and the number off
// the first, and the heading stays one row.
function withHeadingId(children: ReactNode, { numbered = false } = {}) {
  const parts = Children.toArray(children);

  let id: string | null = null;
  const last = parts.at(-1);
  if (typeof last === 'string') {
    const match = last.match(/\s*\[#([^\]]+)\]\s*$/);
    if (match) {
      id = match[1];
      parts[parts.length - 1] = last.slice(0, match.index);
    }
  }

  let number: string | null = null;
  if (numbered && typeof parts[0] === 'string') {
    const split = splitNumber(parts[0]);
    number = split.number;
    parts[0] = split.text;
  }

  return (
    <span className="group/heading relative flex gap-3.5">
      {id ? <Anchor id={id} /> : null}
      {number ? <span className="shrink-0 text-signal">{number}</span> : null}
      <span className="min-w-0">{parts}</span>
    </span>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="display mt-16 text-[30px] leading-[0.98] md:mt-[88px] md:text-[40px]">
      {withHeadingId(children, { numbered: true })}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="display mt-11 text-[22px] leading-none md:text-[26px]">
      {withHeadingId(children)}
    </h3>
  );
}
