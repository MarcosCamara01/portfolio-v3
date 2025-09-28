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
        className="block bg-foreground border border-border rounded-lg p-6 will-change-transform hover:border-gray-400 dark:hover:border-gray-600 transition-[border-color,transform,box-shadow] duration-200 ease-out hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-color-primary mb-1">
              Full Stack Developer · Togga
            </h3>
            <p className="text-sm font-mono text-gray-500 dark:text-gray-400">2024 - Present</p>
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
            <div className="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-150 ease-in">
              Next.js
            </div>
            <div className="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-150 ease-in">
              React
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-150 ease-in">
              Three
            </div>
            <div className="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-150 ease-in">
              TypeScript
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-150 ease-in">
              Supabase
            </div>
            <div className="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-150 ease-in">
              Tailwind CSS
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
};
