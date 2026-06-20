/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import path from 'node:path';

// Skip the React Compiler babel pass under Vitest: it rewrites components in a way
// that confuses v8 coverage line-attribution (phantom "uncovered" lines), and tests
// don't need the memoization. It stays on for dev/build.
const isTest = process.env.VITEST === 'true';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    ...(isTest ? [] : [babel({ presets: [reactCompilerPreset()] })]),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@styles': path.resolve(__dirname, 'src/assets/scss'),
    },
  },
  css: {
    modules: { localsConvention: 'camelCaseOnly' },
  },
  test: {
    globals: true,
    passWithNoTests: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    restoreMocks: true,
    clearMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/main.tsx',
        'src/**/*.d.ts',
        'src/**/index.ts',
        'src/data/cv.types.ts',
        'src/test/**',
        '**/*.config.*',
        // imperative effect code pending refactor to idiomatic React; intentionally untested.
        'src/ui/Button/Button.tsx',
        'src/ui/Button/stripe.ts',
        'src/ui/BubbleImage/**',
      ],
      thresholds: { statements: 85, branches: 85, functions: 85, lines: 85 },
    },
  },
});
