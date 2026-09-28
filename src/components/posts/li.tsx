// Markers come from the parent list: numbered 01, 02… in an <OL>, a square in a <UL>.
export function Li({ children }: { children: React.ReactNode }) {
  return (
    <li
      className={`
        grid grid-cols-[32px_minmax(0,1fr)] gap-2 border-t border-soft py-3
        text-[17px] leading-[1.6] md:text-lg
        before:font-bold before:text-signal
        [ol_&]:[counter-increment:item]
        [ol_&]:before:content-[counter(item,decimal-leading-zero)]
        [ul_&]:before:pt-1.5 [ul_&]:before:text-xs [ul_&]:before:content-['■']
      `}
    >
      <div>{children}</div>
    </li>
  );
}
