import { withHeadingId } from './utils';

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="display mt-16 text-[30px] leading-[0.98] md:mt-[88px] md:text-[40px]">
      {withHeadingId(children, { numbered: true })}
    </h2>
  );
}
