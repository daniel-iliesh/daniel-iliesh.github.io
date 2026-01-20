"use client";

import { usePathname } from "next/navigation";
import { LazySanta } from "./LazySanta";
import "./Santa.css";

export function SantaLayer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/santa-game")) return null;

  return (
    <LazySanta
      enabled={true}
      scale={0.15}
      gravity={0.5}
      bounce={0.4}
      friction={0.98}
    />
  );
}
