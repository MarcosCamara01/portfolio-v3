import { SITE_URL } from '@/lib/site';

export const AUTHOR = {
  '@type': 'Person',
  name: 'Marcos Penelas Cámara',
  url: SITE_URL,
  jobTitle: 'Full-stack engineer',
  sameAs: [
    'https://github.com/MarcosCamara01',
    'https://www.linkedin.com/in/marcospenelascamara',
    'https://twitter.com/marcoscamara01',
  ],
};

// Structured data for search engines. `<` is escaped so the JSON can't close the tag.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
