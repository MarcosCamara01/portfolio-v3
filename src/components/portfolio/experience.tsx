import { SectionTitle } from '../blog/section-title';

const JOBS = [
  {
    when: '2024 — Now',
    what: 'Togga · Full-stack developer',
    description:
      "Togga is a workspace for law firms, in beta with selected firms. I've worked across all of it: the legal AI chat on the Vercel AI SDK, video transcription, three.js in the canvas, the dashboard and payments. I also take on the big migrations, like Next.js 14 to 16 with every dependency.",
  },
  {
    when: '2023 — 2024',
    what: 'Freelance developer',
    description: 'Built complete products for different clients.',
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
