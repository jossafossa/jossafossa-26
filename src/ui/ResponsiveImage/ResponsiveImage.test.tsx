import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

vi.mock('@/helpers/getSources', () => ({
  getSources: vi.fn(() => ({
    sources: [{ type: 'image/webp', srcset: '/img/x-200x200.webp 200w' }],
    fallback: '/img/x-200x200.webp',
  })),
}));

import { ResponsiveImage } from './ResponsiveImage';
import { getSources } from '@/helpers/getSources';

describe('ResponsiveImage', () => {
  it('builds sources from the src via getSources', () => {
    render(<ResponsiveImage src="x.webp" />);
    expect(getSources).toHaveBeenCalledWith('x.webp');
  });

  it('renders a webp <source> and a lazy <img> fallback', () => {
    const { container } = render(<ResponsiveImage src="x.webp" alt="cover" />);
    const source = container.querySelector('source');
    expect(source).toHaveAttribute('type', 'image/webp');
    expect(source).toHaveAttribute('srcset', '/img/x-200x200.webp 200w');
    expect(source).toHaveAttribute('sizes', 'auto');

    const img = container.querySelector('img')!;
    expect(img).toHaveAttribute('src', '/img/x-200x200.webp');
    expect(img).toHaveAttribute('alt', 'cover');
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('decoding', 'async');
  });

  it('defaults alt to an empty string', () => {
    const { container } = render(<ResponsiveImage src="x.webp" />);
    expect(container.querySelector('img')).toHaveAttribute('alt', '');
  });

  it('forwards a custom className onto the picture', () => {
    const { container } = render(<ResponsiveImage src="x.webp" className="frame" />);
    expect(container.querySelector('picture')!.className).toMatch(/frame/);
  });
});
