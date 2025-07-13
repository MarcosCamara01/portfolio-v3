import { ThemeToggle } from "../theme/theme-toggle";
import { Logo } from "./logo";
import Link from "next/link";

const Header = () => {
  return (
    <header className="flex mb-8 md:mb-16 items-center">
      <Logo />

      <nav className="font-mono text-sm grow justify-end items-center flex gap-3 md:gap-5">
        <ThemeToggle />

        <Link
          href="/blog"
          className="hover:bg-foreground p-2 rounded-sm -ml-2 transition-[background-color]"
        >
          Blog
        </Link>
      </nav>
    </header>
  );
};

export default Header;
