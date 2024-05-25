import sizeOf from "image-size";
import { join } from "path";
import { readFile } from "fs/promises";
import { Caption } from "./caption";
import NextImage from "next/image";
import fs from "node:fs/promises";
import { getPlaiceholder } from "plaiceholder";

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
  const isDataImage = src.startsWith("data:");
  if (isDataImage) {
    return (
      <NextImage src={src} width={600} height={600} alt={originalAlt ?? ""} />
    );
  } else {
    if (width === null || height === null) {
      let imageBuffer: Buffer | null = null;

      if (src.startsWith("http")) {
        imageBuffer = Buffer.from(
          await fetch(src).then((res) => res.arrayBuffer())
        );
      } else {
        if (
          !process.env.CI &&
          process.env.VERCEL_URL &&
          process.env.NODE_ENV === "production"
        ) {
          imageBuffer = Buffer.from(
            await fetch("https://" + process.env.VERCEL_URL + src).then((res) =>
              res.arrayBuffer()
            )
          );
        } else {
          const imagePath = join(process.cwd(), "public", src);
          imageBuffer = await readFile(imagePath);
        }
      }
      const computedSize = sizeOf(imageBuffer);
      if (
        computedSize.width === undefined ||
        computedSize.height === undefined
      ) {
        throw new Error("Could not compute image size");
      }
      width = computedSize.width;
      height = computedSize.height;
    }

    let alt: string | null = null;
    let dividedBy = 100;

    if ("string" === typeof originalAlt) {
      const match = originalAlt.match(/(.*) (\[(\d+)%\])?$/);
      if (match != null) {
        alt = match[1];
        dividedBy = match[3] ? parseInt(match[3]) : 100;
      }
    } else {
      alt = originalAlt ?? null;
    }

    const factor = dividedBy / 100;

    const buffer = await fs.readFile(`./public${src}`);

    const { base64 } = await getPlaiceholder(buffer);

    return (
      <span className="my-5 flex flex-col items-center">
        <NextImage
          width={width * factor}
          height={height * factor}
          alt={alt ?? ""}
          src={src}
          className="rounded"
          placeholder="blur"
          blurDataURL={base64}
        />

        {alt && <Caption>{alt}</Caption>}
      </span>
    );
  }
}
