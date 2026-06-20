// Adapters that turn Strapi v5 REST payloads into the frontend CV types.
import type {
  Profile,
  Project,
  TimelineItem,
  SkillGroup,
  IconItem,
} from '@/data/cv.types';
import type { HomeSection } from '@/data/home.types';

export const CMS_URL = import.meta.env.VITE_CMS_URL ?? 'http://localhost:1337';

// --- raw Strapi shapes (only the fields we read) ---------------------------

type StrapiMedia = { url: string } | null;

type RawProject = {
  documentId: string;
  slug: string;
  title: string;
  url?: string | null;
  description?: string | null;
  tags?: string[] | null;
  hidden?: boolean | null;
  order?: number | null;
  image?: StrapiMedia;
  images?: { url: string }[] | null;
};

type RawProfile = {
  name: string;
  linksLabel?: string | null;
  footerLabel?: string | null;
  links?: { url: string; label: string }[] | null;
  contactInfo?: { label: string; value: string }[] | null;
  images?: { url: string }[] | null;
};

type RawSection =
  | { __component: 'sections.about'; title?: string; body?: string }
  | { __component: 'sections.timeline'; title: string; items?: TimelineItem[] }
  | { __component: 'sections.skills'; title?: string; groups?: SkillGroup[] }
  | { __component: 'sections.icon-list'; title: string; items?: IconItem[] }
  | { __component: 'sections.projects'; title?: string; showHidden?: boolean }
  | {
      __component: 'sections.attributes';
      skillsTitle?: string;
      groups?: SkillGroup[];
      qualitiesTitle?: string;
      qualities?: IconItem[];
      interestsTitle?: string;
      interests?: IconItem[];
    };

export type RawHomepage = { sections?: RawSection[] };

// --- helpers ---------------------------------------------------------------

/** Absolute URL for a Strapi media object (Strapi returns site-relative paths). */
export function mediaUrl(media: StrapiMedia): string | undefined {
  if (!media?.url) return undefined;
  return media.url.startsWith('http') ? media.url : `${CMS_URL}${media.url}`;
}

function mediaList(items?: { url: string }[] | null): string[] {
  return (items ?? []).map((m) => mediaUrl(m)).filter((u): u is string => Boolean(u));
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// --- transforms ------------------------------------------------------------

export function toProject(raw: RawProject): Project {
  return {
    id: raw.slug || raw.documentId,
    title: raw.title,
    url: raw.url ?? undefined,
    description: raw.description ?? undefined,
    image: mediaUrl(raw.image ?? null),
    images: raw.images ? mediaList(raw.images) : undefined,
    tags: raw.tags ?? [],
    hidden: raw.hidden ?? false,
  };
}

export function toProjects(data: RawProject[]): Project[] {
  return data
    .toSorted((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map(toProject);
}

export function toProfile(raw: RawProfile): Profile {
  return {
    name: raw.name,
    images: mediaList(raw.images),
    linksLabel: raw.linksLabel ?? '',
    links: raw.links ?? [],
    contactInfo: raw.contactInfo ?? [],
    footer: { label: raw.footerLabel ?? '' },
  };
}

export function toHomeSections(raw: RawHomepage): HomeSection[] {
  const sections = raw.sections ?? [];
  return sections.map((s, index): HomeSection => {
    switch (s.__component) {
      case 'sections.about':
        return {
          kind: 'about',
          id: slugify(s.title ?? `about-${index}`),
          title: s.title ?? '',
          body: s.body ?? '',
        };
      case 'sections.timeline':
        return {
          kind: 'timeline',
          id: slugify(s.title),
          title: s.title,
          items: s.items ?? [],
        };
      case 'sections.skills':
        return {
          kind: 'skills',
          id: 'skills',
          title: s.title ?? 'Skills',
          groups: s.groups ?? [],
        };
      case 'sections.icon-list':
        return {
          kind: 'iconList',
          id: slugify(s.title),
          title: s.title,
          items: s.items ?? [],
        };
      case 'sections.projects':
        return {
          kind: 'projects',
          id: 'projecten',
          title: s.title ?? 'Projecten',
          showHidden: s.showHidden ?? false,
        };
      case 'sections.attributes':
        return {
          kind: 'attributes',
          id: 'attributes',
          skills: { title: s.skillsTitle ?? 'Skills', groups: s.groups ?? [] },
          qualities: { title: s.qualitiesTitle ?? 'Kwaliteiten', items: s.qualities ?? [] },
          interests: { title: s.interestsTitle ?? 'Interesses', items: s.interests ?? [] },
        };
    }
  });
}
