import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProjectDetail, fetchProjectMedia } from "src/features/projects/api";
import type { MediaItem } from "src/features/projects/types";
import { fetchResume } from "src/features/resume/api";
import type { Project } from "src/features/resume/types";
import { getProjectTypeInfo } from "app/utils/projectTypes";
import { slugifyProjectId } from "app/utils/slugify";

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

function pickCover(media: MediaItem[]): MediaItem | null {
  if (!media.length) return null;
  const cover = media.find(
    (item) => /cover/i.test(item.name) && isImage(item)
  );
  if (cover) return cover;
  const firstImage = media.find(isImage);
  return firstImage ?? null;
}

function normalizeSlugMatch(projects: Project[] | undefined, slug: string) {
  return projects?.find(
    (project) =>
      project?.id === slug ||
      (project?.name && slugifyProjectId(project.name) === slug)
  );
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

  const [detail, media, resume] = await Promise.all([
    fetchProjectDetail(slug, DEFAULT_BRANCH).catch(() => null),
    fetchProjectMedia(slug, MEDIA_FOLDER, DEFAULT_BRANCH).catch(() => []),
    fetchResume().catch(() => null),
  ]);

  const resumeProject = normalizeSlugMatch(resume?.projects as Project[], slug);

  if (!detail && !resumeProject) {
    notFound();
  }

  const name = detail?.name ?? resumeProject?.name ?? slug;
  const description = detail?.description ?? resumeProject?.description;
  const roles = detail?.roles ?? resumeProject?.roles ?? [];
  const entity = detail?.entity ?? resumeProject?.entity;
  const projectTypeInfo = getProjectTypeInfo(detail?.type ?? resumeProject?.type);
  const keywords =
    detail?.keywords ?? resumeProject?.keywords ?? detail?.topics ?? [];
  const highlights = detail?.highlights ?? resumeProject?.highlights ?? [];
  const visitUrl = detail?.url ?? resumeProject?.url ?? detail?.homepage;
  const repoUrl =
    detail?.htmlUrl ??
    detail?.html_url ??
    (detail?.id ? `https://github.com/${detail.id}` : undefined) ??
    (slug.includes("/") ? `https://github.com/${slug}` : undefined);
  const languages = sortLanguages(detail?.languages);
  const readmeHtml = detail?.readmeHtml;

  const coverMedia = pickCover(media);
  const gallery = media.filter(
    (item) => item !== coverMedia && isImage(item)
  );

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            {name}
          </h1>
          <span
            className={`px-2 py-1 rounded-md text-xs font-medium ${projectTypeInfo.color}`}
            title={projectTypeInfo.description}
          >
            {projectTypeInfo.label}
          </span>
        </div>
        {(entity || roles.length > 0) && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {[entity, roles.filter(Boolean).join(", ")].filter(Boolean).join(" · ")}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {visitUrl && (
            <a
              href={visitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-600"
            >
              Visit project <span className="text-base">↗</span>
            </a>
          )}
          {repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-800 dark:border-neutral-700 dark:text-neutral-100 transition hover:border-neutral-500"
            >
              View repository
            </a>
          )}
        </div>
      </div>

      {coverMedia && (
        <div className="relative overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 aspect-video">
          <Image
            src={mediaUrl(coverMedia) || ""}
            alt={coverMedia.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 900px"
            priority
          />
        </div>
      )}

      {description && (
        <p className="text-base text-neutral-800 dark:text-neutral-200 leading-relaxed">
          {description}
        </p>
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
              <li
                key={keyword}
                className="px-2 py-1 rounded-md bg-neutral-100 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 text-xs font-medium"
              >
                {keyword}
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

      {gallery.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
            Media
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {gallery.map((item) => {
              const url = mediaUrl(item);
              if (!url) return null;
              return (
                <div
                  key={item.name}
                  className="relative aspect-video overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900"
                >
                  <Image
                    src={url}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              );
            })}
          </div>
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

      {!coverMedia && gallery.length === 0 && (
        <div className="rounded-md border border-dashed border-neutral-300 dark:border-neutral-700 p-4 text-sm text-neutral-500 dark:text-neutral-400">
          Add a `media/` folder to the repo to showcase visuals. The page will
          pull images automatically.
        </div>
      )}
    </section>
  );
}

