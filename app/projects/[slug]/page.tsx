import { notFound } from "next/navigation";
import {
  fetchProjectDetail,
  fetchProjectMedia,
} from "src/features/projects/api";
import { fetchResume } from "src/features/resume/api";
import { ResumeProvider } from "app/components/ResumeProvider";
import { ProjectDetailWrapper } from "app/components/ProjectDetailWrapper";
import { CustomMDX } from "app/components/mdx";
import { mergeProjectData } from "src/features/projects/merge";
import { slugifyProjectId } from "app/utils/slugify";
import type { Project } from "src/features/resume/types";
import type { ReactNode } from "react";

const DEFAULT_BRANCH = "main";
const MEDIA_FOLDER = "media";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  const resume = await fetchResume({ revalidate: 3600 });
  const resumeProjects = (resume?.projects ?? []) as Project[];

  return resumeProjects
    .map((project) => {
      const rawId = project.id || project.name;
      return rawId ? slugifyProjectId(rawId) : null;
    })
    .filter(Boolean)
    .map((slug) => ({ slug: slug as string }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: urlSlug } = await params;

  // Fetch resume to find the original project ID
  const resume = await fetchResume().catch(() => null);
  const resumeProjects = (resume?.projects ?? []) as Project[];

  // Find project by matching slugified ID
  const resumeProject = resumeProjects.find((project) => {
    const rawId = project.id || project.name;
    return rawId && slugifyProjectId(rawId) === urlSlug;
  });

  if (!resumeProject) {
    notFound();
  }

  // Use the original ID for API calls
  const originalId = resumeProject.id || resumeProject.name || urlSlug;
  const detail = await fetchProjectDetail(originalId, DEFAULT_BRANCH).catch(
    () => null,
  );

  if (!detail) {
    notFound();
  }

  const branch =
    detail?.branch || (detail as any)?.default_branch || DEFAULT_BRANCH;
  const media = await fetchProjectMedia(originalId, MEDIA_FOLDER, branch).catch(
    () => [],
  );

  const merged = mergeProjectData(resumeProject ?? {}, detail ?? undefined);
  const blogContent = merged?.blogContent ?? detail?.blogContent;

  // Render MDX content on server if available
  let mdxContent: ReactNode | null = null;
  if (blogContent) {
    mdxContent = <CustomMDX source={blogContent} />;
  }

  return (
    <ResumeProvider initialResume={resume || undefined}>
      <ProjectDetailWrapper
        slug={urlSlug}
        initialDetail={detail}
        initialMedia={media}
        initialResume={resume}
        content={mdxContent}
      />
    </ResumeProvider>
  );
}
