'use client';

/** COMPONENTS */
import { ThemeToggle } from '../theme/theme-toggle';
import { Logo } from './logo';
import Link from 'next/link';
/** FUNCTIONALITY */
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useScrollFix } from '@/hooks/use-scroll-fix';

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);

  useScrollFix();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="sticky top-3 z-50">
      <header
        className={cn(
          'flex items-center bg-background rounded-lg py-4 px-[23px] border transition-colors',
          {
            'border-border': isSticky,
            'border-transparent': !isSticky,
          }
        )}
      >
        <Logo />

        <nav className="font-mono text-sm grow justify-end items-center flex gap-3 md:gap-5">
          <ThemeToggle />

          <Link
            href="/blog"
            className="hover:bg-foreground p-2 rounded-lg -ml-2 transition-[background-color]"
          >
            Blog
          </Link>
        </nav>
      </header>
    </div>
  );
};

export default Header;
