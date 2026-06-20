import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';

vi.mock('@/data/cvApi', () => ({
  useGetProfileQuery: vi.fn(),
  useGetAboutQuery: vi.fn(),
  useGetWorkExperienceQuery: vi.fn(),
  useGetEducationQuery: vi.fn(),
  useGetProjectsQuery: vi.fn(),
  useGetSkillsQuery: vi.fn(),
  useGetQualitiesQuery: vi.fn(),
  useGetInterestsQuery: vi.fn(),
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
vi.mock('@/features/sections/AttributesSection', () => ({
  AttributesSection: ({ skills }: any) => <div data-testid="attributes">{skills.title}</div>,
}));

import App from './App';
import * as api from '@/data/cvApi';

const data = {
  profile: { name: 'Joost Hobma', footer: { label: 'Made with React' } },
  about: [{ id: 'over-mij' }, { id: 'dit-vind-ik-belangrijk' }],
  workExperience: { id: 'werkervaring' },
  education: { id: 'opleidingen' },
  projects: [{ id: 'a' }, { id: 'b' }],
  skills: { title: 'Skills' },
  qualities: { title: 'Qualities' },
  interests: { title: 'Interests' },
};

function mockAll(overrides: Record<string, unknown> = {}) {
  vi.mocked(api.useGetProfileQuery).mockReturnValue({ data: data.profile } as any);
  vi.mocked(api.useGetAboutQuery).mockReturnValue({ data: data.about } as any);
  vi.mocked(api.useGetWorkExperienceQuery).mockReturnValue({ data: data.workExperience } as any);
  vi.mocked(api.useGetEducationQuery).mockReturnValue({ data: data.education } as any);
  vi.mocked(api.useGetProjectsQuery).mockReturnValue({ data: data.projects } as any);
  vi.mocked(api.useGetSkillsQuery).mockReturnValue({ data: data.skills } as any);
  vi.mocked(api.useGetQualitiesQuery).mockReturnValue({ data: data.qualities } as any);
  vi.mocked(api.useGetInterestsQuery).mockReturnValue({ data: data.interests } as any);
  for (const [key, value] of Object.entries(overrides)) {
    vi.mocked((api as any)[key]).mockReturnValue(value as any);
  }
}

describe('App', () => {
  beforeEach(() => mockAll());

  it('shows a loading fallback while a required query has no data', () => {
    mockAll({ useGetProjectsQuery: { data: undefined } });
    const { getByText, queryByTestId } = render(<App />);
    expect(getByText('Laden…')).toBeInTheDocument();
    expect(queryByTestId('header')).not.toBeInTheDocument();
  });

  it('renders the header with the profile name', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('header')).toHaveTextContent('Joost Hobma');
  });

  it('renders two About sections from the about data', () => {
    const { getAllByTestId } = render(<App />);
    const abouts = getAllByTestId('about');
    expect(abouts).toHaveLength(2);
    expect(abouts[0]).toHaveTextContent('over-mij');
  });

  it('renders work and education timelines with the right groups', () => {
    const { getAllByTestId } = render(<App />);
    const timelines = getAllByTestId('timeline');
    expect(timelines.map((t) => t.textContent)).toEqual(['werkervaring', 'opleidingen']);
  });

  it('passes the projects and skills to their sections', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('projects')).toHaveTextContent('2');
    expect(getByTestId('attributes')).toHaveTextContent('Skills');
  });

  it('renders the footer label', () => {
    const { getByText } = render(<App />);
    expect(getByText('Made with React')).toBeInTheDocument();
  });

  it('composes the sections in the documented order', () => {
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
      'attributes',
    ]);
  });
});
