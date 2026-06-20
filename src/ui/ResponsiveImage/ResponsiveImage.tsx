import { getSources } from '@/helpers/getSources';
import styles from './ResponsiveImage.module.scss';

export type ResponsiveImageProps = {
  src: string;
  alt?: string;
  className?: string;
};

export function ResponsiveImage({ src, alt = '', className }: ResponsiveImageProps) {
  const { sources, fallback } = getSources(src);
  const classes = [styles.picture, className].filter(Boolean).join(' ');

  return (
    <picture className={classes}>
      {sources.map((source) => (
        <source key={source.type} type={source.type} srcSet={source.srcset} sizes="auto" />
      ))}
      <img src={fallback} alt={alt} loading="lazy" decoding="async" />
    </picture>
  );
}
