import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';

vi.mock('@/data/cvApi', () => ({
  useGetHomepageQuery: vi.fn(),
  useGetProfileQuery: vi.fn(),
  useGetProjectsQuery: vi.fn(),
}));

vi.mock('@/ui/Container', () => ({ Container: ({ children }: any) => <div>{children}</div> }));
vi.mock('@/features/Header', () => ({
  Header: ({ profile }: any) => <div data-testid="header">{profile.name}</div>,
}));
vi.mock('@/features/sections/AboutSection', () => ({
  AboutSection: ({ section }: any) => <div data-testid="about">{section.id}</div>,
}));
vi.mock('@/features/sections/TimelineSection', () => ({
  TimelineSection: ({ group }: any) => <div data-testid="timeline">{group.id}</div>,
}));
vi.mock('@/features/sections/ProjectsSection', () => ({
  ProjectsSection: ({ projects }: any) => <div data-testid="projects">{projects.length}</div>,
}));
vi.mock('@/features/sections/SkillsSection', () => ({
  SkillsSection: ({ title }: any) => <div data-testid="skills">{title}</div>,
}));
vi.mock('@/features/sections/IconListSection', () => ({
  IconListSection: ({ title }: any) => <div data-testid="iconList">{title}</div>,
}));

import App from './App';
import * as api from '@/data/cvApi';
import type { HomeSection } from '@/data/home.types';

const sections: HomeSection[] = [
  { kind: 'about', id: 'over-mij', title: 'Over mij', body: '' },
  { kind: 'about', id: 'dit-vind-ik-belangrijk', title: 'Belangrijk', body: '' },
  { kind: 'timeline', id: 'werkervaring', title: 'Werkervaring', items: [] },
  { kind: 'timeline', id: 'opleidingen', title: 'Opleidingen', items: [] },
  { kind: 'projects', id: 'projecten', title: 'Projecten', showHidden: false },
  { kind: 'skills', id: 'skills', title: 'Skills', groups: [] },
  { kind: 'iconList', id: 'kwaliteiten', title: 'Kwaliteiten', items: [] },
  { kind: 'iconList', id: 'interesses', title: 'Interesses', items: [] },
];

const profile = { name: 'Joost Hobma', footer: { label: 'Made with React' } };
const projects = [{ id: 'a' }, { id: 'b' }];

function mockAll(overrides: Record<string, unknown> = {}) {
  vi.mocked(api.useGetHomepageQuery).mockReturnValue({ data: sections } as any);
  vi.mocked(api.useGetProfileQuery).mockReturnValue({ data: profile } as any);
  vi.mocked(api.useGetProjectsQuery).mockReturnValue({ data: projects } as any);
  for (const [key, value] of Object.entries(overrides)) {
    vi.mocked((api as any)[key]).mockReturnValue(value as any);
  }
}

describe('App', () => {
  beforeEach(() => mockAll());

  it('shows a loading fallback while a required query has no data', () => {
    mockAll({ useGetHomepageQuery: { data: undefined } });
    const { getByText, queryByTestId } = render(<App />);
    expect(getByText('Laden…')).toBeInTheDocument();
    expect(queryByTestId('header')).not.toBeInTheDocument();
  });

  it('renders the header with the profile name', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('header')).toHaveTextContent('Joost Hobma');
  });

  it('renders an About section per about block', () => {
    const { getAllByTestId } = render(<App />);
    const abouts = getAllByTestId('about');
    expect(abouts).toHaveLength(2);
    expect(abouts[0]).toHaveTextContent('over-mij');
  });

  it('renders timelines with the right groups', () => {
    const { getAllByTestId } = render(<App />);
    const timelines = getAllByTestId('timeline');
    expect(timelines.map((t) => t.textContent)).toEqual(['werkervaring', 'opleidingen']);
  });

  it('passes the projects to the projects section', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('projects')).toHaveTextContent('2');
  });

  it('renders the footer label', () => {
    const { getByText } = render(<App />);
    expect(getByText('Made with React')).toBeInTheDocument();
  });

  it('renders sections in the order supplied by the CMS', () => {
    const { container } = render(<App />);
    const order = [...container.querySelectorAll('[data-testid]')].map((el) =>
      el.getAttribute('data-testid'),
    );
    expect(order).toEqual([
      'header',
      'about',
      'about',
      'timeline',
      'timeline',
      'projects',
      'skills',
      'iconList',
      'iconList',
    ]);
  });
});
