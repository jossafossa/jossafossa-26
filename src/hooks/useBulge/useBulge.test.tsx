import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useRef } from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useBulge } from './useBulge';

function Harness() {
  const ref = useRef<HTMLDivElement>(null);
  useBulge(ref, { size: 100 });
  return <div ref={ref} data-testid="box">x</div>;
}

const move = (clientX: number, clientY: number) =>
  fireEvent(window, new MouseEvent('pointermove', { clientX, clientY }));

describe('useBulge', () => {
  beforeEach(() => {
    // run rAF callbacks synchronously so we can assert without timers
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    });
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      left: 0, top: 0, width: 100, height: 100, right: 100, bottom: 100, x: 0, y: 0, toJSON: () => ({}),
    } as DOMRect);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('appends a bulge child to the element', () => {
    const { getByTestId } = render(<Harness />);
    const box = getByTestId('box');
    expect(box.querySelector('span')).toBeInTheDocument();
  });

  it('activates the bulge when the pointer is within bounds', () => {
    const { getByTestId } = render(<Harness />);
    const box = getByTestId('box');
    const bulge = box.querySelector('span')!;
    expect(bulge.className).not.toMatch(/isActive/);
    move(50, 50);
    expect(bulge.className).toMatch(/isActive/);
  });

  it('deactivates the bulge when the pointer leaves bounds', () => {
    const { getByTestId } = render(<Harness />);
    const bulge = getByTestId('box').querySelector('span')!;
    move(50, 50);
    expect(bulge.className).toMatch(/isActive/);
    move(5000, 5000);
    expect(bulge.className).not.toMatch(/isActive/);
  });

  it('removes the window listener on unmount', () => {
    const remove = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<Harness />);
    unmount();
    expect(remove).toHaveBeenCalledWith('pointermove', expect.any(Function));
  });
});
