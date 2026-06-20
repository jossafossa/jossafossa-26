import { useCallback, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent, ReactNode, RefObject } from 'react';
import styles from './useRipple.module.scss';

type RippleDesc = {
  key: number;
  x: number;
  y: number;
  factor: number; // opacity factor: 1 for the main ripple, 0.5 for the bounces
};

const DURATION = 1500;
let counter = 0;

function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

/**
 * Click ripple. Returns a ref (attach to the clickable element), an onClick to spread,
 * and a `ripples` overlay node to render inside it. The element must be
 * position:relative; the overlay clips the ripples itself. Spawns the main ripple plus
 * 4 mirrored "bounce" ripples at reduced opacity, each removed after the keyframe (~1.5s).
 */
export function useRipple<T extends HTMLElement>(): {
  ref: RefObject<T | null>;
  rippleProps: { onClick: (event: MouseEvent) => void };
  ripples: ReactNode;
} {
  const ref = useRef<T>(null);
  const [ripples, setRipples] = useState<RippleDesc[]>([]);

  const onClick = useCallback((event: MouseEvent) => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const box = el.getBoundingClientRect();
    const x = event.clientX - box.left;
    const y = event.clientY - box.top;

    const spawned: RippleDesc[] = [
      { key: counter++, x, y, factor: 1 },
      // 4 mirrored reflections off the edges
      { key: counter++, x: box.width * 2 - x, y, factor: 0.5 },
      { key: counter++, x: -x, y, factor: 0.5 },
      { key: counter++, x, y: box.height * 2 - y, factor: 0.5 },
      { key: counter++, x, y: -y, factor: 0.5 },
    ];

    setRipples((prev) => [...prev, ...spawned]);
    const keys = new Set(spawned.map((r) => r.key));
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => !keys.has(r.key)));
    }, DURATION);
  }, []);

  const node = (
    <span className={styles.rippleContainer} aria-hidden="true">
      {ripples.map((r) => (
        <span
          key={r.key}
          className={styles.ripple}
          style={
            {
              left: `${r.x}px`,
              top: `${r.y}px`,
              backgroundColor: `rgba(255, 255, 255, ${0.05 * r.factor})`,
            } as CSSProperties
          }
        />
      ))}
    </span>
  );

  return { ref, rippleProps: { onClick }, ripples: node };
}
