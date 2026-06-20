import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  Profile,
  ContentSection,
  TimelineGroup,
  Project,
  SkillsBlock,
  NamedIconList,
} from '@/data/cv.types';
import { cv } from '@/data/cv.hardcoded';

export const cvApi = createApi({
  reducerPath: 'cvApi',
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    getProfile: build.query<Profile, void>({ queryFn: () => ({ data: cv.profile }) }),
    getAbout: build.query<ContentSection[], void>({ queryFn: () => ({ data: cv.about }) }),
    getWorkExperience: build.query<TimelineGroup, void>({ queryFn: () => ({ data: cv.workExperience }) }),
    getEducation: build.query<TimelineGroup, void>({ queryFn: () => ({ data: cv.education }) }),
    getProjects: build.query<Project[], void>({ queryFn: () => ({ data: cv.projects }) }),
    getSkills: build.query<SkillsBlock, void>({ queryFn: () => ({ data: cv.skills }) }),
    getQualities: build.query<NamedIconList, void>({ queryFn: () => ({ data: cv.qualities }) }),
    getInterests: build.query<NamedIconList, void>({ queryFn: () => ({ data: cv.interests }) }),
  }),
});

export const {
  useGetProfileQuery,
  useGetAboutQuery,
  useGetWorkExperienceQuery,
  useGetEducationQuery,
  useGetProjectsQuery,
  useGetSkillsQuery,
  useGetQualitiesQuery,
  useGetInterestsQuery,
} = cvApi;
