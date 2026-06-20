import { useEffect } from 'react';
import type { RefObject } from 'react';
import styles from './useBulge.module.scss';

export type UseBulgeOptions = {
  size?: number;
};

/**
 * Radial "bulge" glow that follows the pointer over an element. Attaches one
 * rAF-throttled window pointermove listener; when the pointer is within the element's
 * (radius-expanded) bounds it positions a .bulge child and toggles .is-active. Cleans
 * up on unmount.
 */
export function useBulge(ref: RefObject<HTMLElement | null>, { size = 1000 }: UseBulgeOptions = {}): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const bulge = document.createElement('span');
    bulge.className = styles.bulge;
    bulge.style.setProperty('--bulge-size', `${size}px`);
    el.classList.add(styles.bulgeContainer);
    el.append(bulge);

    const radius = size / 2;
    let pointer = { x: 0, y: 0 };
    let frame = 0;
    let scheduled = false;

    const update = () => {
      scheduled = false;
      const box = el.getBoundingClientRect();
      const { x, y } = pointer;
      const inside =
        x - radius < box.right &&
        x + radius > box.left &&
        y - radius < box.bottom &&
        y + radius > box.top;
      if (inside) {
        bulge.style.transform = `translate(${x - box.left}px, ${y - box.top}px)`;
        bulge.classList.add(styles.isActive);
      } else {
        bulge.classList.remove(styles.isActive);
      }
    };

    const onMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      if (!scheduled) {
        scheduled = true;
        frame = requestAnimationFrame(update);
      }
    };

    window.addEventListener('pointermove', onMove);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
      el.classList.remove(styles.bulgeContainer);
      bulge.remove();
    };
  }, [ref, size]);
}
