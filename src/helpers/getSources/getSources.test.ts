import { describe, it, expect } from 'vitest';
import { getSources } from '@/helpers/getSources';

describe('getSources', () => {
  it('builds a webp srcset across all five sizes', () => {
    const { sources } = getSources('gea-fairplay.webp');
    expect(sources).toHaveLength(1);
    expect(sources[0].type).toBe('image/webp');
    expect(sources[0].srcset).toBe(
      '/img/gea-fairplay-200x200.webp 200w, ' +
        '/img/gea-fairplay-400x400.webp 400w, ' +
        '/img/gea-fairplay-800x800.webp 800w, ' +
        '/img/gea-fairplay-1500x1500.webp 1500w, ' +
        '/img/gea-fairplay-2000x2000.webp 2000w',
    );
  });

  it('returns the 200w image as the fallback', () => {
    expect(getSources('jossafossa.jpg').fallback).toBe('/img/jossafossa-200x200.webp');
  });

  it('strips the original extension before building paths', () => {
    expect(getSources('foo.png').fallback).toBe('/img/foo-200x200.webp');
  });
});
