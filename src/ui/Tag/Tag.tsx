import type { CSSProperties } from 'react';
import styles from './Tag.module.scss';

export type TagProps = {
  label: string;
  accent?: string;
  className?: string;
};

export function Tag({ label, accent, className }: TagProps) {
  const classes = [styles.tag, className].filter(Boolean).join(' ');
  const style = accent === undefined ? undefined : ({ '--accent': accent } as CSSProperties);
  return (
    <span className={classes} style={style}>
      {label}
    </span>
  );
}
