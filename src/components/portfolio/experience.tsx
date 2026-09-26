import { SectionTitle } from '../blog/section-title';

const JOBS = [
  {
    when: '2024 — Now',
    what: 'Togga · Full-stack engineer',
    description:
      'Legal AI chat on the Vercel AI SDK: streaming responses and tool calling over legal documents. React, Next.js, Supabase, Stripe.',
  },
  {
    when: '2023 — 2024',
    what: 'Freelance developer',
    description: 'End-to-end products for a range of clients.',
  },
  {
    when: 'Ongoing',
    what: 'Software Engineering + AI',
    description: 'Studies, alongside work.',
  },
];

export const Experience = () => (
  <section>
    <SectionTitle>Work</SectionTitle>
    <ul data-reveal="list">
      {JOBS.map((job) => (
        <li
          key={job.what}
          className="flex flex-col gap-1 border-t border-soft py-3.5 md:grid md:grid-cols-[120px_minmax(0,1fr)] md:gap-4 md:py-4"
        >
          <span className="label md:pt-[3px] md:text-[15px] md:normal-case md:tracking-normal">
            {job.when}
          </span>
          <div className="flex flex-col gap-1">
            <span className="text-lg font-bold md:text-xl">{job.what}</span>
            <span className="text-[15px] leading-normal text-sub md:leading-[1.55]">
              {job.description}
            </span>
          </div>
        </li>
      ))}
    </ul>
  </section>
);
