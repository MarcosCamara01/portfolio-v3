import sizeOf from 'image-size';
import { join } from 'path';
import { readFile } from 'fs/promises';
import NextImage from 'next/image';

async function fetchImage(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not fetch ${url}: ${res.status}`);
  return Buffer.from(new Uint8Array(await res.arrayBuffer()));
}

// On Vercel, a page rendered at request time (CI unset) has no /public on disk, so local
// images are fetched from the deployment instead.
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

function Caption({ children }: { children: string }) {
  return (
    <span className="my-3 block w-full text-center font-mono text-xs leading-normal text-sub [text-wrap:balance]">
      {children}
    </span>
  );
}

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
