import { cloneElement, isValidElement, useCallback, useEffect, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent, ReactElement, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ResponsiveImage } from '@/ui/ResponsiveImage';
import styles from './ImageLightbox.module.scss';

export type ImageLightboxProps = {
  images: string[];
  trigger: ReactNode;
};

/**
 * Clicking `trigger` opens a portal overlay with prev/next + loop, Escape/backdrop
 * close, and focus restore.
 */
export function ImageLightbox({ images, trigger }: ImageLightboxProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  const openLightbox = useCallback((event?: ReactMouseEvent) => {
    // the trigger sits inside the card's <a href> — stop it navigating
    event?.preventDefault();
    event?.stopPropagation();
    restoreRef.current = document.activeElement as HTMLElement | null;
    setIndex(0);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + images.length) % images.length),
    [images.length],
  );
  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus();
    return () => restoreRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      else if (event.key === 'ArrowLeft') prev();
      else if (event.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close, prev, next]);

  const triggerNode = isValidElement(trigger) ? (
    cloneElement(trigger as ReactElement<{ onClick?: (event?: ReactMouseEvent) => void }>, {
      onClick: openLightbox,
    })
  ) : (
    <button type="button" onClick={openLightbox}>
      {trigger}
    </button>
  );

  return (
    <>
      {triggerNode}
      {open &&
        createPortal(
          <div className={styles.backdrop} onClick={close} role="presentation">
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label="Afbeeldingen"
              tabIndex={-1}
              className={styles.dialog}
              onClick={(event) => event.stopPropagation()}
            >
              <button type="button" className={styles.close} onClick={close} aria-label="Sluiten">
                ×
              </button>
              {images.length > 1 && (
                <button
                  type="button"
                  className={`${styles.nav} ${styles.prev}`}
                  onClick={prev}
                  aria-label="Vorige"
                >
                  ‹
                </button>
              )}
              <div className={styles.stage}>
                <ResponsiveImage src={images[index]} alt={`Afbeelding ${index + 1}`} />
              </div>
              {images.length > 1 && (
                <button
                  type="button"
                  className={`${styles.nav} ${styles.next}`}
                  onClick={next}
                  aria-label="Volgende"
                >
                  ›
                </button>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
