'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the heavy parallax component
const ParallaxBackground = dynamic(() => import('./ParallaxBackground').then(mod => ({ default: mod.ParallaxBackground })), {
  loading: () => <div className="parallax-bg" aria-hidden="true"><div className="parallax-bg__base" /></div>,
  ssr: false
});

export function OptimizedParallax() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Load parallax after initial render
    const timer = setTimeout(() => setShouldLoad(true), 1000);
    
    // Load earlier on scroll
    const handleScroll = () => {
      setShouldLoad(true);
      clearTimeout(timer);
    };

    window.addEventListener('scroll', handleScroll, { once: true, passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!shouldLoad) {
    // Render static placeholder while loading
    return (
      <div className="parallax-bg" aria-hidden="true">
        <div className="parallax-bg__base" />
      </div>
    );
  }

  return <ParallaxBackground />;
}
