# react-cv

A pixel-faithful, modern React build of my CV — a single-page app with a best-practices
stack and isolated unit tests at 100% coverage.

## Stack

- **Vite** + **React 19** + **React Compiler** (`babel-plugin-react-compiler`)
- **TypeScript** (strict)
- **Redux Toolkit + RTK Query** — semantic endpoints over `fakeBaseQuery`, serving static
  content behind an interface a real HTTP backend can later replace
- **SCSS Modules** for component styles + a minimal global layer (tokens, fonts, reset);
  grid/section/heading utilities are `ui/` layout components
- **oxlint** (strict, autofix-on-save in VS Code)
- **Vitest** + React Testing Library — isolated unit tests (each test mocks its
  collaborators) at 100% coverage

## Getting started

```bash
pnpm install
pnpm dev          # start the dev server
```

## Scripts

| Command              | What it does                          |
| -------------------- | ------------------------------------- |
| `pnpm dev`           | Vite dev server                       |
| `pnpm build`         | type-check + production build         |
| `pnpm preview`       | preview the production build          |
| `pnpm lint`          | oxlint                                |
| `pnpm lint:fix`      | oxlint with autofix                   |
| `pnpm typecheck`     | `tsc` type-check, no emit             |
| `pnpm test`          | run the test suite once               |
| `pnpm test:watch`    | run tests in watch mode               |
| `pnpm test:coverage` | run tests with coverage report        |

## Project layout

```
src/
  data/       RTK Query endpoints + static content
  features/   feature sections
  ui/         reusable UI primitives & layout components
  hooks/      shared hooks
  helpers/    utilities
  store/      Redux store setup
  test/       test setup & helpers
  App.tsx     app root
  main.tsx    entry point
```
