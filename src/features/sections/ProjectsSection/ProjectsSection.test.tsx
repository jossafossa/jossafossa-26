import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Project } from '@/data/cv.types';

vi.mock('@/ui/Section', () => ({ Section: ({ children }: any) => <section>{children}</section> }));
vi.mock('@/ui/Container', () => ({ Container: ({ children }: any) => <div>{children}</div> }));
vi.mock('@/ui/SectionTitle', () => ({ SectionTitle: ({ children }: any) => <h1>{children}</h1> }));
vi.mock('@/ui/Row', () => ({ Row: ({ children }: any) => <div data-testid="grid">{children}</div> }));
vi.mock('@/ui/Col', () => ({ Col: ({ children }: any) => <div>{children}</div> }));
vi.mock('@/helpers/getColor', () => ({ getColor: vi.fn((t: string) => `c-${t}`) }));
vi.mock('@/helpers/shuffle', () => ({ shuffle: vi.fn((a: unknown[]) => a) }));
vi.mock('@/features/ProjectCard', () => ({
  ProjectCard: ({ project }: any) => <article data-testid="card">{project.title}</article>,
}));

vi.mock('@/hooks/useBulge', () => ({ useBulge: vi.fn() }));

import { ProjectsSection } from './ProjectsSection';
import { shuffle } from '@/helpers/shuffle';

const projects: Project[] = [
  { id: 'a', title: 'A', tags: ['CSS', 'PHP'] },
  { id: 'b', title: 'B', tags: ['CSS'] },
  { id: 'c', title: 'C', tags: ['React'] },
  { id: 'h', title: 'H', tags: ['CSS'], hidden: true },
];

function setSearch(search: string) {
  vi.stubGlobal('location', { ...window.location, search });
}

describe('ProjectsSection', () => {
  beforeEach(() => setSearch(''));
  afterEach(() => vi.unstubAllGlobals());

  it('hides hidden projects without ?extended', () => {
    const { getAllByTestId, queryByText } = render(<ProjectsSection projects={projects} />);
    expect(getAllByTestId('card')).toHaveLength(3);
    expect(queryByText('H')).not.toBeInTheDocument();
  });

  it('reveals hidden projects with ?extended', () => {
    setSearch('?extended');
    const { getAllByTestId, getByText } = render(<ProjectsSection projects={projects} />);
    expect(getAllByTestId('card')).toHaveLength(4);
    expect(getByText('H')).toBeInTheDocument();
  });

  it('builds a tag→count filter list (sorted desc) plus All', () => {
    const { getByRole } = render(<ProjectsSection projects={projects} />);
    expect(getByRole('button', { name: 'All' })).toBeInTheDocument();
    // CSS appears in 2 visible projects, PHP and React in 1 each
    expect(getByRole('button', { name: 'CSS (2)' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'PHP (1)' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'React (1)' })).toBeInTheDocument();
  });

  it('narrows the cards when a tag filter is clicked', async () => {
    const user = userEvent.setup();
    const { getByRole, getAllByTestId, getByText, queryByText } = render(<ProjectsSection projects={projects} />);
    await user.click(getByRole('button', { name: 'CSS (2)' }));
    const cards = getAllByTestId('card');
    expect(cards).toHaveLength(2);
    expect(getByText('A')).toBeInTheDocument();
    expect(getByText('B')).toBeInTheDocument();
    expect(queryByText('C')).not.toBeInTheDocument();
  });

  it('returns to all projects when All is clicked', async () => {
    const user = userEvent.setup();
    const { getByRole, getAllByTestId } = render(<ProjectsSection projects={projects} />);
    await user.click(getByRole('button', { name: 'React (1)' }));
    expect(getAllByTestId('card')).toHaveLength(1);
    await user.click(getByRole('button', { name: 'All' }));
    expect(getAllByTestId('card')).toHaveLength(3);
  });

  it('shuffles once and stays stable across re-renders', () => {
    const { rerender } = render(<ProjectsSection projects={projects} />);
    rerender(<ProjectsSection projects={projects} />);
    expect(shuffle).toHaveBeenCalledTimes(1);
  });
});
