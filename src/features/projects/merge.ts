import type { Project } from "src/features/resume/types";
import type { ProjectDetail } from "./types";

export interface MergedProject extends Project {
  backend?: ProjectDetail;
}

function coalesce<T>(primary: T | undefined, fallback: T | undefined): T | undefined {
  return primary !== undefined && primary !== null && primary !== "" ? primary : fallback;
}

export function mergeProjectData(resumeProject: Project, backendProject?: ProjectDetail): MergedProject {
  const merged: MergedProject = {
    ...resumeProject,
    backend: backendProject,
  };

  // Prefer resume as source of truth; fill missing from backend
  merged.name = coalesce(resumeProject.name, backendProject?.name);
  merged.description = coalesce(resumeProject.description, backendProject?.description ?? backendProject?.summary);
  merged.entity = coalesce(resumeProject.entity, backendProject?.entity);
  merged.roles = (resumeProject.roles && resumeProject.roles.length ? resumeProject.roles : backendProject?.roles) ?? [];
  merged.type = coalesce(resumeProject.type, backendProject?.type);
  merged.startDate = coalesce(resumeProject.startDate, backendProject?.startDate);
  merged.endDate = coalesce(resumeProject.endDate, backendProject?.endDate);
  merged.url = coalesce(resumeProject.url, backendProject?.url ?? backendProject?.homepage);
  merged.keywords =
    (resumeProject.keywords && resumeProject.keywords.length
      ? resumeProject.keywords
      : backendProject?.keywords ?? backendProject?.topics ?? backendProject?.tags) ?? [];
  merged.highlights = (resumeProject.highlights && resumeProject.highlights.length
    ? resumeProject.highlights
    : backendProject?.highlights) ?? [];
  merged.blogContent = coalesce(resumeProject.blogContent, backendProject?.blogContent);
  merged.blogSource = coalesce(resumeProject.blogSource, backendProject?.blogSource);

  // ID/slug: prefer resume id, else backend slug/id
  merged.id = coalesce(resumeProject.id, backendProject?.slug ?? backendProject?.id);

  // Attach backend medias separately (not overriding resume)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (merged as any).medias = backendProject?.medias;

  return merged;
}

