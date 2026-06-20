import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import type { TimelineGroup } from '@/data/cv.types';

vi.mock('@/ui/Section', () => ({
  Section: ({ children, variant, id }: any) => <section data-variant={variant} id={id}>{children}</section>,
}));
vi.mock('@/ui/Container', () => ({
  Container: ({ children, noPadding }: any) => <div data-nopad={String(!!noPadding)}>{children}</div>,
}));
vi.mock('@/ui/SectionTitle', () => ({
  SectionTitle: ({ children, banner }: any) => <h1 data-banner={String(!!banner)}>{children}</h1>,
}));
vi.mock('@/ui/FancyTable', () => ({
  FancyTable: ({ rows }: any) => (
    <table data-testid="attrs">
      <tbody>
        {rows.map(([k, v]: [string, string]) => (
          <tr key={k}><td>{k}</td><td>{v}</td></tr>
        ))}
      </tbody>
    </table>
  ),
}));
vi.mock('@/ui/Bulge', () => ({ Bulge: ({ children }: any) => <div>{children}</div> }));

import { TimelineSection } from './TimelineSection';

const group: TimelineGroup = {
  id: 'work-experience',
  title: 'Work experience',
  items: [
    { title: 'B2DESIGN', time: 'Aug `20 - present', attributes: { Role: 'Dev', Location: 'Groningen' } },
    { title: 'Nordique', time: 'Sep `19 - Mar `20', attributes: { Role: 'FE' } },
  ],
};

describe('TimelineSection', () => {
  it('renders a dark section with a banner heading', () => {
    const { getByRole, getByText } = render(<TimelineSection group={group} />);
    expect(getByRole('heading', { name: 'Work experience' })).toHaveAttribute('data-banner', 'true');
    expect(getByText('Work experience').closest('section')).toHaveAttribute('data-variant', 'dark');
  });

  it('renders one item per entry with its title and time', () => {
    const { getByText } = render(<TimelineSection group={group} />);
    expect(getByText('B2DESIGN')).toBeInTheDocument();
    expect(getByText('Aug `20 - present')).toBeInTheDocument();
    expect(getByText('Nordique')).toBeInTheDocument();
  });

  it('renders a FancyTable of each item attributes', () => {
    const { getAllByTestId, getAllByText, getByText } = render(<TimelineSection group={group} />);
    const tables = getAllByTestId('attrs');
    expect(tables).toHaveLength(2);
    expect(getAllByText('Role')).toHaveLength(2);
    expect(getByText('Dev')).toBeInTheDocument();
    expect(getByText('Groningen')).toBeInTheDocument();
  });
});
