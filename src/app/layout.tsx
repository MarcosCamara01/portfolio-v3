import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { IBM_Plex_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import { ThemeProvider } from 'next-themes';
import { Analytics } from '@vercel/analytics/react';
import { SiteHeader } from '@/components/common/site-header';
import { SiteFooter } from '@/components/common/site-footer';
import { RevealObserver } from '@/components/common/reveal-observer';
import { SITE_NAME, SITE_URL, X_HANDLE } from '@/lib/site';

import './globals.css';

// Self-hosted instances of the Google Fonts files (both OFL), cut down to what the
// design uses: Archivo pinned at weight 900 with its width axis kept at 62–100 for
// the hero, Work Sans kept variable between 400 and 700. See src/app/fonts/README.md.
const display = localFont({
  src: './fonts/archivo-black-wdth.woff2',
  variable: '--font-display',
  weight: '900',
  declarations: [{ prop: 'font-stretch', value: '62% 100%' }],
});

const sans = localFont({
  src: './fonts/work-sans.woff2',
  variable: '--font-sans',
  weight: '400 700',
});

// Only articles with code use it, so it is not preloaded on every page.
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  preload: false,
});

export const metadata: Metadata = {
  title: { default: SITE_NAME, template: '%s · Marcos Cámara' },
  description:
    'Marcos Cámara, full-stack developer at Togga. I check AI launches against their own docs and benchmarks, and my older posts cover Next.js performance.',
  // Relative values resolve per route against metadataBase, so every page gets its
  // own canonical and og:url, and inherits its own title/description into og/twitter.
  alternates: { canonical: './' },
  openGraph: {
    url: './',
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    site: X_HANDLE,
    creator: X_HANDLE,
  },
  metadataBase: new URL(SITE_URL),
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f2f2f0' },
    { media: '(prefers-color-scheme: dark)', color: '#0e0e0d' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable} scroll-smooth`}
    >
      <body>
        <ThemeProvider attribute="class" disableTransitionOnChange>
          <div className="mx-auto flex min-h-dvh w-full max-w-[704px] flex-col px-4 pt-4 md:pt-8">
            <SiteHeader />

            <main className="flex-1">{children}</main>

            <SiteFooter />
          </div>
        </ThemeProvider>
        <RevealObserver />
        {/* The insights script only exists on Vercel deployments. */}
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
