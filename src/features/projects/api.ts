import { RESUME_BACKEND_BASE_URL } from "src/features/resume/constants";
import type { MediaItem, ProjectDetail, ProjectListItem } from "./types";

const DEFAULT_REVALIDATE_SECONDS = 3600;
const API_BASE = RESUME_BACKEND_BASE_URL;

export interface FetchProjectsOptions {
  includePrivate?: boolean;
  skipVisibleFilter?: boolean;
  revalidate?: number;
}

export async function fetchProjects({
  includePrivate = false,
  skipVisibleFilter = false,
  revalidate = DEFAULT_REVALIDATE_SECONDS,
}: FetchProjectsOptions = {}): Promise<ProjectListItem[]> {
  const searchParams = new URLSearchParams({
    includePrivate: String(includePrivate),
    skipVisibleFilter: String(skipVisibleFilter),
  });

  const response = await fetch(`${API_BASE}/projects?${searchParams.toString()}`, {
    headers: { Accept: "application/json" },
    next: { revalidate },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch projects (status ${response.status})`);
  }

  return (await response.json()) as ProjectListItem[];
}

export async function fetchProjectDetail(
  slug: string,
  branch = "main",
  revalidate = 900
): Promise<ProjectDetail | null> {
  const url = `${API_BASE}/projects/${encodeURIComponent(slug)}?branch=${encodeURIComponent(branch)}`;
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch project detail (status ${response.status})`);
  }

  return (await response.json()) as ProjectDetail;
}

export async function fetchProjectMedia(
  repo: string,
  folder = "media",
  branch = "main"
): Promise<MediaItem[]> {
  const url = `${API_BASE}/media/${encodeURIComponent(repo)}?folder=${encodeURIComponent(
    folder
  )}&branch=${encodeURIComponent(branch)}`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  return (await response.json()) as MediaItem[];
}

