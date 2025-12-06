import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProjectDetail, fetchProjectMedia } from "src/features/projects/api";
import type { MediaItem, RelatedProject } from "src/features/projects/types";
import { getProjectTypeInfo } from "app/utils/projectTypes";
import { PageTransition } from "app/components/PageTransition";
import { ExternalLink, Github } from "lucide-react";
import { MediaGallery } from "app/components/MediaGallery";
import { CustomMDX } from "app/components/mdx";
import { fetchResume } from "src/features/resume/api";
import type { Project } from "src/features/resume/types";
import { mergeProjectData } from "src/features/projects/merge";

const DEFAULT_BRANCH = "main";
const MEDIA_FOLDER = "media";

function mediaUrl(item: MediaItem): string | null {
  return item.download_url ?? item.path ?? item.html_url ?? null;
}

function isImage(item: MediaItem): boolean {
  const url = mediaUrl(item);
  if (!url) return false;
  return /\.(png|jpe?g|gif|webp|svg)$/i.test(url);
}

function isVideo(item: MediaItem): boolean {
  const url = mediaUrl(item);
  if (!url) return false;
  return /\.(mp4|webm|mov)$/i.test(url);
}

function pickCover(media: MediaItem[]): MediaItem | null {
  if (!media.length) return null;
  const cover = media.find(
    (item) => /cover/i.test(item.name) && isImage(item)
  );
  if (cover) return cover;
  const firstImage = media.find(isImage);
  return firstImage ?? null;
}

