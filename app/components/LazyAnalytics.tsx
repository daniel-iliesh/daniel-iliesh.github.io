"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export function LazyAnalytics() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Load analytics after user interaction or timeout
    const loadTimer = setTimeout(() => setShouldLoad(true), 5000);

    const handleUserInteraction = () => {
      setShouldLoad(true);
      clearTimeout(loadTimer);
    };

    // Load on any user interaction
    const events = ["click", "scroll", "keydown", "mousemove"];
    events.forEach((event) => {
      window.addEventListener(event, handleUserInteraction, { once: true });
    });

    return () => {
      clearTimeout(loadTimer);
      events.forEach((event) => {
        window.removeEventListener(event, handleUserInteraction);
      });
    };
  }, []);

  if (!shouldLoad) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
