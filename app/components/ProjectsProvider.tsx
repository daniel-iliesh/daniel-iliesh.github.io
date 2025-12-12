'use client';

import { useEffect } from 'react';
import { useProjectsStore } from '../../src/stores/projectsStore';
import { fetchMergedProjects } from '../../app/lib/projectsData';
import type { ProjectWithCover } from '../../app/lib/projectsData';

interface ProjectsProviderProps {
  initialProjects?: ProjectWithCover[];
  children: React.ReactNode;
}

/**
 * Provider component that ensures projects data is loaded once and cached
 */
export function ProjectsProvider({ initialProjects, children }: ProjectsProviderProps) {
  const projects = useProjectsStore((state) => state.projects);
  const setProjects = useProjectsStore((state) => state.setProjects);
  const isLoading = useProjectsStore((state) => state.isLoading);
  const setLoading = useProjectsStore((state) => state.setLoading);

  useEffect(() => {
    // If we already have cached data in store, don't fetch or update
    if (projects.length > 0) {
      return;
    }

    // If we have initial data from server, use it (only if store is empty)
    if (initialProjects && initialProjects.length > 0) {
      setProjects(initialProjects);
      return;
    }

    // Otherwise, fetch once (only if not already loading and store is empty)
    if (!isLoading) {
      setLoading(true);
      fetchMergedProjects()
        .then((data) => {
          setProjects(data);
        })
        .catch((error) => {
          console.error('Failed to fetch projects:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [initialProjects, projects.length, setProjects, isLoading, setLoading]);

  return <>{children}</>;
}

