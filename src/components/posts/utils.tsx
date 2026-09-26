import { Children } from 'react';

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
      <a id={id} className="absolute -top-5" />
      <a
        href={`#${id}`}
        aria-label="Link to this section"
        className="invisible absolute -left-7 font-mono font-normal text-sub [span:hover>&]:visible"
      >
        #
      </a>
    </>
  );
}

// Headings are authored as `## 1. Title [#id]`: strip the id into an anchor and
// pull a leading number out so it can be styled separately.
export function withHeadingId(children: React.ReactNode, { numbered = false } = {}) {
  return Children.map(children, (el) => {
    if ('string' !== typeof el) return el;

    const match = el.match(/\[#([^\]]+)\]\s*$/m);
    const label = match ? el.substring(0, match.index).trimEnd() : el;
    const { number, text } = numbered ? splitNumber(label) : { number: null, text: label };

    return (
      <span className="relative flex gap-3.5">
        {match?.[1] ? <Anchor id={match[1]} /> : null}
        {number ? <span className="text-signal">{number}</span> : null}
        <span>{text}</span>
      </span>
    );
  });
}
