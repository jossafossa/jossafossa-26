// jest-dom matchers + jsdom shims (matchMedia/IntersectionObserver/ResizeObserver)
// that jsdom does not implement.
import '@testing-library/jest-dom';

if (!globalThis.matchMedia) {
  globalThis.matchMedia = vi.fn<(q: string) => MediaQueryList>((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn<() => void>(),
    removeListener: vi.fn<() => void>(),
    addEventListener: vi.fn<() => void>(),
    removeEventListener: vi.fn<() => void>(),
    dispatchEvent: vi.fn<() => boolean>(),
  })) as typeof globalThis.matchMedia;
}

class IntersectionObserverStub implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds = [];
  observe = vi.fn<() => void>();
  unobserve = vi.fn<() => void>();
  disconnect = vi.fn<() => void>();
  takeRecords = vi.fn<() => IntersectionObserverEntry[]>(() => []);
}

class ResizeObserverStub implements ResizeObserver {
  observe = vi.fn<() => void>();
  unobserve = vi.fn<() => void>();
  disconnect = vi.fn<() => void>();
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverStub);
vi.stubGlobal('ResizeObserver', ResizeObserverStub);
