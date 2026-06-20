export type CvLink = {
  url: string;
  label: string;
};

export type ContactInfo = {
  label: string;
  value: string;
};

export type Profile = {
  name: string;
  images: string[];
  linksLabel: string;
  links: CvLink[];
  contactInfo: ContactInfo[];
  footer: { label: string };
};

export type ContentSection = {
  id: string;
  title: string;
  body: string; // raw markdown, rendered by <Markdown>
};

export type TimelineItem = {
  title: string;
  time: string;
  attributes: Record<string, string>;
};

export type TimelineGroup = {
  id: string;
  title: string;
  items: TimelineItem[];
};

export type Project = {
  id: string;
  title: string;
  url?: string;
  description?: string; // may contain inline markdown
  image?: string;
  images?: string[];
  tags: string[];
  hidden?: boolean; // shown only when URL has ?extended
};

export type SkillItem = {
  label: string;
  rating: number; // 1..5
  suffix: string;
};

export type SkillGroup = {
  title: string;
  items: SkillItem[];
};

export type SkillsBlock = {
  title: string;
  groups: SkillGroup[];
};

export type IconItem = {
  label: string;
  icon: string; // Font Awesome 7 icon name (no style prefix)
  variant?: 'solid' | 'regular'; // default 'solid'
};

export type NamedIconList = {
  title: string;
  items: IconItem[];
};

export type Cv = {
  profile: Profile;
  about: ContentSection[];
  workExperience: TimelineGroup;
  education: TimelineGroup;
  projects: Project[];
  skills: SkillsBlock;
  qualities: NamedIconList;
  interests: NamedIconList;
};
