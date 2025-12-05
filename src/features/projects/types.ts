export interface ProjectDetail {
  id?: string; // GitHub slug "owner/repo"
  name?: string;
  description?: string;
  url?: string; // deployment/demo URL
  homepage?: string;
  htmlUrl?: string; // repository URL (camelCase)
  html_url?: string; // repository URL (API snake_case)
  topics?: string[];
  keywords?: string[];
  highlights?: string[];
  roles?: string[];
  entity?: string;
  type?: string;
  languages?: Record<string, number>;
  readme?: string;
  readmeHtml?: string;
  branch?: string;
  mediaFolder?: string;
}

export interface MediaItem {
  name: string;
  path?: string;
  download_url?: string;
  html_url?: string;
  type?: string;
  size?: number;
}

export interface ProjectListItem extends ProjectDetail {}

