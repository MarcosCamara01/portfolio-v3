import { P } from '../posts/p';
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
      <div className="bg-foreground border border-border rounded p-6 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-color-primary mb-1">Full Stack Developer</h3>
            <p className="text-color-secondary mb-2">Togga</p>
            <p className="text-sm font-mono text-gray-500 dark:text-gray-500">2024 - Present</p>
          </div>
          <div className="w-10 h-10 bg-background rounded flex items-center justify-center">
            <FiCode className="w-5 h-5 text-color-secondary" />
          </div>
        </div>

        <P className="mb-6 text-sm text-muted-foreground">
          Part of the team developing a product to optimize legal practice, covering the full
          development cycle and using the latest technologies. I apply advanced knowledge in React,
          Next.js, Node.js, and Python. Currently studying engineering in AI, Machine Learning, and
          Deep Learning to connect these fields with my software development skills.
        </P>

        <div className="grid grid-cols-3 gap-4 text-sm font-mono text-gray-500 dark:text-gray-500">
          <div className="space-y-3">
            <div>Next.js</div>
            <div>React</div>
          </div>
          <div className="space-y-3">
            <div>Node.js</div>
            <div>TypeScript</div>
          </div>
          <div className="space-y-3">
            <div>Supabase</div>
            <div>Tailwind CSS</div>
          </div>
        </div>
      </div>
    </section>
  );
};
