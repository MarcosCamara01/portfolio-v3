import PersonalProjects from "@/components/portfolio/personal-projects";

export const revalidate = 60;

export default function Home() {
  return (
    <section>
      <PersonalProjects />
    </section>
  );
}
