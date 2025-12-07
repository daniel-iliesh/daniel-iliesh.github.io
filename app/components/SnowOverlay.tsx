'use client';

import { memo, useEffect, useRef } from 'react';

interface SnowOverlayProps {
  enabled?: boolean;
  count?: number;
  color?: string;
}

type Flake = {
  x: number;
  y: number;
  r: number;
  speed: number;
  wind: number;
};

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

export const SnowOverlay = memo(function SnowOverlay({
  enabled = true,
  count = 150,
  color = 'white',
}: SnowOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const flakesRef = useRef<Flake[]>([]);
  const lastTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const initFlakes = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      flakesRef.current = Array.from({ length: count }).map(() => ({
        x: rand(0, w),
        y: rand(-h, h),
        r: rand(0.5, 3),
        speed: rand(20, 60), // px/s
        wind: rand(-15, 30), // px/s
      }));
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.scale(dpr, dpr);
      initFlakes();
    };

    const update = (dt: number) => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      for (const f of flakesRef.current) {
        f.y += (f.speed * dt) / 1000;
        f.x += (f.wind * dt) / 1000;

        if (f.y > h) {
          f.y = -f.r;
          f.x = rand(0, w);
        }
        if (f.x > w) f.x = f.x - w;
        if (f.x < 0) f.x = w + f.x;
      }
    };

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      for (const f of flakesRef.current) {
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (now: number) => {
      const dt = now - lastTimeRef.current;
      lastTimeRef.current = now;
      update(dt);
      draw();
      frameRef.current = requestAnimationFrame(loop);
    };

    resize();
    lastTimeRef.current = performance.now();
    frameRef.current = requestAnimationFrame(loop);
    window.addEventListener('resize', resize);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [enabled, count, color]);

  if (!enabled) return null;

  return <canvas ref={canvasRef} className="snow-canvas" aria-hidden="true" />;
});

