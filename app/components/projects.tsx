"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchResume } from "src/features/resume/api";
import type { Project } from "src/features/resume/types";
import { getProjectTypeInfo } from "../utils/projectTypes";
import { slugifyProjectId } from "../utils/slugify";

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResume().then((resume) => {
      const resumeProjects = (resume.projects ?? []) as Project[];
      setProjects(resumeProjects);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 bg-neutral-100 dark:bg-neutral-900/50 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

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
          const metadataParts: string[] = [];
          const roles = project.roles?.filter(Boolean) ?? [];
          const projectTypeInfo = getProjectTypeInfo(project.type);
          const slug =
            project.id ||
            (project.name ? slugifyProjectId(project.name) : undefined);

          if (project.entity) {
            metadataParts.push(project.entity);
          }

          if (roles.length) {
            metadataParts.push(roles.join(", "));
          }

          return (
            <article
              key={project.name}
              className="flex flex-col space-y-2 p-3 sm:p-4 rounded-lg transition-colors duration-300 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-bold text-lg sm:text-xl tracking-tight text-neutral-900 dark:text-neutral-100 group-hover:text-black dark:group-hover:text-white transition-colors break-words">
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
                <div className="flex gap-2">
                  {slug && (
                    <Link
                      href={`/projects/${encodeURIComponent(slug)}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 rounded-md transition-colors duration-200 hover:border-neutral-500 dark:hover:border-neutral-500 whitespace-nowrap flex-shrink-0 touch-manipulation"
                    >
                      View details
                    </Link>
                  )}
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 rounded-md transition-colors duration-200 whitespace-nowrap flex-shrink-0 touch-manipulation shadow-sm hover:shadow-md self-start sm:self-start"
                    >
                      Visit project
                      <span className="text-base">↗</span>
                    </a>
                  )}
                </div>
              </div>

              {metadataParts.length > 0 && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {metadataParts.join(" · ")}
                </p>
              )}
              {project.description && (
                <p className="text-sm sm:text-base text-neutral-800 dark:text-neutral-200 tracking-tight leading-relaxed">
                  {project.description}
                </p>
              )}

              {project.keywords && project.keywords.length > 0 && (
                <ul className="flex flex-wrap gap-1.5 sm:gap-2 pt-2">
                  {project.keywords.filter(Boolean).map((keyword) => (
                    <li
                      key={keyword}
                      className="px-2 py-1 rounded-md bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400 text-xs font-medium transition-colors duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 touch-manipulation relative group/tooltip cursor-pointer"
                      onClick={() => {
                        window.open(
                          `https://www.google.com/search?q=${keyword}`,
                          "_blank"
                        );
                      }}
                    >
                      {keyword}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          );
        })}
    </div>
  );
}
