/** COMPONENTS */
import Link from 'next/link';
/** ICONS */
import { FiFolder, FiGithub } from 'react-icons/fi';
import { FaCodeFork, FaStar } from 'react-icons/fa6';

const GITHUB_REPO = 'MarcosCamara01/ecommerce-template';
const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;

async function getGitHubStats() {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
    next: {
      revalidate: 3600,
    },
  });

  if (!res.ok) {
    return { stars: 0, forks: 0 };
  }

  const data = await res.json();
  return {
    stars: data.stargazers_count,
    forks: data.forks_count,
  };
}

export async function FeaturedProject() {
  const stats = await getGitHubStats();

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-foreground rounded flex items-center justify-center">
            <FiFolder className="w-4 h-4 text-color-secondary" />
          </div>
          <h2 className="text-xl font-medium text-color-primary">Featured Project</h2>
        </div>
        <div className="flex-1 h-px bg-border" />
      </div>
      <Link
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-foreground rounded-lg p-6 will-change-transform duration-200 ease-out"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-color-primary">
                Next.js E-commerce Template
              </h3>
              <FiGithub className="w-4 h-4 text-color-secondary" />
            </div>
            <p className="text-sm text-muted-foreground">
              A modern, full-featured e-commerce template built with Next.js 14, Server Components,
              Supabase and Stripe. Features include authentication, product management, shopping
              cart, and admin dashboard.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm font-mono text-gray-500 dark:text-gray-400 mb-6">
          <div className="flex items-center gap-2">
            <FaStar className="w-4 h-4 text-color-secondary" />
            <span>{stats.stars} stars</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCodeFork className="w-4 h-4 text-color-secondary" />
            <span>{stats.forks} forks</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-xs font-mono">
          <div className="space-y-3">
            <div className="text-gray-600 dark:text-gray-400">Next.js</div>
            <div className="text-gray-600 dark:text-gray-400">TypeScript</div>
          </div>
          <div className="space-y-3">
            <div className="text-gray-600 dark:text-gray-400">Node.js</div>
            <div className="text-gray-600 dark:text-gray-400">Supabase</div>
          </div>
          <div className="space-y-3">
            <div className="text-gray-600 dark:text-gray-400">Tailwind CSS</div>
            <div className="text-gray-600 dark:text-gray-400">NextAuth</div>
          </div>
        </div>
      </Link>
    </section>
  );
}
