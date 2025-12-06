export interface ProjectDetail {
  id?: string; // GitHub slug "owner/repo"
  slug?: string;
  name?: string;
  description?: string;
  summary?: string;
  url?: string; // deployment/demo URL
  homepage?: string;
  htmlUrl?: string; // repository URL (camelCase)
  html_url?: string; // repository URL (API snake_case)
  visibility?: string; // e.g., 'public' | 'private'
  topics?: string[];
  keywords?: string[];
  tags?: string[];
  highlights?: string[];
  roles?: string[];
  entity?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  languages?: Record<string, number>;
  updated_at?: string;
  readme?: string;
  readmeHtml?: string;
  branch?: string;
  mediaFolder?: string;
  related?: RelatedProject[];
  blogContent?: string;
  blogSource?: string;
  medias?: MediaItem[];
}

export interface MediaItem {
  name: string;
  path?: string;
  download_url?: string;
  html_url?: string;
  url?: string;
  type?: string;
  size?: number;
}

export interface ProjectListItem extends ProjectDetail {}

export interface RelatedProject {
  id: string; // slug of related project
  relation?: string; // description of the relationship
}

