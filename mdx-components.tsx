import { A } from '@/components/posts/a';
import { P } from '@/components/posts/p';
import { H1 } from '@/components/posts/h1';
import { H2 } from '@/components/posts/h2';
import { H3 } from '@/components/posts/h3';
import { OL } from '@/components/posts/ol';
import { UL } from '@/components/posts/ul';
import { Li } from '@/components/posts/li';
import { HR } from '@/components/posts/hr';
import { Code } from '@/components/posts/code';
import { AllTweet } from '@/components/posts/tweet';
import { Image } from '@/components/posts/image';
import { Figure } from '@/components/posts/figure';
import { Snippet } from '@/components/posts/snippet';
import { Caption } from '@/components/posts/caption';
import { Callout } from '@/components/posts/callout';
import { YouTube } from '@/components/posts/youtube';
import { Ref, FootNotes, FootNote } from '@/components/posts/footnotes';
import { Blockquote } from '@/components/posts/blockquote';

export function useMDXComponents(components: { [component: string]: React.ComponentType }) {
  return {
    ...components,
    a: A,
    h1: H1,
    h2: H2,
    h3: H3,
    p: P,
    ol: OL,
    ul: UL,
    li: Li,
    hr: HR,
    code: Code,
    pre: Snippet,
    img: Image,
    blockquote: Blockquote,
    Tweet: AllTweet,
    Image,
    Figure,
    Snippet,
    Caption,
    Callout,
    YouTube,
    Ref,
    FootNotes,
    FootNote,
  };
}
