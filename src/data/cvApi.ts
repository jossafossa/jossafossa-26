import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Profile, Project } from '@/data/cv.types';
import type { HomeSection } from '@/data/home.types';
import {
  CMS_URL,
  toProfile,
  toProjects,
  toHomeSections,
  type RawHomepage,
} from '@/data/strapi';

type StrapiResponse<T> = { data: T };

export const cvApi = createApi({
  reducerPath: 'cvApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${CMS_URL}/api` }),
  endpoints: (build) => ({
    getHomepage: build.query<HomeSection[], void>({
      query: () => 'homepage',
      transformResponse: (res: StrapiResponse<RawHomepage>) => toHomeSections(res.data),
    }),
    getProfile: build.query<Profile, void>({
      query: () => 'profile',
      transformResponse: (res: StrapiResponse<Parameters<typeof toProfile>[0]>) =>
        toProfile(res.data),
    }),
    getProjects: build.query<Project[], void>({
      query: () => 'projects?pagination[pageSize]=100&sort=order:asc',
      transformResponse: (res: StrapiResponse<Parameters<typeof toProjects>[0]>) =>
        toProjects(res.data),
    }),
  }),
});

export const { useGetHomepageQuery, useGetProfileQuery, useGetProjectsQuery } = cvApi;
