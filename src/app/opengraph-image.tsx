import { ImageResponse } from 'next/og';

export const alt = 'Marcos Cámara — Software Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '0 96px',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'radial-gradient(circle at 25% 25%, #1f1f1f 0%, #0a0a0a 60%)',
        }}
      >
        <div
          style={{
            fontSize: 84,
            fontWeight: 700,
            color: '#fafafa',
            letterSpacing: '-0.03em',
          }}
        >
          Marcos Cámara
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 36,
            color: '#a1a1aa',
          }}
        >
          Software engineer · TypeScript, React &amp; Next.js
        </div>
      </div>
    ),
    size
  );
}
