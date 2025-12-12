'use client';

import { useEffect, useState } from 'react';

export function SantaLoadingOverlay() {
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    // Hide overlay after Santa has time to load
    const timer = setTimeout(() => {
      setShowOverlay(false);
    }, 2000);

    // Hide earlier on user interaction
    const handleInteraction = () => {
      setShowOverlay(false);
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

  if (!showOverlay) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#000000',
        zIndex: 9997,
        transition: 'opacity 500ms ease-in-out',
        opacity: 1
      }}
      aria-hidden="true"
    />
  );
}
