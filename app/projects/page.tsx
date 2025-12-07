import Projects from "app/components/projects";
import { AnimatedSection } from "app/components/AnimatedSection";
import { fetchMergedProjects } from "app/lib/projectsData";

export default async function Page() {
  const projects = await fetchMergedProjects();

    return (
        <section>
            <AnimatedSection>
                <h1 className="font-semibold text-xl sm:text-2xl mb-6 sm:mb-8 tracking-tighter">My Projects</h1>
            </AnimatedSection>
      <Projects projects={projects} />
        </section>
    );
}
