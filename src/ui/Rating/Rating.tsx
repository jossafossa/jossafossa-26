import { Icon } from '@/ui/Icon';
import styles from './Rating.module.scss';

export type RatingProps = {
  value: number;
  max?: number;
};

export function Rating({ value, max = 5 }: RatingProps) {
  const count = Math.max(0, Math.min(Math.floor(value), max));
  return (
    <span className={styles.rating} aria-label={`${count} / ${max}`}>
      {Array.from({ length: count }, (_, i) => (
        <Icon key={i} name="star" />
      ))}
    </span>
  );
}
