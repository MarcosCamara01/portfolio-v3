import Image from 'next/image';
import { P } from '../posts/p';
import { FiUser } from 'react-icons/fi';

export const About = () => {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-foreground rounded flex items-center justify-center">
            <FiUser className="w-4 h-4 text-color-secondary" />
          </div>
          <h2 className="text-xl font-medium text-color-primary">About</h2>
        </div>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="space-y-4">
        <div className="relative">
          <div className="float-right ml-6 mb-4">
            <div className="w-32 h-32 relative">
              <Image
                src="https://media.licdn.com/dms/image/v2/D4D03AQGjE8MzCcPE-A/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1709333102715?e=1756944000&v=beta&t=JyCaqT9w-IgIweLtma6fNN0dEStCJT2G7wtk9DlgMww"
                alt="Profile"
                width={128}
                height={128}
                className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-300"
                sizes="128px"
              />
            </div>
          </div>
          <P>
            I&apos;m <b>Marcos Penelas Cámara</b>, a Full Stack Developer based in San Sebastián,
            Spain. I have advanced knowledge with <b>React, Next.js, Node.js, and Python</b>. My
            professional journey started with a year working as a freelancer, where I delivered
            end-to-end solutions for a variety of clients and gained a broad perspective on software
            development.
          </P>
        </div>
        <P>
          Since May 2024, I have been part of a team at a legal tech startup, where we design and
          build a product focused on optimizing legal practice. Our team oversees the entire
          development process, leveraging the latest technologies to address the unique challenges
          and needs of the legal sector.
        </P>
        <P>
          I have also worked on personal projects that have received over <b>150 stars on GitHub</b>
          , and I have published several articles on Medium with more than <b>10,000 reads</b>.
        </P>
        <P>
          I am currently studying Software Engineering and Artificial Intelligence. My goal is to
          connect these rapidly evolving fields with my current expertise in software development to
          create innovative solutions for the future.
        </P>
      </div>
    </section>
  );
};
