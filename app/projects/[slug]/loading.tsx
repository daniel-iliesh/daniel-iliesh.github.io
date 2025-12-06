export default function LoadingProject() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-48 rounded-md bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
        <div className="h-4 w-32 rounded-md bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
        <div className="flex gap-2">
          <div className="h-9 w-32 rounded-md bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
          <div className="h-9 w-32 rounded-md bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
        </div>
      </div>
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-200 dark:bg-neutral-900 animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 w-5/6 rounded-md bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
        <div className="h-4 w-4/6 rounded-md bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
      </div>
      <div className="space-y-3">
        <div className="h-5 w-32 rounded-md bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded-md bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
          <div className="h-4 w-11/12 rounded-md bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
          <div className="h-4 w-2/3 rounded-md bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
        </div>
      </div>
    </section>
  );
}

