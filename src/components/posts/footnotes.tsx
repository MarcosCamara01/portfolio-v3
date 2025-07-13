import { A } from "./a";
import { P } from "./p";

export const FootNotes = ({ children }: { children: React.ReactNode }) => (
  <div className="text-base before:w-[200px] before:m-auto before:content[''] before:border-t before:border-gray-300 dark:before:border-[#444] before:block before:my-10">
    {children}
  </div>
);

export const Ref = ({ id }: any) => (
  <a
    href={`#f${id}`}
    id={`s${id}`}
    className="relative text-xs top-[-5px] no-underline"
  >
    [{id}]
  </a>
);

export const FootNote = ({ id, children }: any) => (
  <P>
    {id}.{" "}
    <A href={`#s${id}`} className="no-underline">
      ^
    </A>{" "}
    {children}
  </P>
);
