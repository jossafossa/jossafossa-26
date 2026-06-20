import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

vi.mock('@/hooks/useBulge', () => ({ useBulge: vi.fn() }));

import { Bulge } from './Bulge';
import { useBulge } from '@/hooks/useBulge';

describe('Bulge', () => {
  it('wraps children and attaches the bulge effect', () => {
    const { getByText } = render(<Bulge className="x">hi</Bulge>);
    const el = getByText('hi');
    expect(el.className).toBe('x');
    expect(useBulge).toHaveBeenCalledOnce();
  });
});
