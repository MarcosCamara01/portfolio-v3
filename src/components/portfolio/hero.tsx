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
          Full-stack engineer at Togga. I work across the whole product for legal practice, from the
          AI chat to payments and auth.
        </p>
        <p className="text-[15px] leading-[1.55] text-sub">
          San Sebastián. I write about what it takes to ship AI products: Next.js performance,
          durable agents, several models working as one system. 10,000+ reads so far.
        </p>
      </div>
    </section>
  );
}
