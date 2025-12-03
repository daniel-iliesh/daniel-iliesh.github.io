'use client';

interface AnimatedBlogPostProps {
  title: string;
  date: string;
  children: React.ReactNode;
}

export function AnimatedBlogPost({ title, date, children }: AnimatedBlogPostProps) {
  return (
    <section>
      <h1 className="title font-semibold text-xl sm:text-2xl tracking-tighter">{title}</h1>
      <div className="flex justify-between items-center mt-2 mb-6 sm:mb-8">
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">{date}</p>
      </div>
      <article className="prose">{children}</article>
    </section>
  );
}

