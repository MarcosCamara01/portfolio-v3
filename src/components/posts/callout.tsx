export const Callout = ({ text = null, children }: any) => (
  <div className="my-6 flex items-start gap-3 bg-surface p-4 text-base leading-[1.6]">
    <span aria-hidden className="mt-2 size-2 shrink-0 bg-signal" />
    <span className="block grow">{text ?? children}</span>
  </div>
);
