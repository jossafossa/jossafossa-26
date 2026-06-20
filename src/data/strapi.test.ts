import { describe, it, expect } from 'vitest';
import {
  CMS_URL,
  mediaUrl,
  toProject,
  toProjects,
  toProfile,
  toHomeSections,
} from '@/data/strapi';

describe('mediaUrl', () => {
  it('prefixes site-relative paths with the CMS origin', () => {
    expect(mediaUrl({ url: '/uploads/x.webp' })).toBe(`${CMS_URL}/uploads/x.webp`);
  });

  it('leaves absolute URLs untouched', () => {
    expect(mediaUrl({ url: 'https://cdn.example.com/x.webp' })).toBe(
      'https://cdn.example.com/x.webp',
    );
  });

  it('returns undefined for missing media', () => {
    expect(mediaUrl(null)).toBeUndefined();
  });
});

describe('toProject', () => {
  it('maps slug to id and resolves media URLs', () => {
    const project = toProject({
      documentId: 'doc1',
      slug: 'gea-fairplay',
      title: 'GeA Fairplay',
      url: 'https://example.com',
      description: 'desc',
      tags: ['CSS'],
      hidden: false,
      image: { url: '/uploads/main.webp' },
      images: [{ url: '/uploads/a.webp' }, { url: '/uploads/b.webp' }],
    });
    expect(project.id).toBe('gea-fairplay');
    expect(project.image).toBe(`${CMS_URL}/uploads/main.webp`);
    expect(project.images).toEqual([`${CMS_URL}/uploads/a.webp`, `${CMS_URL}/uploads/b.webp`]);
    expect(project.tags).toEqual(['CSS']);
  });

  it('defaults optional fields', () => {
    const project = toProject({ documentId: 'd', slug: 's', title: 'T' });
    expect(project.url).toBeUndefined();
    expect(project.image).toBeUndefined();
    expect(project.tags).toEqual([]);
    expect(project.hidden).toBe(false);
  });
});

describe('toProjects', () => {
  it('sorts by the order field ascending', () => {
    const out = toProjects([
      { documentId: 'b', slug: 'b', title: 'B', order: 2 },
      { documentId: 'a', slug: 'a', title: 'A', order: 1 },
    ]);
    expect(out.map((p) => p.id)).toEqual(['a', 'b']);
  });
});

describe('toProfile', () => {
  it('nests footerLabel under footer.label and resolves images', () => {
    const profile = toProfile({
      name: 'Joost',
      linksLabel: 'Portfolio:',
      footerLabel: 'Gemaakt met React',
      links: [{ url: 'u', label: 'l' }],
      contactInfo: [{ label: 'Email', value: 'a@b.c' }],
      images: [{ url: '/uploads/me.jpg' }],
    });
    expect(profile.footer).toEqual({ label: 'Gemaakt met React' });
    expect(profile.images).toEqual([`${CMS_URL}/uploads/me.jpg`]);
    expect(profile.links).toHaveLength(1);
  });
});

describe('toHomeSections', () => {
  it('maps each dynamic-zone component to a typed section, preserving order', () => {
    const sections = toHomeSections({
      sections: [
        { __component: 'sections.about', title: 'Over mij', body: 'hi' },
        { __component: 'sections.timeline', title: 'Werkervaring', items: [] },
        { __component: 'sections.projects', title: 'Projecten', showHidden: true },
        { __component: 'sections.skills', title: 'Skills', groups: [] },
        { __component: 'sections.icon-list', title: 'Kwaliteiten', items: [] },
      ],
    });
    expect(sections.map((s) => s.kind)).toEqual([
      'about',
      'timeline',
      'projects',
      'skills',
      'iconList',
    ]);
    expect(sections[0]).toMatchObject({ kind: 'about', id: 'over-mij', body: 'hi' });
    expect(sections[2]).toMatchObject({ kind: 'projects', showHidden: true });
  });

  it('bundles an attributes block into skills + qualities + interests', () => {
    const [section] = toHomeSections({
      sections: [
        {
          __component: 'sections.attributes',
          skillsTitle: 'Skills',
          groups: [{ title: 'Frontend', items: [] }],
          qualitiesTitle: 'Kwaliteiten',
          qualities: [{ label: 'Creatief', icon: 'paintbrush', variant: 'solid' }],
          interestsTitle: 'Interesses',
          interests: [{ label: 'Pixel Art', icon: 'paintbrush', variant: 'solid' }],
        },
      ],
    });
    expect(section).toMatchObject({
      kind: 'attributes',
      skills: { title: 'Skills', groups: [{ title: 'Frontend' }] },
      qualities: { title: 'Kwaliteiten' },
      interests: { title: 'Interesses' },
    });
  });

  it('handles an empty/absent zone', () => {
    expect(toHomeSections({})).toEqual([]);
  });
});
