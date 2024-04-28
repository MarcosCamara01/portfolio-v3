import { Caption } from "./caption";

export const Snippet = ({ children, scroll = true, caption = null }: any) => (
  <div className="my-6">
    <pre
      className={`
      p-4
      text-sm
      bg-foreground 
      rounded
      ${
        scroll
          ? "overflow-auto"
          : "whitespace-pre-wrap break-all overflow-hidden"
      }
    `}
    >
      <code>{children}</code>
    </pre>

    {caption != null ? <Caption>{caption}</Caption> : null}
  </div>
);
