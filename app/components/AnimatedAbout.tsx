'use client';

interface AnimatedAboutProps {
  summary: string;
}

export function AnimatedAbout({ summary }: AnimatedAboutProps) {
  return (
    <div className="mb-4 sm:mb-6">
      <div className="text-lg sm:text-xl text-green-400 font-bold">About me</div>
      <div className="mt-2 text-sm sm:text-base leading-relaxed">{summary}</div>
    </div>
  );
}

