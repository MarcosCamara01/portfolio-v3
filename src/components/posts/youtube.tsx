"use client";

import YT from "react-youtube";

export function YouTube(props: any) {
  const opts = {
    height: "350",
    width: "624",
  };

  return (
    <span className="block my-5 rounded aspect-[1.78/1] overflow-hidden">
      <YT opts={opts} className="w-full h-full" {...props} />
    </span>
  );
}
