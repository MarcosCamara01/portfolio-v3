import { withHeadingId } from './utils';

export function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="display mt-11 text-[22px] leading-none md:text-[26px]">
      {withHeadingId(children)}
    </h3>
  );
}
