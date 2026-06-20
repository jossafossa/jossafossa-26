import { describe, it, expect } from 'vitest';
import { cv } from '@/data/cv.hardcoded';

describe('cv data', () => {
  it('exposes every slice the API serves', () => {
    expect(cv.profile.name).toBe('Joost Hobma');
    expect(cv.profile.footer.label).toBe('Gemaakt met React');
    expect(cv.about).toHaveLength(2);
    expect(cv.workExperience.id).toBe('werkervaring');
    expect(cv.education.id).toBe('opleidingen');
    expect(cv.skills.groups.length).toBeGreaterThan(0);
    expect(cv.qualities.items.length).toBeGreaterThan(0);
    expect(cv.interests.items.length).toBeGreaterThan(0);
  });

  it('about blocks have slug ids and raw markdown bodies', () => {
    expect(cv.about.map((a) => a.id)).toEqual(['over-mij', 'dit-vind-ik-belangrijk']);
    for (const block of cv.about) {
      expect(block.body).not.toContain('<p>');
      expect(block.body.trim().length).toBeGreaterThan(0);
    }
    expect(cv.about[1].body).toContain('`var()`');
  });

  it('project ids are unique and every project has at least one tag', () => {
    const ids = cv.projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const project of cv.projects) {
      expect(project.tags.length).toBeGreaterThan(0);
    }
  });

  it('skill ratings are all within 1..5', () => {
    for (const group of cv.skills.groups) {
      for (const item of group.items) {
        expect(item.rating).toBeGreaterThanOrEqual(1);
        expect(item.rating).toBeLessThanOrEqual(5);
      }
    }
  });

  it('icon lists carry FA7 names (no FA4 "fa fa-" prefixes)', () => {
    const items = [...cv.qualities.items, ...cv.interests.items];
    for (const item of items) {
      expect(item.icon).not.toMatch(/^fa[\s-]/);
      expect(item.variant === 'solid' || item.variant === 'regular').toBe(true);
    }
  });
});
