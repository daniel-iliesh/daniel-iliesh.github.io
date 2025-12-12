'use client';

import { useEffect } from 'react';
import { useResumeStore } from '../../src/stores/resumeStore';
import { fetchResume } from '../../src/features/resume/api';
import type { Resume } from '../../src/features/resume/types';

interface ResumeProviderProps {
  initialResume?: Resume;
  children: React.ReactNode;
}

/**
 * Provider component that ensures resume data is loaded once and cached
 */
export function ResumeProvider({ initialResume, children }: ResumeProviderProps) {
  const resume = useResumeStore((state) => state.resume);
  const setResume = useResumeStore((state) => state.setResume);
  const isLoading = useResumeStore((state) => state.isLoading);
  const setLoading = useResumeStore((state) => state.setLoading);

  useEffect(() => {
    // If we have initial data from server, use it
    if (initialResume && !resume) {
      setResume(initialResume);
      return;
    }

    // If we already have cached data, don't fetch
    if (resume) {
      return;
    }

    // Otherwise, fetch once
    if (!isLoading) {
      setLoading(true);
      fetchResume()
        .then((data) => {
          setResume(data);
        })
        .catch((error) => {
          console.error('Failed to fetch resume:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [initialResume, resume, setResume, isLoading, setLoading]);

  return <>{children}</>;
}

