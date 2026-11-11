import type { MDXComponents } from 'mdx/types';
import { A } from '@/components/mdx/a';
import { P } from '@/components/mdx/p';
import { H2, H3 } from '@/components/mdx/headings';
import { OL, UL, Li } from '@/components/mdx/lists';
import { HR } from '@/components/mdx/hr';
import { Code } from '@/components/mdx/code';
import { Image } from '@/components/mdx/image';
import { Snippet } from '@/components/mdx/snippet';
import { YouTube } from '@/components/mdx/youtube';
import { ArticleShell } from '@/components/article/article-shell';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    wrapper: ArticleShell,
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
