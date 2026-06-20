import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Icon } from './Icon';

describe('Icon', () => {
  it('renders a solid icon by name by default', () => {
    const { container } = render(<Icon name="code" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('data-icon', 'code');
    expect(svg).toHaveAttribute('data-prefix', 'fas');
  });

  it('renders the regular variant when requested', () => {
    const { container } = render(<Icon name="lightbulb" variant="regular" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('data-icon', 'lightbulb');
    expect(svg).toHaveAttribute('data-prefix', 'far');
  });

  it('forwards a custom className onto the svg', () => {
    const { container } = render(<Icon name="star" className="my-star" />);
    expect(container.querySelector('svg')).toHaveClass('my-star');
  });
});
