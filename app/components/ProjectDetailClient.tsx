'use client';

import { useResumeStore } from '../../src/stores/resumeStore';
import { useProjectsStore } from '../../src/stores/projectsStore';
import { useEffect } from 'react';
import type { ProjectDetail, MediaItem } from '../../src/features/projects/types';

interface ProjectDetailClientProps {
  slug: string;
  initialDetail: ProjectDetail | null;
  initialMedia: MediaItem[];
  children: (data: {
    detail: ProjectDetail | null;
    media: MediaItem[];
    resumeProject: any;
    merged: any;
  }) => React.ReactNode;
}

export function ProjectDetailClient({
  slug,
  initialDetail,
  initialMedia,
  children,
}: ProjectDetailClientProps) {
  const resume = useResumeStore((state) => state.resume);
  const setProjectDetail = useProjectsStore((state) => state.setProjectDetail);
  const cachedDetail = useProjectsStore((state) => state.getProjectDetail(slug));

  // Cache the detail data in the store
  useEffect(() => {
    if (initialDetail && initialMedia && !cachedDetail) {
      setProjectDetail(slug, initialDetail, initialMedia);
    }
  }, [slug, initialDetail, initialMedia, cachedDetail, setProjectDetail]);

  // Use cached data if available, otherwise use initial data
  const detail = cachedDetail?.detail || initialDetail;
  const media = cachedDetail?.media || initialMedia;

  const resumeProjects = (resume?.projects ?? []) as any[];
  const resumeProject = resumeProjects.find(
    (project) => project?.id === slug || (project?.name && slug === project.name)
  );

  // Merge data (you'll need to import mergeProjectData)
  const merged = resumeProject ? { ...resumeProject, ...detail } : detail;

  return <>{children({ detail, media, resumeProject, merged })}</>;
}

