import jsonResume from '../../public/resume-full.json'
import type { Project } from 'src/features/resume/types'

const resumeProjects = (jsonResume.projects ?? []) as Project[]

export function Projects() {
  if (!resumeProjects.length) {
    return (
      <p className="text-neutral-600 dark:text-neutral-400">
        Projects will be added soon. Check back later!
      </p>
    )
  }

  return (
    <div className="space-y-6">
      {resumeProjects
        .filter((project) => project?.name)
        .map((project) => {
          const metadataParts: string[] = []
          const roles = project.roles?.filter(Boolean) ?? []

          if (project.entity) {
            metadataParts.push(project.entity)
          }

          if (roles.length) {
            metadataParts.push(roles.join(', '))
          }

          return (
            <article key={project.name} className="flex flex-col space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h2 className="font-bold text-xl tracking-tight text-neutral-900 dark:text-neutral-100">
                  {project.name}
                </h2>
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-500 hover:text-green-400"
                  >
                    Visit project ↗
                  </a>
                )}
              </div>

              {metadataParts.length > 0 && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {metadataParts.join(' · ')}
                </p>
              )}

              {project.description && (
                <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                  {project.description}
                </p>
              )}

              {project.keywords && project.keywords.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {project.keywords.filter(Boolean).map((keyword) => (
                    <li
                      key={keyword}
                      className="px-2 py-1 rounded-md bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 text-xs uppercase tracking-wide"
                    >
                      {keyword}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          )
        })}
    </div>
  )
}
