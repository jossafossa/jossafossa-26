import { useEffect, useRef } from 'react';
import { ResponsiveImage } from '@/ui/ResponsiveImage';
import { BubbleImageFx } from './bubbleEffect';
import styles from './BubbleImage.module.scss';

export type BubbleImageProps = {
  images: string[];
  alt?: string;
  className?: string;
};

/**
 * Header photo reveal/cycle. Renders the source images as stacked layers, then hands
 * the container to BubbleImageFx, which clones them into pointer-following `.inner`
 * reveal circles and grows the current one to fill on pointer-down.
 */
export function BubbleImage({ images, alt = '', className }: BubbleImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fx = new BubbleImageFx(el, {
      bubbleImage: styles.bubbleImage,
      inner: styles.inner,
      isActive: styles.isActive,
    });
    return () => fx.destroy();
  }, []);

  const classes = [styles.bubbleImage, className].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes}>
      {images.map((src) => (
        <ResponsiveImage key={src} src={src} alt={alt} />
      ))}
    </div>
  );
}
