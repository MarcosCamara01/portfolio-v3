import { IBM_Plex_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import Header from '@/components/common/header';
import { ThemeProvider } from '@/components/theme/theme-provider';
import Footer from '@/components/common/footer';
import { RevealObserver } from '@/components/common/reveal-observer';
import { Analytics } from '@vercel/analytics/react';
import { SITE_URL } from '@/lib/site';

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

export const metadata = {
  title: { default: "Marcos Cámara's blog", template: '%s · Marcos Cámara' },
  description:
    'Marcos Cámara is a software engineer focused on TypeScript, React and Next.js. Personal blog and portfolio.',
  // Relative values resolve per route against metadataBase, so every page gets its
  // own canonical and og:url, and inherits its own title/description into og/twitter.
  alternates: { canonical: './' },
  openGraph: {
    url: './',
    siteName: "Marcos Cámara's blog",
  },
  twitter: {
    card: 'summary_large_image',
    site: '@marcoscamara01',
    creator: '@marcoscamara01',
  },
  metadataBase: new URL(SITE_URL),
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f2f2f0' },
    { media: '(prefers-color-scheme: dark)', color: '#0e0e0d' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable} scroll-smooth`}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="mx-auto flex min-h-dvh w-full max-w-[704px] flex-col px-4 pt-4 md:pt-8">
            <Header />

            <main className="flex-1">{children}</main>

            <Footer />
          </div>
        </ThemeProvider>
        <RevealObserver />
        {/* The insights script only exists on Vercel deployments. */}
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
