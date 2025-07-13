import { About } from '@/components/portfolio/about';
import { Experience } from '@/components/portfolio/experience';
import { FeaturedProject } from '@/components/portfolio/featuredProject';
import { Writing } from '@/components/portfolio/writing';

export default function Home() {
  return (
    <section className="min-h-[calc(100vh-108px)] md:min-h-[calc(100vh-152px)]">
      <div className="max-w-2xl mx-auto space-y-16 text-color-primary">
        <About />

        <Experience />

        <FeaturedProject />

        <Writing />
      </div>
    </section>
  );
}
