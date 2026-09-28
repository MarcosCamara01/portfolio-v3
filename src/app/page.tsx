import { Hero } from '@/components/portfolio/hero';
import { Experience } from '@/components/portfolio/experience';
import { FeaturedProject } from '@/components/portfolio/featured-project';
import { Writing } from '@/components/portfolio/writing';
import { JsonLd } from '@/components/common/json-ld';
import { AUTHOR, SITE_URL } from '@/lib/site';

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            { '@type': 'WebSite', name: "Marcos Cámara's blog", url: SITE_URL },
            {
              ...AUTHOR,
              worksFor: { '@type': 'Organization', name: 'Togga', url: 'https://togga.com' },
            },
          ],
        }}
      />
      <Hero />
      <Experience />
      <FeaturedProject />
      <Writing />
    </>
  );
}
