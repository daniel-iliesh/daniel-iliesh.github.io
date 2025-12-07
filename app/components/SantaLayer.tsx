'use client';

import { usePathname } from 'next/navigation';
import { SantaSprite } from './SantaSprite';

export function SantaLayer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/santa-game')) return null;

  return (
    <SantaSprite
      enabled={true}
      scale={0.15}
      gravity={0.5}
      bounce={0.4}
      friction={0.98}
    />
  );
}

