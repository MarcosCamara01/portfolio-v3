import { A } from "../posts/a";
import { P } from "../posts/p";
import { FiEdit3 } from "react-icons/fi";
import { UL } from "../posts/ul";
import { Li } from "../posts/li";

export const Writing = () => {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-foreground rounded flex items-center justify-center">
            <FiEdit3 className="w-4 h-4 text-color-secondary" />
          </div>
          <h2 className="text-xl font-medium text-color-primary">Writing</h2>
        </div>
        <div className="flex-1 h-px bg-border" />
      </div>
      <div className="space-y-4">
        <P>
          I occasionally write about software development, performance
          optimization, and developer experience. Some of my recent articles:
        </P>
        <UL>
          <Li>
            <A href="/2025/stop-calling-next-js-slow-master-these-optimization-techniques">
              Stop Calling Next.js Slow: Master These Optimization Techniques
            </A>
          </Li>
          <Li>
            <A href="/2024/get-the-best-performance-on-nextjs-app">
              Get the Best Performance on Your Next.js App
            </A>
          </Li>
        </UL>
      </div>
    </section>
  );
};
