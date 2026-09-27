import Image from 'next/image';
import { SectionTitle } from '../blog/section-title';
import { ArrowUpRight, GitHub } from '../common/icons';
import { StarCount } from './star-count';

const PROJECT = {
  title: 'Ecommerce Template',
  repo: 'MarcosCamara01/ecommerce-template',
  demo: 'https://ecommerce-template-mpc.vercel.app',
  description:
    'Open-source storefront on Next.js 16: catalog, cart and wishlist, Stripe Checkout priced on the server, and an admin catalog that stays in sync with Stripe.',
  stack: ['Next.js', 'TypeScript', 'Supabase', 'Drizzle', 'Better Auth', 'Stripe'],
  image: '/images/projects/ecommerce-template-2026.png',
  fallbackStars: 232,
};

async function getStars() {
  try {
    const res = await fetch(`https://api.github.com/repos/${PROJECT.repo}`, {
      next: { revalidate: 60 * 60 * 24 },
    });
    if (!res.ok) return PROJECT.fallbackStars;
    const data: { stargazers_count?: number } = await res.json();
    return data.stargazers_count ?? PROJECT.fallbackStars;
  } catch {
    return PROJECT.fallbackStars;
  }
}

export const FeaturedProject = async () => {
  const stars = await getStars();

  return (
    <section>
      <SectionTitle>Projects</SectionTitle>
      <article className="flex flex-col">
        <a
          href={PROJECT.demo}
          target="_blank"
          rel="noopener noreferrer"
          data-reveal="media"
          className="shot block overflow-hidden"
        >
          <Image
            src={PROJECT.image}
            alt="Ecommerce Template storefront: dark header with search and a grid of clothing products"
            width={1903}
            height={1080}
            sizes="(min-width: 704px) 672px, 100vw"
            className="h-[190px] w-full object-cover md:h-[300px]"
          />
        </a>

        <div className="flex flex-col gap-3 py-4 md:py-5">
          <div className="flex items-start justify-between gap-4">
            <h3 className="display text-[30px] leading-[0.95] md:text-[40px]">{PROJECT.title}</h3>
            <StarCount value={stars} />
          </div>
          <p className="text-base leading-normal text-sub">{PROJECT.description}</p>
          <ul className="flex flex-wrap gap-x-1.5 text-xs font-bold uppercase tracking-[0.04em]">
            {PROJECT.stack.map((tech, i) => (
              <li key={tech} className="whitespace-nowrap">
                {tech}
                {i < PROJECT.stack.length - 1 ? <span aria-hidden> ·</span> : null}
              </li>
            ))}
          </ul>
        </div>

        <div className="label flex flex-wrap gap-2">
          <a
            href={PROJECT.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-fill press inline-flex items-center gap-2.5 bg-inv px-4 py-3.5 text-inv-ink"
          >
            <span>Live demo</span>
            <ArrowUpRight className="btn-arrow" />
          </a>
          <a
            href={`https://github.com/${PROJECT.repo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-line press inline-flex items-center gap-2 px-3 py-3.5"
          >
            <GitHub />
            <span>Source code</span>
          </a>
        </div>
      </article>
    </section>
  );
};
