import { describe, it, expect, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { cvApi } from '@/data/cvApi';

// Fixture values are deliberately distinct so a wrong endpoint→slice mapping
// fails. Defined via vi.hoisted so it exists before the hoisted vi.mock factory.
const fixture = vi.hoisted(() => ({
  profile: {
    name: 'Fixture Person',
    images: ['x.jpg'],
    linksLabel: 'L:',
    links: [],
    contactInfo: [],
    footer: { label: 'F' },
  },
  about: [{ id: 'a', title: 'A', body: 'b' }],
  workExperience: { id: 'we', title: 'WE', items: [] },
  education: { id: 'ed', title: 'ED', items: [] },
  projects: [{ id: 'p', title: 'P', tags: ['t'] }],
  skills: { title: 'S', groups: [] },
  qualities: { title: 'Q', items: [] },
  interests: { title: 'I', items: [] },
}));

vi.mock('@/data/cv.hardcoded', () => ({ cv: fixture }));

function makeStore() {
  return configureStore({
    reducer: { [cvApi.reducerPath]: cvApi.reducer },
    middleware: (getDefault) => getDefault().concat(cvApi.middleware),
  });
}

describe('cvApi endpoints', () => {
  it('maps each semantic endpoint to its matching slice', async () => {
    const store = makeStore();
    const { endpoints } = cvApi;

    expect((await store.dispatch(endpoints.getProfile.initiate())).data).toEqual(fixture.profile);
    expect((await store.dispatch(endpoints.getAbout.initiate())).data).toEqual(fixture.about);
    expect((await store.dispatch(endpoints.getWorkExperience.initiate())).data).toEqual(fixture.workExperience);
    expect((await store.dispatch(endpoints.getEducation.initiate())).data).toEqual(fixture.education);
    expect((await store.dispatch(endpoints.getProjects.initiate())).data).toEqual(fixture.projects);
    expect((await store.dispatch(endpoints.getSkills.initiate())).data).toEqual(fixture.skills);
    expect((await store.dispatch(endpoints.getQualities.initiate())).data).toEqual(fixture.qualities);
    expect((await store.dispatch(endpoints.getInterests.initiate())).data).toEqual(fixture.interests);
  });

  it('resolves fulfilled (queryFn wiring, not an error path)', async () => {
    const store = makeStore();
    const result = await store.dispatch(cvApi.endpoints.getProfile.initiate());
    expect(result.status).toBe('fulfilled');
    expect(result.isSuccess).toBe(true);
  });

  it('exposes the typed hooks for every endpoint', () => {
    expect(cvApi.useGetProfileQuery).toBeTypeOf('function');
    expect(cvApi.useGetAboutQuery).toBeTypeOf('function');
    expect(cvApi.useGetWorkExperienceQuery).toBeTypeOf('function');
    expect(cvApi.useGetEducationQuery).toBeTypeOf('function');
    expect(cvApi.useGetProjectsQuery).toBeTypeOf('function');
    expect(cvApi.useGetSkillsQuery).toBeTypeOf('function');
    expect(cvApi.useGetQualitiesQuery).toBeTypeOf('function');
    expect(cvApi.useGetInterestsQuery).toBeTypeOf('function');
  });
});
