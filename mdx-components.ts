import { A as a } from "@/components/posts/a";
import { P as p } from "@/components/posts/p";
import { H1 as h1 } from "@/components/posts/h1";
import { H2 as h2 } from "@/components/posts/h2";
import { H3 as h3 } from "@/components/posts/h3";
import { OL as ol } from "@/components/posts/ol";
import { UL as ul } from "@/components/posts/ul";
import { LI as li } from "@/components/posts/li";
import { HR as hr } from "@/components/posts/hr";
import { Code as code } from "@/components/posts/code";
import { Tweet } from "@/components/posts/tweet";
import { Image } from "@/components/posts/image";
import { Figure } from "@/components/posts/figure";
import { Snippet } from "@/components/posts/snippet";
import { Caption } from "@/components/posts/caption";
import { Callout } from "@/components/posts/callout";
import { YouTube } from "@/components/posts/youtube";
import { Ref, FootNotes, FootNote } from "@/components/posts/footnotes";
import { Blockquote as blockquote } from "@/components/posts/blockquote";

export function useMDXComponents(components: {
  [component: string]: React.ComponentType;
}) {
  return {
    ...components,
    a,
    h1,
    h2,
    h3,
    p,
    ol,
    ul,
    li,
    hr,
    code,
    pre: Snippet,
    img: Image,
    blockquote,
    Tweet,
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
