'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '../theme/theme-toggle';
import { cn } from '@/lib/utils';

const Header = () => {
  const pathname = usePathname();
  // Posts live at /{year}/{slug}; anything else (home, 404) leaves Blog unmarked.
  const onBlog = pathname === '/blog' || /^\/\d{4}\//.test(pathname);

  return (
    <header className="flex items-center justify-between pb-2.5">
      <Link href="/" className="display py-2 text-[22px] tracking-[0.02em] md:text-2xl">
        MPC
      </Link>

      <nav className="label flex items-center gap-1.5">
        <Link
          href="/blog"
          className={cn(
            'px-2.5 py-3 underline-offset-[6px] decoration-signal decoration-[3px]',
            onBlog ? 'underline' : 'hover:underline'
          )}
        >
          Blog
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  );
};

export default Header;
