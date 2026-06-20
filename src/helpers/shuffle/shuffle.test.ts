import { describe, it, expect } from 'vitest';
import { shuffle } from '@/helpers/shuffle';

describe('shuffle', () => {
  it('does not mutate the input array', () => {
    const input = [1, 2, 3, 4];
    const snapshot = [...input];
    shuffle(input, () => 0);
    expect(input).toEqual(snapshot);
  });

  it('keeps the same elements (a permutation)', () => {
    const input = ['a', 'b', 'c', 'd', 'e'];
    const result = shuffle(input, () => 0.5);
    expect(result.toSorted()).toEqual(input.toSorted());
    expect(result).toHaveLength(input.length);
  });

  it('is deterministic for a given RNG sequence', () => {
    const seq = [0.1, 0.9, 0.3, 0.7];
    let i = 0;
    const rng = () => seq[i++ % seq.length];
    const a = shuffle([1, 2, 3, 4, 5], rng);
    i = 0;
    const b = shuffle([1, 2, 3, 4, 5], rng);
    expect(a).toEqual(b);
  });

  it('rng=0 rotates each element down by one (Fisher–Yates with j=0)', () => {
    expect(shuffle([1, 2, 3], () => 0)).toEqual([2, 3, 1]);
  });

  it('defaults to Math.random without throwing', () => {
    expect(shuffle([1, 2, 3])).toHaveLength(3);
  });
});
