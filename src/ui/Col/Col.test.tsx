import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Col } from './Col';

describe('Col', () => {
  it('defaults span vars to 1', () => {
    const { getByText } = render(<Col><span>c</span></Col>);
    const col = getByText('c').parentElement!;
    expect(col.style.getPropertyValue('--span')).toBe('1');
    expect(col.style.getPropertyValue('--span-md')).toBe('1');
    expect(col.style.getPropertyValue('--span-lg')).toBe('1');
  });

  it('sets responsive span vars from span/md/lg', () => {
    const { getByText } = render(<Col span={12} lg={8}><span>c</span></Col>);
    const col = getByText('c').parentElement!;
    expect(col.style.getPropertyValue('--span')).toBe('12');
    expect(col.style.getPropertyValue('--span-md')).toBe('12');
    expect(col.style.getPropertyValue('--span-lg')).toBe('8');
  });

  it('forwards a custom className', () => {
    const { getByText } = render(<Col className="x"><span>c</span></Col>);
    expect(getByText('c').parentElement!.className).toMatch(/x/);
  });
});
