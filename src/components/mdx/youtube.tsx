'use client';

import YT, { type YouTubeProps } from 'react-youtube';

const OPTS = { height: '350', width: '624' };

export function YouTube(props: YouTubeProps) {
  return (
    <span className="block my-5 rounded aspect-[1.78/1] overflow-hidden">
      <YT opts={OPTS} className="w-full h-full" {...props} />
    </span>
  );
}
