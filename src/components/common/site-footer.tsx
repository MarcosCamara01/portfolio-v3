import { GITHUB_URL, LINKEDIN_URL, X_URL } from '@/lib/site';

const LINKS = [
  { label: 'GitHub', href: GITHUB_URL },
  { label: 'LinkedIn', href: LINKEDIN_URL },
  { label: 'X', href: X_URL },
];

export function SiteFooter() {
  return (
    <footer className="label mt-20 flex flex-col-reverse gap-1.5 pb-10 pt-5 md:mt-[104px] md:flex-row md:items-center md:justify-between md:pb-12">
      <span className="text-sub">© {new Date().getFullYear()} Marcos Cámara</span>
      <nav className="flex gap-[18px]">
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative py-2 before:absolute before:-inset-x-[9px] before:-inset-y-1 before:content-[''] last:before:-right-[26px] hover:text-signal active:text-signal"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
