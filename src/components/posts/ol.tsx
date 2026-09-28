export function OL({ children }: { children: React.ReactNode }) {
  return <ol className="mt-5 [counter-reset:item]">{children}</ol>;
}
