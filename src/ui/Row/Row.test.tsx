import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Row } from './Row';

describe('Row', () => {
  it('renders children and defaults cols vars to 12', () => {
    const { getByText } = render(<Row><span>kids</span></Row>);
    const row = getByText('kids').parentElement!;
    expect(row.style.getPropertyValue('--cols')).toBe('12');
    expect(row.style.getPropertyValue('--cols-md')).toBe('12');
    expect(row.style.getPropertyValue('--cols-lg')).toBe('12');
  });

  it('sets responsive cols vars from cols/md/lg', () => {
    const { getByText } = render(<Row cols={1} md={2} lg={3}><span>g</span></Row>);
    const row = getByText('g').parentElement!;
    expect(row.style.getPropertyValue('--cols')).toBe('1');
    expect(row.style.getPropertyValue('--cols-md')).toBe('2');
    expect(row.style.getPropertyValue('--cols-lg')).toBe('3');
  });

  it('falls back md->cols and lg->md when not given', () => {
    const { getByText } = render(<Row cols={4}><span>f</span></Row>);
    const row = getByText('f').parentElement!;
    expect(row.style.getPropertyValue('--cols-md')).toBe('4');
    expect(row.style.getPropertyValue('--cols-lg')).toBe('4');
  });

  it('applies the stretch class only when set', () => {
    const { rerender, getByText } = render(<Row><span>s</span></Row>);
    expect(getByText('s').parentElement!.className).not.toMatch(/stretch/);
    rerender(<Row stretch><span>s</span></Row>);
    expect(getByText('s').parentElement!.className).toMatch(/stretch/);
  });

  it('sets --row-gap only when gap is provided', () => {
    const { rerender, getByText } = render(<Row><span>q</span></Row>);
    expect(getByText('q').parentElement!.style.getPropertyValue('--row-gap')).toBe('');
    rerender(<Row gap={8}><span>q</span></Row>);
    expect(getByText('q').parentElement!.style.getPropertyValue('--row-gap')).toBe('8px');
  });
});
