import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import type { SkillsBlock, NamedIconList } from '@/data/cv.types';

vi.mock('@/ui/Section', () => ({ Section: ({ children }: any) => <section>{children}</section> }));
vi.mock('@/ui/Container', () => ({ Container: ({ children }: any) => <div>{children}</div> }));
vi.mock('@/ui/Row', () => ({ Row: ({ children }: any) => <div>{children}</div> }));
vi.mock('@/ui/Col', () => ({ Col: ({ children }: any) => <div>{children}</div> }));
vi.mock('@/ui/SectionTitle', () => ({ SectionTitle: ({ children }: any) => <h1>{children}</h1> }));
vi.mock('@/ui/Rating', () => ({ Rating: ({ value }: any) => <span data-testid="rating" data-value={value} /> }));
vi.mock('@/ui/Icon', () => ({
  Icon: ({ name, variant }: any) => <i data-testid="icon" data-name={name} data-variant={variant} />,
}));

vi.mock('@/ui/Bulge', () => ({ Bulge: ({ children, className }: any) => <div className={className}>{children}</div> }));

import { AttributesSection } from './AttributesSection';

const skills: SkillsBlock = {
  title: 'Skills',
  groups: [
    { title: 'Frontend', items: [
      { label: 'HTML5', rating: 5, suffix: 'Advanced' },
      { label: 'CSS', rating: 4, suffix: 'Good' },
    ] },
    { title: 'Backend', items: [{ label: 'PHP', rating: 5, suffix: 'Advanced' }] },
  ],
};
const qualities: NamedIconList = {
  title: 'Qualities',
  items: [{ label: 'Creative', icon: 'paintbrush', variant: 'solid' }],
};
const interests: NamedIconList = {
  title: 'Interests',
  items: [
    { label: 'Webdev', icon: 'code', variant: 'solid' },
    { label: 'NoIcon', icon: '' },
  ],
};

describe('AttributesSection', () => {
  it('renders all skill groups and their titles', () => {
    const { getByText } = render(<AttributesSection skills={skills} qualities={qualities} interests={interests} />);
    expect(getByText('Frontend')).toBeInTheDocument();
    expect(getByText('Backend')).toBeInTheDocument();
    expect(getByText('Skills')).toBeInTheDocument();
  });

  it('renders a Rating per skill item with the right value', () => {
    const { getAllByTestId, getByText, getAllByText } = render(<AttributesSection skills={skills} qualities={qualities} interests={interests} />);
    const ratings = getAllByTestId('rating');
    expect(ratings).toHaveLength(3);
    expect(ratings[0]).toHaveAttribute('data-value', '5');
    expect(getByText('HTML5')).toBeInTheDocument();
    expect(getAllByText('Advanced')).toHaveLength(2);
  });

  it('renders qualities with an Icon and label', () => {
    const { getByText } = render(<AttributesSection skills={skills} qualities={qualities} interests={interests} />);
    expect(getByText('Qualities')).toBeInTheDocument();
    expect(getByText('Creative')).toBeInTheDocument();
  });

  it('renders interests, with an icon only when present', () => {
    const { getByText, getAllByTestId } = render(<AttributesSection skills={skills} qualities={qualities} interests={interests} />);
    expect(getByText('Webdev')).toBeInTheDocument();
    expect(getByText('NoIcon')).toBeInTheDocument();
    // qualities(1 icon) + interests(1 with icon, 1 without) => 2 icons total
    expect(getAllByTestId('icon')).toHaveLength(2);
  });
});
