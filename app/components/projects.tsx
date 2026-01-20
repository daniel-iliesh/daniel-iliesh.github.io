"use client";

import { useRouter } from "next/navigation";
import { ExternalLink, Github } from "lucide-react";
import { useState } from "react";
import type { ProjectWithCover } from "app/lib/projectsData";
import { getProjectTypeInfo } from "../utils/projectTypes";
import { slugifyProjectId } from "../utils/slugify";
import Image from "next/image";

export interface ProjectsProps {
  projects: ProjectWithCover[];
}

export function Projects({ projects }: ProjectsProps) {
  const [coverLoaded, setCoverLoaded] = useState<Record<string, boolean>>({});
  const router = useRouter();

  if (!projects.length) {
    return (
      <p className="text-neutral-600 dark:text-neutral-400">
        Projects will be added soon. Check back later!
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {projects
        .filter((project) => project?.name)
        .map((project) => {
          const slug =
            project.id ||
            (project.name ? slugifyProjectId(project.name) : undefined);

          const metadataParts: string[] = [];
          const startDate = project.startDate;
          const endDate = project.endDate;
          const dateRange =
            startDate || endDate
              ? `${startDate ?? "Start"} — ${endDate ?? "Present"}`
              : null;
          const roles = project.roles?.filter(Boolean) ?? [];
          const projectTypeInfo = getProjectTypeInfo(project.type);
          const description = project.description;

          if (project.entity) {
            metadataParts.push(project.entity);
          }

          if (roles.length) {
            metadataParts.push(roles.join(", "));
          }
          if (dateRange) {
            metadataParts.push(dateRange);
          }

          const repoUrl =
            project.id && project.id.includes("/")
              ? `https://github.com/${project.id}`
              : project.url && project.url.includes("github.com")
                ? project.url
                : null;
          const isPrivateRepo = project.isPrivate;

          const coverUrl = project.coverUrl ?? null;

          const hasCover = !!coverUrl;

          return (
            <article
              key={project.name}
              className={`santa-interactive relative flex flex-col space-y-2 p-3 sm:p-4 rounded-lg border border-neutral-200/70 dark:border-neutral-800/70 shadow-sm hover:shadow-md transition-colors duration-300 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 overflow-hidden ${
                hasCover ? "" : "bg-black text-white"
              }`}
              tabIndex={slug ? 0 : -1}
              role={slug ? "button" : "article"}
              onClick={() => {
                if (slug) {
                  router.push(`/projects/${encodeURIComponent(slug)}`);
                }
              }}
              onKeyDown={(event) => {
                if (!slug) return;
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  router.push(`/projects/${encodeURIComponent(slug)}`);
                }
              }}
            >
              {coverUrl && (
                <div className="absolute inset-0 rounded-lg overflow-hidden">
                  <Image
                    src={coverUrl}
                    alt={project.name ?? "Project cover"}
                    fill
                    className="object-cover"
                    sizes="400px"
                    loading="lazy"
                    onLoad={() =>
                      setCoverLoaded((prev) => ({
                        ...prev,
                        [slug ?? project.name ?? ""]: true,
                      }))
                    }
                  />
                  <div className="absolute inset-0 bg-black/95 pointer-events-none" />
                  {!coverLoaded[slug ?? project.name ?? ""] && (
                    <div className="absolute inset-0 bg-neutral-900 animate-pulse" />
                  )}
                </div>
              )}

              <div className="relative space-y-2">
                <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-2 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2
                        className={`font-bold text-lg sm:text-xl tracking-tight transition-colors break-words ${
                          hasCover
                            ? "text-white"
                            : "text-neutral-900 dark:text-neutral-100 group-hover:text-black dark:group-hover:text-white"
                        }`}
                      >
                        {project.name}
                      </h2>
                      {project.type && (
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-medium ${projectTypeInfo.color} flex-shrink-0`}
                          title={projectTypeInfo.description}
                        >
                          {projectTypeInfo.label}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-2 self-start sm:self-auto min-h-[32px]">
                    {repoUrl && !isPrivateRepo && (
                      <a
                        href={repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-700 p-2 text-neutral-700 dark:text-neutral-200 transition hover:border-neutral-500 dark:hover:border-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                        onClick={(event) => event.stopPropagation()}
                        aria-label="View repository on GitHub"
                      >
                        <Github size={16} strokeWidth={2} />
                      </a>
                    )}
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 rounded-md transition-colors duration-200 whitespace-nowrap flex-shrink-0 touch-manipulation shadow-sm hover:shadow-md self-start sm:self-start"
                        onClick={(event) => event.stopPropagation()}
                        aria-label="Visit project"
                      >
                        <ExternalLink
                          size={14}
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                        <span className="hidden sm:inline">Visit</span>
                      </a>
                    )}
                  </div>
                </div>

                {metadataParts.length > 0 && (
                  <p
                    className={`text-sm ${
                      hasCover
                        ? "text-neutral-200"
                        : "text-neutral-500 dark:text-neutral-400"
                    }`}
                  >
                    {metadataParts.join(" · ")}
                  </p>
                )}
                {description && (
                  <p
                    className={`text-sm sm:text-base tracking-tight leading-relaxed ${
                      hasCover
                        ? "text-neutral-100"
                        : "text-neutral-800 dark:text-neutral-200"
                    }`}
                  >
                    {description}
                  </p>
                )}

                {project.keywords && project.keywords.length > 0 && (
                  <ul className="flex flex-wrap gap-1.5 sm:gap-2 pt-2">
                    {project.keywords.filter(Boolean).map((keyword) => (
                      <li
                        key={keyword}
                        className={`px-2 py-1 rounded-md text-xs font-medium transition-colors duration-200 touch-manipulation relative group/tooltip cursor-pointer ${
                          hasCover
                            ? "bg-white/15 text-white border border-white/20 hover:bg-white/20"
                            : "bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                        }`}
                        onClick={(event) => {
                          event.stopPropagation();
                          window.open(
                            `https://www.google.com/search?q=${keyword}`,
                            "_blank",
                          );
                        }}
                      >
                        {keyword}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          );
        })}
    </div>
  );
}

export default Projects;
