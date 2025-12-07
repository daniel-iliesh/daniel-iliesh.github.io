'use client';

/**
 * Decorative lightrope across the top of the page.
 * Pointer-events are disabled so it won't block interactions.
 */
export function Lightrope() {
  // 40 bulbs
  const bulbs = Array.from({ length: 40 });
  return (
    <ul className="lightrope" aria-hidden="true">
      {bulbs.map((_, idx) => (
        <li key={idx} />
      ))}
    </ul>
  );
}

