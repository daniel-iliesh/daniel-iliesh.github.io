export interface Resume {
    $schema?: string;
    basics?: Basics;
    work?: Work[];
    education?: Education[];
    skills?: Skill[];
    languages?: Language[];
    projects?: Project[];
    awards?: Award[];
    meta?: Meta;
  }
  
  export interface Basics {
    name?: string;
    label?: string;
    email?: string;
    phone?: string;
    image?: string;
    url?: string;
    summary?: string;
    location?: Location;
    profiles?: Profile[];
  }
  
  export interface Location {
    city?: string;
    countryCode?: string;
  }
  
  export interface Profile {
    network?: string;
    username?: string;
    url?: string;
  }
  
  export interface Work {
    name?: string;
    location?: string;
    description?: string;
    position?: string;
    url?: string;
    startDate?: string;
    endDate?: string;
    summary?: string;
    highlights?: string[];
  }
  
  export interface Education {
    institution?: string;
    area?: string;
    studyType?: string;
    startDate?: string;
    endDate?: string;
    score?: string;
    courses?: string[];
  }
  
  export interface Skill {
    name?: string;
    level?: string;
    keywords?: string[];
  }
  
  export interface Language {
    language?: string;
    fluency?: string;
  }
  
  export interface Project {
    name?: string;
    description?: string;
    highlights?: string[];
    keywords?: string[];
    url?: string;
    roles?: string[];
    entity?: string;
    type?: string;
  }
  
  export interface Award {
    title?: string;
    date?: string;
    awarder?: string;
    summary?: string;
  }
  
  export interface Meta {
    version?: string;
    lastModified?: string;
  }
  