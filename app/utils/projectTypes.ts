import { ProjectType } from 'src/features/resume/types';

export const PROJECT_TYPE_DEFINITIONS: Record<string, { label: string; description: string; color: string }> = {
  [ProjectType.EMPLOYER]: {
    label: 'Employer',
    description: 'Project developed as part of employment',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  },
  [ProjectType.PERSONAL]: {
    label: 'Personal',
    description: 'Personal side project or open-source contribution',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  },
  [ProjectType.CONTRACT]: {
    label: 'Contract',
    description: 'Project developed as a contractor or freelancer',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  },
  [ProjectType.UNIVERSITY]: {
    label: 'University',
    description: 'Academic project or coursework',
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  },
  default: {
    label: 'Project',
    description: 'A software development project',
    color: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
  },
};

export function getProjectTypeInfo(type?: string | ProjectType) {
  if (!type) return PROJECT_TYPE_DEFINITIONS.default;
  const normalizedType = typeof type === 'string' ? type.toLowerCase() : type;
  return PROJECT_TYPE_DEFINITIONS[normalizedType] || PROJECT_TYPE_DEFINITIONS.default;
}

