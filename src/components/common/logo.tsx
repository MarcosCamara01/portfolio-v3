'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function Logo() {
  const pathname = usePathname();
  return (
    <span className="text-md md:text-lg whitespace-nowrap font-bold">
      {pathname === '/' ? (
        <span className="cursor-default pr-2">Marcos Cámara</span>
      ) : (
        <Link
          href="/"
          className="hover:bg-foreground p-2 rounded-sm -ml-2 transition-[background-color]"
        >
          Marcos Cámara
        </Link>
      )}
    </span>
  );
}
