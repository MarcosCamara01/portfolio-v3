const LINKS = [
  { label: 'GitHub', href: 'https://github.com/MarcosCamara01' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/marcospenelascamara' },
  { label: 'X', href: 'https://twitter.com/marcoscamara01' },
];

const Footer = () => (
  <footer className="label mt-20 flex flex-col-reverse gap-1.5 pb-10 pt-5 md:mt-[104px] md:flex-row md:items-center md:justify-between md:pb-12">
    <span className="text-sub">© {new Date().getFullYear()} Marcos Cámara</span>
    <nav className="flex gap-[18px]">
      {LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 hover:text-signal"
        >
          {link.label}
        </a>
      ))}
    </nav>
  </footer>
);

export default Footer;
