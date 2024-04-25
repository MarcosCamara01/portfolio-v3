"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const Links = () => {
    const pathname = usePathname();

    return (
        <span>
            {pathname === "/" ? (
                <Link
                    href="/blog"
                    className="hover:bg-foreground p-2 rounded-sm -ml-2 transition-[background-color]"
                >
                    Blog
                </Link>
            ) : (
                <Link
                    href="/"
                    className="hover:bg-foreground p-2 rounded-sm -ml-2 transition-[background-color]"
                >
                    Portfolio
                </Link>
            )}
        </span>
    )
}

export default Links
