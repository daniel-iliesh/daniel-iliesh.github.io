'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import CalComPopupBtn from "./calcompopupbtn";

export function LazyAnalytics() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin') ?? false;

  useEffect(() => {
    // Don't load analytics/FAB on admin routes
    if (isAdminRoute) return;

    // Load analytics after user interaction or timeout
    const loadTimer = setTimeout(() => setShouldLoad(true), 5000);
    
    const handleUserInteraction = () => {
      setShouldLoad(true);
      clearTimeout(loadTimer);
    };

    // Load on any user interaction
    const events = ['click', 'scroll', 'keydown', 'mousemove'];
    events.forEach(event => {
      window.addEventListener(event, handleUserInteraction, { once: true });
    });

    return () => {
      clearTimeout(loadTimer);
      events.forEach(event => {
        window.removeEventListener(event, handleUserInteraction);
      });
    };
  }, [isAdminRoute]);

  // Don't render on admin routes
  if (isAdminRoute || !shouldLoad) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
      <CalComPopupBtn />
    </>
  );
}