function sortLanguages(languages?: Record<string, number>) {
  if (!languages) return [];
  return Object.entries(languages).sort(([, a], [, b]) => (b ?? 0) - (a ?? 0));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = decodeURIComponent(params.slug);

  const detail = await fetchProjectDetail(slug, DEFAULT_BRANCH).catch(() => null);

  if (!detail) {
    notFound();
  }

  const branch = detail?.branch || (detail as any)?.default_branch || DEFAULT_BRANCH;
  const media = await fetchProjectMedia(slug, MEDIA_FOLDER, branch).catch(() => []);

  const resume = await fetchResume().catch(() => null);
  const resumeProjects = (resume?.projects ?? []) as Project[];
  const resumeProject = resumeProjects.find(
    (project) => project?.id === slug || (project?.name && slug === project.name)
  );
  const merged = mergeProjectData(resumeProject ?? {}, detail);


  const name = merged?.name ?? slug;
  const description = merged?.description;
  const roles = merged?.roles ?? [];
  const entity = merged?.entity;
  const projectTypeInfo = getProjectTypeInfo(merged?.type);
  const keywords = merged?.keywords ?? detail?.topics ?? [];
  const highlights = merged?.highlights ?? [];
  const startDate = merged?.startDate;
  const endDate = merged?.endDate;
  const dateRange =
    startDate || endDate ? `${startDate ?? "Start"} — ${endDate ?? "Present"}` : null;
  const visitUrl = merged?.url ?? detail?.url ?? detail?.homepage;
  const isPrivateRepo = detail?.visibility === "private";
  const repoUrl =
    detail?.htmlUrl ??
    detail?.html_url ??
    (merged?.id ? `https://github.com/${merged.id}` : undefined) ??
    (slug.includes("/") ? `https://github.com/${slug}` : undefined);
  const languages = sortLanguages(detail?.languages);
  const readmeHtml = detail?.readmeHtml;
  const blogContent = merged?.blogContent ?? detail?.blogContent;
  const relatedProjects: RelatedProject[] = (merged?.related ?? detail?.related ?? []).filter(
    (item): item is RelatedProject => Boolean(item?.id)
  );

  const images = media.filter(isImage);
  const videos = media.filter(isVideo);
  const coverMedia = pickCover(images);
  const restImages = coverMedia ? images.filter((m) => m !== coverMedia) : images;

  const galleryItems =
    coverMedia || restImages.length || videos.length
      ? Array.from(
          new Map(
            [coverMedia, ...restImages, ...videos]
              .filter(Boolean)
              .map((item) => {
                const url = mediaUrl(item as MediaItem);
                if (!url) return null;
                const type = isVideo(item as MediaItem) ? "video" : "image";
                return [
                  url,
                  { url, alt: (item as MediaItem).name || name, type },
                ];
              })
              .filter(Boolean) as [string, { url: string; alt: string; type: "image" | "video" }][]
          ).values()
        )
      : [];
  const heroMedia = galleryItems.find((item) => item.type === "image") || galleryItems[0];

  const headerContent = (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-2 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white inline-flex items-center gap-2 flex-wrap leading-tight">
            <span className="leading-tight">{name}</span>
            <span
              className={`px-2 py-1 rounded-md text-xs font-medium ${projectTypeInfo.color} flex-shrink-0`}
              title={projectTypeInfo.description}
            >
              {projectTypeInfo.label}
            </span>
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:flex-none sm:ml-auto">
          {repoUrl && !isPrivateRepo && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-700 p-2 text-neutral-200 transition hover:border-neutral-500 dark:hover:border-neutral-500 hover:bg-white/10"
              aria-label="View repository on GitHub"
            >
              <Github size={16} strokeWidth={2} />
            </a>
          )}
          {visitUrl && (
            <a
              href={visitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-600"
              aria-label="Visit project"
            >
              <ExternalLink size={16} strokeWidth={2} aria-hidden="true" />
              <span className="hidden sm:inline">Visit</span>
            </a>
          )}
        </div>
      </div>
      {(entity || roles.length > 0 || dateRange) && (
        <p className="text-sm text-neutral-200 flex flex-wrap items-center gap-2">
          {[entity, roles.filter(Boolean).join(", ")].filter(Boolean).join(" · ")}
          {entity || roles.length > 0 ? (dateRange ? <span aria-hidden="true">·</span> : null) : null}
          {dateRange}
        </p>
      )}
      {description && (
        <p className="text-sm sm:text-base text-neutral-100 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );

  return (
    <PageTransition>
      <section className="space-y-8">
        {heroMedia ? (
          <div className="relative overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroMedia.url})` }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/90" />
            <div className="relative z-10 p-4 sm:p-6">{headerContent}</div>
          </div>
        ) : (
          <div className="space-y-3">{headerContent}</div>
        )}

      {highlights.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Highlights</h2>
          <ul className="space-y-1 list-disc pl-5 text-neutral-700 dark:text-neutral-200">
            {highlights.filter(Boolean).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {keywords.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
            Topics & keywords
          </h3>
          <ul className="flex flex-wrap gap-1.5">
            {keywords.filter(Boolean).map((keyword) => (
              <li key={keyword}>
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(keyword)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex px-2 py-1 rounded-md bg-neutral-100 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 text-xs font-medium transition-colors duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer"
                >
                  {keyword}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {languages.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
            Languages
          </h3>
          <div className="flex flex-wrap gap-2 text-sm text-neutral-700 dark:text-neutral-200">
            {languages.map(([language]) => (
              <span
                key={language}
                className="rounded-md border border-neutral-200 dark:border-neutral-800 px-2 py-1"
              >
                {language}
              </span>
            ))}
          </div>
        </div>
      )}

      {galleryItems.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
            Media
          </h3>
          <MediaGallery items={galleryItems} showHero />
        </div>
      )}

      {blogContent && (
        <section className="space-y-2 max-w-4xl">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                Project write-up
              </h3>
              {detail?.blogSource && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Source: {detail.blogSource}
                </p>
              )}
            </div>
          </div>
          <article className="prose prose-neutral dark:prose-invert max-w-none rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-3 shadow-sm leading-relaxed">
            <CustomMDX source={blogContent} />
          </article>
        </section>
      )}

      {relatedProjects.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
            Related projects
          </h3>
          <ul className="space-y-2">
            {relatedProjects.map((item) => {
              const targetSlug = item.id;
              return (
                <li key={item.id}>
                  <Link
                    href={`/projects/${encodeURIComponent(targetSlug)}`}
                    className="flex items-center justify-between rounded-md border border-neutral-200 dark:border-neutral-800 px-3 py-2 text-sm transition hover:border-neutral-400 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900/60"
                  >
                    <span className="font-medium text-neutral-800 dark:text-neutral-100">
                      {item.id}
                    </span>
                    {item.relation && (
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {item.relation}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {readmeHtml && (
        <article className="prose prose-neutral dark:prose-invert max-w-none border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-white dark:bg-neutral-900">
          <div dangerouslySetInnerHTML={{ __html: readmeHtml }} />
        </article>
      )}

      {!readmeHtml && detail?.readme && (
        <article className="prose prose-neutral dark:prose-invert max-w-none border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-white dark:bg-neutral-900 whitespace-pre-wrap">
          {detail.readme}
        </article>
      )}

      {galleryItems.length === 0 && null}
      </section>
    </PageTransition>
  );
}

