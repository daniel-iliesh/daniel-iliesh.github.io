import { create } from 'zustand';
import type { Resume } from '../features/resume/types';

interface ResumeState {
  resume: Resume | null;
  isLoading: boolean;
  error: Error | null;
  setResume: (resume: Resume) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
}

export const useResumeStore = create<ResumeState>((set) => ({
  resume: null,
  isLoading: false,
  error: null,
  setResume: (resume) => set({ resume, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

