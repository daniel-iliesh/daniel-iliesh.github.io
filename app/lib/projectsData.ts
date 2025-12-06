import { fetchResume } from "src/features/resume/api";
import type { Project } from "src/features/resume/types";
import { fetchProjectDetail, fetchProjectMedia } from "src/features/projects/api";
import type { MediaItem, ProjectDetail } from "src/features/projects/types";
import { mergeProjectData } from "src/features/projects/merge";
import { slugifyProjectId } from "app/utils/slugify";

function mediaUrl(item: MediaItem): string | null {
  return item.download_url ?? item.path ?? item.html_url ?? item.url ?? null;
}

function isImage(item: MediaItem): boolean {
  const url = mediaUrl(item);
  if (!url) return false;
  return /\.(png|jpe?g|gif|webp|svg)$/i.test(url);
}

function pickCover(media: MediaItem[]): MediaItem | null {
  if (!media.length) return null;
  const cover = media.find((item) => /cover/i.test(item.name) && isImage(item));
  if (cover) return cover;
  const firstImage = media.find(isImage);
  return firstImage ?? null;
}

export interface ProjectWithCover extends ReturnType<typeof mergeProjectData> {
  coverUrl: string | null;
  isPrivate?: boolean;
}

export async function fetchMergedProjects(): Promise<ProjectWithCover[]> {
  const resume = await fetchResume({ revalidate: 3600 });
  const resumeProjects = (resume?.projects ?? []) as Project[];

  const slugs = resumeProjects
    .map((project) => project.id || (project.name ? slugifyProjectId(project.name) : null))
    .filter(Boolean) as string[];

  const merged = await Promise.all(
    slugs.map(async (slug) => {
      let detail: ProjectDetail | null = null;
      let coverUrl: string | null = null;

      try {
        detail = await fetchProjectDetail(slug, "main");
      } catch {
        detail = null;
      }

      const branch = detail?.branch || (detail as any)?.default_branch || "main";

      try {
        const medias = await fetchProjectMedia(slug, "media", branch);
        const cover = pickCover(medias.filter(isImage));
        coverUrl = cover ? mediaUrl(cover) : null;
      } catch {
        coverUrl = null;
      }

      const resumeProject = resumeProjects.find(
        (project) => project?.id === slug || (project?.name && slug === slugifyProjectId(project.name))
      );

      const mergedProject = mergeProjectData(resumeProject ?? {}, detail ?? undefined);

      return {
        ...mergedProject,
        coverUrl,
        isPrivate: detail?.visibility === "private",
      };
    })
  );

  return merged;
}

