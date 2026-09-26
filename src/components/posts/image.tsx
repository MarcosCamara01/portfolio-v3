import sizeOf from 'image-size';
import { join } from 'path';
import { readFile } from 'fs/promises';
import { Caption } from './caption';
import NextImage from 'next/image';

async function fetchImage(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not fetch ${url}: ${res.status}`);
  return Buffer.from(new Uint8Array(await res.arrayBuffer()));
}

// Remote images are fetched; local ones are read from /public, except on Vercel
// production builds, where they are fetched from the deployment itself.
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

// `alt` may end in `[50%]` to render the image at that share of its size.
function parseAlt(originalAlt?: string) {
  if (typeof originalAlt !== 'string') return { alt: null, factor: 1 };
  const [, alt, percent] = originalAlt.match(/^(.*?)(?:\s*\[(\d+)%\])?$/) ?? [];
  return { alt: alt || null, factor: (percent ? parseInt(percent) : 100) / 100 };
}

export async function Image({
  src,
  alt: originalAlt,
  width = null,
  height = null,
}: {
  src: string;
  alt?: string;
  width: number | null;
  height: number | null;
}) {
  if (src.startsWith('data:')) {
    /* eslint-disable-next-line @next/next/no-img-element */
    return <img src={src} alt={originalAlt ?? ''} />;
  }

  let size: { width: number; height: number };
  try {
    size = width === null || height === null ? await measure(src) : { width, height };
  } catch (error) {
    console.error('Error in Image component:', error);
    return <span>Error loading image</span>;
  }

  const { alt, factor } = parseAlt(originalAlt);

  return (
    <span className="mt-8 flex flex-col items-center">
      <NextImage
        width={size.width * factor}
        height={size.height * factor}
        alt={alt ?? ''}
        src={src}
      />

      {alt && <Caption>{alt}</Caption>}
    </span>
  );
}
