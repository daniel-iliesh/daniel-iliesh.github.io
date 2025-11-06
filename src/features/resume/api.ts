import { RESUME_GIST_URL } from "./constants";
import type { Resume } from "./types";

interface FetchResumeOptions {
  revalidate?: number;
}

export async function fetchResume({
  revalidate = 3600,
}: FetchResumeOptions = {}): Promise<Resume> {
  const response = await fetch(RESUME_GIST_URL, {
    headers: {
      Accept: "application/json",
    },
    next: {
      revalidate,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch resume data (status ${response.status})`);
  }

  return (await response.json()) as Resume;
}
