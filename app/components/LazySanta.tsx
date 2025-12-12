'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the heavy SantaSprite component
const SantaSprite = dynamic(() => import('./SantaSprite').then(mod => ({ default: mod.SantaSprite })), {
  loading: () => null,
  ssr: false
});

interface LazySantaProps {
  enabled?: boolean;
  scale?: number;
  gravity?: number;
  bounce?: number;
  friction?: number;
  padding?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
}

export function LazySanta(props: LazySantaProps) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Load Santa immediately after mount for better reliability
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 500); // Reduced from 3000ms to 500ms

    // Load earlier on user interaction
    const handleInteraction = () => {
      setShouldLoad(true);
      clearTimeout(timer);
    };

    const events = ['click', 'scroll', 'mousemove'] as const;
    events.forEach(event => {
      window.addEventListener(event, handleInteraction, { once: true, passive: true });
    });

    return () => {
      clearTimeout(timer);
      events.forEach(event => {
        window.removeEventListener(event, handleInteraction);
      });
    };
  }, []);

  if (!shouldLoad || !props.enabled) return null;

  return <SantaSprite {...props} />;
}
