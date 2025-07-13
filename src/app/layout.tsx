import { Inter } from "next/font/google";
import Header from "@/components/common/header";
import { ThemeProvider } from "@/components/theme/theme-provider";
import Footer from "@/components/common/footer";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Marcos Cámara's blog",
  description:
    "Guillermo Rauch is the CEO and founder of Vercel, a software engineer, and the creator of Next.js, Mongoose, Socket.io and other open source libraries.",
  openGraph: {
    title: "Marcos Cámara's blog",
    description:
      "Guillermo Rauch is the CEO and founder of Vercel, a software engineer, and the creator of Next.js, Mongoose, Socket.io and other open source libraries.",
    url: "https://portfolio-v3-zeta-ecru.vercel.app",
    siteName: "Marcos Cámara's blog",
  },
  twitter: {
    card: "summary_large_image",
    site: "@rauchg",
    creator: "@rauchg",
  },
  metadataBase: new URL("https://portfolio-v3-zeta-ecru.vercel.app"),
};

export const viewport = {
  themeColor: "transparent",
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
      className={`${inter.className} scroll-smooth`}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="p-6 pt-3 md:pt-6 min-h-dvh">
            <Header />

            {children}
          </main>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
