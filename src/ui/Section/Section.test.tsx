import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Section } from './Section';

describe('Section', () => {
  it('renders a <section> with children', () => {
    const { getByText } = render(<Section>body</Section>);
    expect(getByText('body').tagName).toBe('SECTION');
  });

  it('is light by default (no dark class)', () => {
    const { getByText } = render(<Section>a</Section>);
    expect(getByText('a').className).not.toMatch(/dark/);
  });

  it('applies the dark variant', () => {
    const { getByText } = render(<Section variant="dark">b</Section>);
    expect(getByText('b').className).toMatch(/dark/);
  });

  it('forwards id and className', () => {
    const { getByText } = render(<Section id="projects" className="extra">c</Section>);
    const el = getByText('c');
    expect(el.id).toBe('projects');
    expect(el.className).toMatch(/extra/);
  });
});
