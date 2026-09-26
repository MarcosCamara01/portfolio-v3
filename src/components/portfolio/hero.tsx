import { SplitTitle } from './split-title';

export function Hero() {
  return (
    <section>
      <SplitTitle
        lines={['Marcos', 'Cámara']}
        className="mt-[18px] text-[clamp(64px,24.6vw,168px)] leading-[0.93] md:mt-5 md:leading-[0.91]"
      />

      <div className="hero-intro mt-5 flex flex-col gap-2.5 md:mt-6 md:grid md:grid-cols-2 md:gap-6">
        <p className="text-[19px] font-semibold leading-[1.3] md:text-xl">
          Full-stack engineer building legal AI at Togga.
        </p>
        <p className="text-[15px] leading-[1.55] text-sub">
          San Sebastián. I write about Next.js, durable agents and orchestrating several models into
          one system.
        </p>
      </div>
    </section>
  );
}
