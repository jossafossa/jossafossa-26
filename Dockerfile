# syntax=docker/dockerfile:1

# --- build the static SPA ---
FROM node:22-slim AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
# pin pnpm to the version that generated the lockfile (avoids newer pnpm's
# minimumReleaseAge default rejecting freshly-published packages)
RUN corepack enable && corepack prepare pnpm@10.15.1 --activate
RUN pnpm install --frozen-lockfile
COPY . .
# CMS base URL is baked in at build time (Vite inlines VITE_* vars)
ARG VITE_CMS_URL
ENV VITE_CMS_URL=$VITE_CMS_URL
RUN pnpm build

# --- serve with nginx ---
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
