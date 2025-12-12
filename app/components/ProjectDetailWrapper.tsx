'use client';

import { useResumeStore } from '../../src/stores/resumeStore';
import { useProjectsStore } from '../../src/stores/projectsStore';
import { useEffect } from 'react';
import type { ProjectDetail, MediaItem } from '../../src/features/projects/types';
import type { Project } from '../../src/features/resume/types';
import { mergeProjectData } from '../../src/features/projects/merge';

interface ProjectDetailWrapperProps {
  slug: string;
  initialDetail: ProjectDetail | null;
  initialMedia: MediaItem[];
  initialResume: any;
  children: (data: {
    detail: ProjectDetail | null;
    media: MediaItem[];
    resumeProject: Project | undefined;
    merged: ReturnType<typeof mergeProjectData>;
  }) => React.ReactNode;
}

export function ProjectDetailWrapper({
  slug,
  initialDetail,
  initialMedia,
  initialResume,
  children,
}: ProjectDetailWrapperProps) {
  const resume = useResumeStore((state) => state.resume);
  const setResume = useResumeStore((state) => state.setResume);
  const setProjectDetail = useProjectsStore((state) => state.setProjectDetail);
  const cachedDetail = useProjectsStore((state) => state.getProjectDetail(slug));

  // Hydrate resume store if we have initial data
  useEffect(() => {
    if (initialResume && !resume) {
      setResume(initialResume);
    }
  }, [initialResume, resume, setResume]);

  // Cache the project detail in the store
  useEffect(() => {
    if (initialDetail && initialMedia && !cachedDetail) {
      setProjectDetail(slug, initialDetail, initialMedia);
    }
  }, [slug, initialDetail, initialMedia, cachedDetail, setProjectDetail]);

  // Use cached data if available, otherwise use initial data
  const detail = cachedDetail?.detail || initialDetail;
  const media = cachedDetail?.media || initialMedia;
  const currentResume = resume || initialResume;

  const resumeProjects = (currentResume?.projects ?? []) as Project[];
  const resumeProject = resumeProjects.find(
    (project) => project?.id === slug || (project?.name && slug === project.name)
  );
  const merged = mergeProjectData(resumeProject ?? {}, detail ?? undefined);

  return <>{children({ detail, media, resumeProject, merged })}</>;
}

