import { withHeadingId } from './utils';

export function H1({ children }: { children: React.ReactNode }) {
  return <h1 className="display mt-12 text-[40px] leading-[0.95]">{withHeadingId(children)}</h1>;
}
