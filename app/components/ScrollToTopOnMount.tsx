'use client';

import { useEffect } from 'react';

type ScrollBehavior = 'auto' | 'smooth';

export function ScrollToTopOnMount({ behavior = 'auto' }: { behavior?: ScrollBehavior }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior });
    }
  }, [behavior]);

  return null;
}

