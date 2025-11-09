/** COMPONENTS */
import Link from 'next/link';
import { P } from '../posts/p';
/** ICONS */
import { FiBriefcase, FiCode } from 'react-icons/fi';

export const Experience = () => {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-foreground rounded flex items-center justify-center">
            <FiBriefcase className="w-4 h-4 text-color-secondary" />
          </div>
          <h2 className="text-xl font-medium text-color-primary">Experience</h2>
        </div>
        <div className="flex-1 h-px bg-border" />
      </div>
      <Link
        href="https://togga.com"
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-foreground rounded-lg p-6 will-change-transform duration-200 ease-out"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-color-primary mb-1">
              Full Stack Developer · Togga
            </h3>
            <p className="text-xs font-mono text-gray-500 dark:text-gray-400">2024 - Present</p>
          </div>
          <div className="w-10 h-10 bg-background rounded flex items-center justify-center">
            <FiCode className="w-5 h-5 text-color-secondary" />
          </div>
        </div>

        <P className="mb-6 text-sm text-muted-foreground">
          Part of the team developing a product to optimize legal practice, covering the full
          development cycle and using the latest technologies. I apply advanced knowledge in React,
          Next.js, Supabase, Stripe, Three and BetterAuth.
        </P>

        <div className="grid grid-cols-3 gap-4 text-xs font-mono">
          <div className="space-y-3">
            <div className="text-gray-600 dark:text-gray-400">Next.js</div>
            <div className="text-gray-600 dark:text-gray-400">React</div>
          </div>
          <div className="space-y-3">
            <div className="text-gray-600 dark:text-gray-400">Three</div>
            <div className="text-gray-600 dark:text-gray-400">TypeScript</div>
          </div>
          <div className="space-y-3">
            <div className="text-gray-600 dark:text-gray-400">Supabase</div>
            <div className="text-gray-600 dark:text-gray-400">Tailwind CSS</div>
          </div>
        </div>
      </Link>
    </section>
  );
};
