import { A } from '@/components/posts/a';
import { P } from '@/components/posts/p';
import { H2 } from '@/components/posts/h2';
import { H3 } from '@/components/posts/h3';
import { OL } from '@/components/posts/ol';
import { UL } from '@/components/posts/ul';
import { Li } from '@/components/posts/li';
import { HR } from '@/components/posts/hr';
import { Code } from '@/components/posts/code';
import { Image } from '@/components/posts/image';
import { Snippet } from '@/components/posts/snippet';
import { YouTube } from '@/components/posts/youtube';

export function useMDXComponents(components: { [component: string]: React.ComponentType }) {
  return {
    ...components,
    a: A,
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
    YouTube,
  };
}
