import { Inter } from 'next/font/google';
import Header from '@/components/common/header';
import { ThemeProvider } from '@/components/theme/theme-provider';
import Footer from '@/components/common/footer';
import { Analytics } from '@vercel/analytics/react';
import { SITE_URL } from '@/lib/site';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "Marcos Cámara's blog",
  description:
    'Marcos Cámara is a software engineer focused on TypeScript, React and Next.js. Personal blog and portfolio.',
  openGraph: {
    title: "Marcos Cámara's blog",
    description:
      'Marcos Cámara is a software engineer focused on TypeScript, React and Next.js. Personal blog and portfolio.',
    url: SITE_URL,
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
  themeColor: 'transparent',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.className} scroll-smooth`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />

          <main className="p-6 pt-8 md:pt-16 min-h-dvh">{children}</main>

          <Footer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
