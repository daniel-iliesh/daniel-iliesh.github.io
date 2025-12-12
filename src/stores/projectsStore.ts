import { create } from 'zustand';
import type { ProjectDetail, MediaItem } from '../features/projects/types';
import type { ProjectWithCover } from '../../app/lib/projectsData';

interface ProjectsState {
  projects: ProjectWithCover[];
  projectDetails: Map<string, { detail: ProjectDetail; media: MediaItem[] }>;
  isLoading: boolean;
  error: Error | null;
  setProjects: (projects: ProjectWithCover[]) => void;
  setProjectDetail: (slug: string, detail: ProjectDetail, media: MediaItem[]) => void;
  getProjectDetail: (slug: string) => { detail: ProjectDetail; media: MediaItem[] } | null;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  projectDetails: new Map(),
  isLoading: false,
  error: null,
  setProjects: (projects) => set({ projects, error: null }),
  setProjectDetail: (slug, detail, media) =>
    set((state) => {
      const newMap = new Map(state.projectDetails);
      newMap.set(slug, { detail, media });
      return { projectDetails: newMap };
    }),
  getProjectDetail: (slug) => {
    const state = get();
    return state.projectDetails.get(slug) || null;
  },
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

