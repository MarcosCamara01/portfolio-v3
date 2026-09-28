// The opening blockquote of a post reads as a lede; any later one becomes an
// inverted pull quote (see `.prose-b4 > blockquote` in globals.css).
export function Blockquote({ children }: { children: React.ReactNode }) {
  return <blockquote>{children}</blockquote>;
}
