import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { OptionalLink } from './OptionalLink';

describe('OptionalLink', () => {
  it('renders an external anchor when href is set', () => {
    const { getByRole } = render(<OptionalLink href="https://example.com" className="c">kid</OptionalLink>);
    const link = getByRole('link', { name: 'kid' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link.className).toBe('c');
  });

  it('renders children in a fragment (no anchor) when href is absent', () => {
    const { queryByRole, getByText } = render(<OptionalLink>kid</OptionalLink>);
    expect(queryByRole('link')).not.toBeInTheDocument();
    expect(getByText('kid')).toBeInTheDocument();
  });
});
