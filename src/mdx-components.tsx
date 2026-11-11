import { A } from '@/components/mdx/a';
import { P } from '@/components/mdx/p';
import { H2 } from '@/components/mdx/h2';
import { H3 } from '@/components/mdx/h3';
import { OL } from '@/components/mdx/ol';
import { UL } from '@/components/mdx/ul';
import { Li } from '@/components/mdx/li';
import { HR } from '@/components/mdx/hr';
import { Code } from '@/components/mdx/code';
import { Image } from '@/components/mdx/image';
import { Snippet } from '@/components/mdx/snippet';
import { YouTube } from '@/components/mdx/youtube';

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
