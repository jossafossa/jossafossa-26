import { describe, it, expect } from 'vitest';
import { getColor } from '@/helpers/getColor';

describe('getColor', () => {
  it('is deterministic for a given slug', () => {
    expect(getColor('CSS')).toBe(getColor('CSS'));
  });

  it('returns a hex color from the palette', () => {
    expect(getColor('WordPress')).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it('matches the char-code-sum-modulo formula', () => {
    // 'CSS' => 67+83+83 = 233; 233 % 41 = 28 => COLORS[28]
    expect(getColor('CSS')).toBe('#5d4037');
  });

  it('handles the empty string (sum 0 -> first color)', () => {
    expect(getColor('')).toBe('#cd380b');
  });

  it('gives different colors for different slugs', () => {
    expect(getColor('CSS')).not.toBe(getColor('PHP'));
  });
});
