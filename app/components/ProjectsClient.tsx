'use client';

import { useProjectsStore } from '../../src/stores/projectsStore';
import Projects from './projects';
import { AnimatedSection } from './AnimatedSection';

export function ProjectsClient() {
  const projects = useProjectsStore((state) => state.projects);
  const isLoading = useProjectsStore((state) => state.isLoading);

  if (isLoading && projects.length === 0) {
    return (
      <section>
        <AnimatedSection>
          <h1 className="font-semibold text-xl sm:text-2xl mb-6 sm:mb-8 tracking-tighter">
            My Projects
          </h1>
        </AnimatedSection>
        <p className="text-sm text-gray-500">Loading projects...</p>
      </section>
    );
  }

  return (
    <section>
      <AnimatedSection>
        <h1 className="font-semibold text-xl sm:text-2xl mb-6 sm:mb-8 tracking-tighter">
          My Projects
        </h1>
      </AnimatedSection>
      <Projects projects={projects} />
    </section>
  );
}

