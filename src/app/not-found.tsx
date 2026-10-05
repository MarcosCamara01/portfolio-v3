import Link from 'next/link';
import { SplitTitle } from '@/components/portfolio/split-title';
import { ArrowLeft, ArrowRight } from '@/components/common/icons';

export const metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <section>
      <SplitTitle
        lines={['404']}
        className="mt-[18px] text-[clamp(64px,21.5vw,132px)] leading-[0.86] md:mt-6"
      />
      <p className="hero-intro max-w-[420px] pt-5 text-[17px] font-medium leading-[1.4] md:text-lg">
        Nothing at this address. I either moved the page or never wrote it.
      </p>

      <div className="hero-intro label mt-8 flex flex-wrap gap-2">
        <Link
          href="/"
          className="btn-fill press inline-flex items-center gap-2.5 bg-inv px-4 py-3.5 text-inv-ink"
        >
          <ArrowLeft />
          <span>Back home</span>
        </Link>
        <Link href="/blog" className="btn-line press inline-flex items-center gap-2 px-3 py-3.5">
          <span>Read the blog</span>
          <ArrowRight />
        </Link>
      </div>
    </section>
  );
}
