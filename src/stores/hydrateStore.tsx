'use client';

import { useEffect } from 'react';
import { useResumeStore } from './resumeStore';
import { useProjectsStore } from './projectsStore';
import type { Resume } from '../features/resume/types';
import type { ProjectWithCover } from '../../app/lib/projectsData';

interface HydrateProps {
  resume?: Resume;
  projects?: ProjectWithCover[];
}

/**
 * Client component to hydrate Zustand stores with server-fetched data
 * This ensures data is loaded once on the server and cached in the store
 */
export function HydrateStores({ resume, projects }: HydrateProps) {
  const setResume = useResumeStore((state) => state.setResume);
  const setProjects = useProjectsStore((state) => state.setProjects);

  useEffect(() => {
    if (resume) {
      setResume(resume);
    }
    if (projects) {
      setProjects(projects);
    }
  }, [resume, projects, setResume, setProjects]);

  return null;
}

