import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import { useRipple } from './useRipple';

function Harness() {
  const { ref, rippleProps, ripples } = useRipple<HTMLButtonElement>();
  return (
    <button ref={ref} {...rippleProps} data-testid="btn">
      hit
      {ripples}
    </button>
  );
}

describe('useRipple', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      left: 0, top: 0, width: 100, height: 100, right: 100, bottom: 100, x: 0, y: 0, toJSON: () => ({}),
    } as DOMRect);
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('spawns the main ripple plus 4 bounce ripples on click', () => {
    const { getByTestId } = render(<Harness />);
    const countRipples = () => getByTestId('btn').querySelectorAll('span > span').length;
    expect(countRipples()).toBe(0);
    act(() => {
      fireEvent.click(getByTestId('btn'), { clientX: 40, clientY: 60 });
    });
    expect(countRipples()).toBe(5);
  });

  it('removes the ripples after the keyframe duration', () => {
    const { getByTestId } = render(<Harness />);
    const countRipples = () => getByTestId('btn').querySelectorAll('span > span').length;
    act(() => {
      fireEvent.click(getByTestId('btn'), { clientX: 10, clientY: 10 });
    });
    expect(countRipples()).toBe(5);
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(countRipples()).toBe(0);
  });

  it('does nothing when the user prefers reduced motion', () => {
    const spy = vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      onchange: null,
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList);

    const { getByTestId } = render(<Harness />);
    const countRipples = () => getByTestId('btn').querySelectorAll('span > span').length;
    act(() => {
      fireEvent.click(getByTestId('btn'), { clientX: 10, clientY: 10 });
    });
    expect(countRipples()).toBe(0);
    spy.mockRestore();
  });
});
