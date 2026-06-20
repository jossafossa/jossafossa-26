import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import type { ContentSection } from '@/data/cv.types';

vi.mock('@/ui/Section', () => ({ Section: ({ children, id }: any) => <section id={id}>{children}</section> }));
vi.mock('@/ui/Container', () => ({ Container: ({ children, size }: any) => <div data-size={size}>{children}</div> }));
vi.mock('@/ui/SectionTitle', () => ({
  SectionTitle: ({ children, underline }: any) => <h1 data-underline={underline}>{children}</h1>,
}));
vi.mock('@/ui/Markdown', () => ({
  Markdown: ({ children, inline }: any) => <div data-testid="md" data-inline={String(!!inline)}>{children}</div>,
}));

import { AboutSection } from './AboutSection';

const section: ContentSection = { id: 'about', title: 'About me', body: 'Hi **me**' };

describe('AboutSection', () => {
  it('renders the title with a left underline', () => {
    const { getByRole } = render(<AboutSection section={section} />);
    const heading = getByRole('heading', { name: 'About me' });
    expect(heading).toHaveAttribute('data-underline', 'left');
  });

  it('renders the body as block Markdown (not inline)', () => {
    const { getByTestId } = render(<AboutSection section={section} />);
    const md = getByTestId('md');
    expect(md).toHaveAttribute('data-inline', 'false');
    expect(md).toHaveTextContent('Hi **me**');
  });

  it('uses the small container and the section id', () => {
    const { container } = render(<AboutSection section={section} />);
    expect(container.querySelector('[data-size="small"]')).toBeInTheDocument();
    expect(container.querySelector('section')).toHaveAttribute('id', 'about');
  });
});
