"use client";

import { usePathname } from 'next/navigation';
import { OptimizedParallax } from "./OptimizedParallax";
import { SantaLayer } from "./SantaLayer";
import { SnowOverlay } from "./SnowOverlay";
import { Lightrope } from "./Lightrope";
import { SantaLoadingOverlay } from "./SantaLoadingOverlay";

interface ConditionalSeasonalEffectsProps {
  isSnowEnabled: boolean;
  isSantaEnabled: boolean;
  isLightsEnabled: boolean;
}

export function ConditionalSeasonalEffects({
  isSnowEnabled,
  isSantaEnabled,
  isLightsEnabled,
}: ConditionalSeasonalEffectsProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin') ?? false;

  // Don't render seasonal effects on admin routes
  if (isAdminRoute) {
    return null;
  }

  // Render seasonal effects for public routes
  return (
    <>
      <SantaLoadingOverlay />
      <OptimizedParallax />
      {isLightsEnabled && <Lightrope />}
      {isSnowEnabled && <SnowOverlay enabled={isSnowEnabled} />}
      {isSantaEnabled && <SantaLayer />}
    </>
  );
}

