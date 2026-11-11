import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeading } from '@/components/common/page-heading';
import { ArrowLeft, ArrowRight } from '@/components/common/icons';

export const metadata: Metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <section>
      <PageHeading title="404">
        Nothing at this address. I either moved the page or never wrote it.
      </PageHeading>

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
