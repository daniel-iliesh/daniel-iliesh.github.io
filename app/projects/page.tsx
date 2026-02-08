import { fetchMergedProjects } from "app/lib/projectsData";
import { ProjectsProvider } from "app/components/ProjectsProvider";
import { ProjectsClient } from "app/components/ProjectsClient";

export const dynamic = "force-static";

export default async function Page() {
  // Fetch once on server, then cache in Zustand
  const projects = await fetchMergedProjects().catch(() => []);

  return (
    <ProjectsProvider initialProjects={projects}>
      <ProjectsClient />
    </ProjectsProvider>
  );
}
