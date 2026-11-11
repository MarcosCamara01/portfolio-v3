import sizeOf from 'image-size';
import { join } from 'path';
import { readFile } from 'fs/promises';
import NextImage from 'next/image';
import { Caption } from './caption';

async function fetchImage(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not fetch ${url}: ${res.status}`);
  return Buffer.from(new Uint8Array(await res.arrayBuffer()));
}

// Remote images are fetched and local ones are read from /public. A page rendered at
// request time on Vercel (where CI is unset) has no /public on disk, so it fetches local
// images from its own deployment instead.
async function readImage(src: string) {
  if (src.startsWith('http')) return fetchImage(src);
  if (!process.env.CI && process.env.VERCEL_URL && process.env.NODE_ENV === 'production') {
    return fetchImage('https://' + process.env.VERCEL_URL + src);
  }
  return readFile(join(process.cwd(), 'public', src));
}

async function measure(src: string) {
  const { width, height } = sizeOf(await readImage(src));
  if (width === undefined || height === undefined) {
    throw new Error('Could not compute image size');
  }
  return { width, height };
}

// Markdown images: `![alt](src)`. The alt text doubles as the caption.
export async function Image({ src, alt = '' }: { src: string; alt?: string }) {
  let size: { width: number; height: number };
  try {
    size = await measure(src);
  } catch (error) {
    console.error('Error in Image component:', error);
    return <span>Error loading image</span>;
  }

  return (
    <span className="mt-8 flex flex-col items-center">
      <NextImage width={size.width} height={size.height} alt={alt} src={src} />

      {alt ? <Caption>{alt}</Caption> : null}
    </span>
  );
}
