import { About } from "@/components/portfolio/About";
import { Experience } from "@/components/portfolio/Experience";
import { FeaturedProject } from "@/components/portfolio/FeaturedProject";
import { Writing } from "@/components/portfolio/Writing";

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
