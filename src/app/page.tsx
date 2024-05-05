import Contact from "@/components/portfolio/contact";
import PersonalProjects from "@/components/portfolio/personal-projects";

export const revalidate = 60;

export default function Home() {
  return (
    <section className="min-h-[calc(100vh-108px)] md:min-h-[calc(100vh-152px)]">
      <PersonalProjects />
      <Contact />
    </section>
  );
}
