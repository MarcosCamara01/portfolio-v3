'use client';

/** COMPONENTS */
import { ThemeToggle } from '../theme/theme-toggle';
import { Logo } from './logo';
import Link from 'next/link';

const Header = () => {
  return (
    <div className="sticky top-0 z-50 px-3">
      <header className="flex items-center rounded-b-xl rounded-t-none border-x border-b border-border bg-background px-[23px] py-4">
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
