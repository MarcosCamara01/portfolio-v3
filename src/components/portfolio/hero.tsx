import { SplitTitle } from './split-title';

export function Hero() {
  return (
    <section>
      <SplitTitle
        lines={['Marcos', 'Cámara']}
        className="mt-[18px] text-[clamp(64px,24.6vw,168px)] leading-[0.93] md:mt-5 md:leading-[0.91]"
      />

      <div className="hero-intro mt-5 flex max-w-[520px] flex-col gap-2.5 md:mt-6 md:gap-3">
        <p className="text-[19px] font-semibold leading-[1.3] md:text-xl">
          Full-stack developer at Togga.
        </p>
        <p className="text-[15px] leading-[1.55] text-sub md:text-base">
          I like owning a product from start to finish, and most of what I write here comes from
          that: making Next.js apps fast and figuring out how AI agents behave in production.
        </p>
      </div>
    </section>
  );
}
