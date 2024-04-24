export const Callout = ({ emoji = null, text = null, children }: any) => (
  <div className="bg-gray-200 dark:bg-foreground dark:text-gray-300 rounded flex items-start p-3 my-6 text-base">
    <span className="block w-6 text-center mr-2 scale-[1.2]">{emoji}</span>
    <span className="block grow">{text ?? children}</span>
  </div>
);
