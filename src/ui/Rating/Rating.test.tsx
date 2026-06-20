import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Rating } from './Rating';

vi.mock('@/ui/Icon', () => ({
  Icon: ({ name }: { name: string }) => <i data-testid="star" data-name={name} />,
}));

describe('Rating', () => {
  it('renders one star per rating point (3)', () => {
    const { getAllByTestId } = render(<Rating value={3} />);
    expect(getAllByTestId('star')).toHaveLength(3);
  });

  it('renders five stars for a full rating', () => {
    const { getAllByTestId } = render(<Rating value={5} />);
    const stars = getAllByTestId('star');
    expect(stars).toHaveLength(5);
    expect(stars[0]).toHaveAttribute('data-name', 'star');
  });

  it('clamps the count to max', () => {
    const { getAllByTestId } = render(<Rating value={9} max={5} />);
    expect(getAllByTestId('star')).toHaveLength(5);
  });

  it('renders no stars for value 0', () => {
    const { queryAllByTestId } = render(<Rating value={0} />);
    expect(queryAllByTestId('star')).toHaveLength(0);
  });
});
