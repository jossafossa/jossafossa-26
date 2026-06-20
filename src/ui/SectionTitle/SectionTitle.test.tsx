import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SectionTitle } from './SectionTitle';

describe('SectionTitle', () => {
  it('renders an <h1> with its children', () => {
    const { getByRole } = render(<SectionTitle>Work experience</SectionTitle>);
    const el = getByRole('heading', { level: 2, name: 'Work experience' });
    expect(el).toBeInTheDocument();
  });

  it('applies no underline class by default', () => {
    const { getByText } = render(<SectionTitle>x</SectionTitle>);
    const el = getByText('x');
    expect(el.className).not.toMatch(/underline/);
    expect(el.className).not.toMatch(/banner/);
  });

  it('applies underline left', () => {
    const { getByText } = render(<SectionTitle underline="left">l</SectionTitle>);
    expect(getByText('l').className).toMatch(/underlineLeft/);
  });

  it('applies underline right', () => {
    const { getByText } = render(<SectionTitle underline="right">r</SectionTitle>);
    expect(getByText('r').className).toMatch(/underlineRight/);
  });

  it('applies the banner variant', () => {
    const { getByText } = render(<SectionTitle banner>b</SectionTitle>);
    expect(getByText('b').className).toMatch(/banner/);
  });
});
