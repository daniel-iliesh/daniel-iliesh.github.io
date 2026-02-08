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

  const projectsWithIds = resumeProjects
    .map((project) => {
      const originalId = project.id || project.name;
      if (!originalId) return null;
      return {
        project,
        originalId,
        urlSlug: slugifyProjectId(originalId),
      };
    })
    .filter(Boolean) as { project: Project; originalId: string; urlSlug: string }[];

  const merged = await Promise.all(
    projectsWithIds.map(async ({ project, originalId, urlSlug }) => {
      let detail: ProjectDetail | null = null;
      let coverUrl: string | null = null;

      try {
        detail = await fetchProjectDetail(originalId, "main");
      } catch {
        detail = null;
      }

      const branch = detail?.branch || (detail as any)?.default_branch || "main";

      try {
        const medias = await fetchProjectMedia(originalId, "media", branch);
        const cover = pickCover(medias.filter(isImage));
        coverUrl = cover ? mediaUrl(cover) : null;
      } catch {
        coverUrl = null;
      }

      const mergedProject = mergeProjectData(project ?? {}, detail ?? undefined);

      return {
        ...mergedProject,
        id: urlSlug, // Use URL-safe slug as the ID for linking
        coverUrl,
        isPrivate: detail?.visibility === "private",
      };
    })
  );

  return merged;
}
