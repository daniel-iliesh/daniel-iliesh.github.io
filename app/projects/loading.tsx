export default function Loading() {
  return (
    <section className="space-y-6">
      <div className="h-8 w-40 rounded-md bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-lg border border-neutral-200/70 dark:border-neutral-800/70 p-4 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-2">
                <div className="h-5 w-48 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                <div className="h-4 w-64 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <div className="h-9 w-9 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                <div className="h-9 w-20 rounded-md bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <div className="h-4 w-full rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((__, pillIndex) => (
                <div
                  key={pillIndex}
                  className="h-6 w-20 rounded-md bg-neutral-200 dark:bg-neutral-800 animate-pulse"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

