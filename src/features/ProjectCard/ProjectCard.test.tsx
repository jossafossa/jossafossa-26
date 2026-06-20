import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import type { Project } from '@/data/cv.types';

vi.mock('@/ui/OptionalLink', () => ({
  OptionalLink: ({ href, children }: any) => <div data-testid="optlink" data-href={href}>{children}</div>,
}));
vi.mock('@/ui/ResponsiveImage', () => ({
  ResponsiveImage: ({ src }: any) => <img data-testid="cover" src={src} alt="" />,
}));
vi.mock('@/ui/ImageLightbox', () => ({
  ImageLightbox: ({ images }: any) => <div data-testid="lightbox" data-count={images.length} />,
}));
vi.mock('@/ui/Button', () => ({ Button: ({ children }: any) => <button>{children}</button> }));
vi.mock('@/ui/Markdown', () => ({
  Markdown: ({ children, inline }: any) => <span data-testid="md" data-inline={String(!!inline)}>{children}</span>,
}));
vi.mock('@/ui/Tag', () => ({
  Tag: ({ label, accent }: any) => <span data-testid="tag" data-accent={accent}>{label}</span>,
}));
vi.mock('@/helpers/getColor', () => ({ getColor: vi.fn((tag: string) => `color-${tag}`) }));
vi.mock('@/hooks/useRipple', () => ({
  useRipple: () => ({ ref: { current: null }, rippleProps: {}, ripples: null }),
}));
vi.mock('@/hooks/useBulge', () => ({ useBulge: vi.fn() }));

import { ProjectCard } from './ProjectCard';
import { getColor } from '@/helpers/getColor';

const base: Project = {
  id: 'p',
  title: 'My Project',
  url: 'https://x.io',
  description: 'Built with `code`',
  image: 'cover.webp',
  tags: ['CSS', 'PHP'],
};

describe('ProjectCard', () => {
  it('passes the url to OptionalLink', () => {
    const { getByTestId } = render(<ProjectCard project={base} />);
    expect(getByTestId('optlink')).toHaveAttribute('data-href', 'https://x.io');
  });

  it('renders the cover only when an image is present', () => {
    const { rerender, getByTestId, queryByTestId } = render(<ProjectCard project={base} />);
    expect(getByTestId('cover')).toHaveAttribute('src', 'cover.webp');
    rerender(<ProjectCard project={{ ...base, image: undefined }} />);
    expect(queryByTestId('cover')).not.toBeInTheDocument();
  });

  it('renders the lightbox only when images are present', () => {
    const { rerender, getByTestId, queryByTestId } = render(<ProjectCard project={base} />);
    expect(queryByTestId('lightbox')).not.toBeInTheDocument();
    rerender(<ProjectCard project={{ ...base, images: ['a.webp', 'b.webp'] }} />);
    expect(getByTestId('lightbox')).toHaveAttribute('data-count', '2');
  });

  it('renders the description through Markdown inline', () => {
    const { getByTestId } = render(<ProjectCard project={base} />);
    const md = getByTestId('md');
    expect(md).toHaveAttribute('data-inline', 'true');
    expect(md).toHaveTextContent('Built with `code`');
  });

  it('omits the description when absent', () => {
    const { queryByTestId } = render(<ProjectCard project={{ ...base, description: undefined }} />);
    expect(queryByTestId('md')).not.toBeInTheDocument();
  });

  it('renders one Tag per tag, colored via getColor', () => {
    const { getAllByTestId } = render(<ProjectCard project={base} />);
    const tags = getAllByTestId('tag');
    expect(tags).toHaveLength(2);
    expect(getColor).toHaveBeenCalledWith('CSS');
    expect(getColor).toHaveBeenCalledWith('PHP');
    expect(tags[0]).toHaveAttribute('data-accent', 'color-CSS');
  });

  it('renders the title', () => {
    const { getByRole } = render(<ProjectCard project={base} />);
    expect(getByRole('heading', { name: 'My Project' })).toBeInTheDocument();
  });
});
