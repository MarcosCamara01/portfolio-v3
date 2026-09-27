import { readFile } from 'fs/promises';
import { join } from 'path';
import { ImageResponse } from 'next/og';

export const alt = 'Marcos Cámara, full-stack developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Dark theme tokens from globals.css.
const PAGE = '#0e0e0d';
const INK = '#f2f2f0';
const SUB = '#b4b4ae';
const SIGNAL = '#ff5a40';

// Satori needs static TTF/OTF, so the OG image ships its own subset instances of the
// site fonts (Archivo at wdth 62, Work Sans at wght 600). See fonts/README.md.
const font = (file: string) => readFile(join(process.cwd(), 'src/app/fonts', file));

export default async function Image() {
  const [archivo, workSans] = await Promise.all([font('og-archivo.ttf'), font('og-work-sans.ttf')]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 80px 72px',
          backgroundColor: PAGE,
          color: INK,
          fontFamily: 'Work Sans',
        }}
      >
        <div style={{ display: 'flex', fontFamily: 'Archivo', fontSize: 40, letterSpacing: 1 }}>
          MPC
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'Archivo',
              fontSize: 200,
              lineHeight: 0.93,
            }}
          >
            <span>MARCOS</span>
            <span style={{ display: 'flex' }}>
              CÁMARA<span style={{ color: SIGNAL }}>.</span>
            </span>
          </div>
          <div style={{ display: 'flex', marginTop: 36, fontSize: 38, color: SUB }}>
            Full-stack developer · Next.js and AI agents
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Archivo', data: archivo, weight: 900, style: 'normal' },
        { name: 'Work Sans', data: workSans, weight: 600, style: 'normal' },
      ],
    }
  );
}
