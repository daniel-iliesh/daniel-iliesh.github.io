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
    .map(
      (project) =>
        project.id || (project.name ? slugifyProjectId(project.name) : null),
    )
    .filter(Boolean)
    .map((slug) => ({ slug: slug as string }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: slugParam } = await params;
  const slug = decodeURIComponent(slugParam);

  const detail = await fetchProjectDetail(slug, DEFAULT_BRANCH).catch(
    () => null,
  );

  if (!detail) {
    notFound();
  }

  const branch =
    detail?.branch || (detail as any)?.default_branch || DEFAULT_BRANCH;
  const media = await fetchProjectMedia(slug, MEDIA_FOLDER, branch).catch(
    () => [],
  );

  // Fetch resume once, will be cached in store
  const resume = await fetchResume().catch(() => null);

  // Check if there's blog content to render as MDX
  const resumeProjects = (resume?.projects ?? []) as any[];
  const resumeProject = resumeProjects.find(
    (project) =>
      project?.id === slug || (project?.name && slug === project.name),
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
        slug={slug}
        initialDetail={detail}
        initialMedia={media}
        initialResume={resume}
        content={mdxContent}
      />
    </ResumeProvider>
  );
}
