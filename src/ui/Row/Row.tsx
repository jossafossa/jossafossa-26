import type { CSSProperties, ReactNode } from 'react';
import styles from './Row.module.scss';

export type RowProps = {
  cols?: number;
  md?: number;
  lg?: number;
  stretch?: boolean;
  gap?: number;
  className?: string;
  children: ReactNode;
}

/**
 * `cols`/`md`/`lg` set how many columns fit per row at base / >=600px / >=1000px.
 * A child <Col> divides this into `100% / cols * span`.
 */
export function Row({ cols = 12, md, lg, stretch = false, gap, className, children }: RowProps) {
  const colsMd = md ?? cols;
  const colsLg = lg ?? colsMd;
  const style = {
    '--cols': cols,
    '--cols-md': colsMd,
    '--cols-lg': colsLg,
    ...(gap === undefined ? {} : { '--row-gap': `${gap}px` }),
  } as CSSProperties;

  const classes = [styles.row, stretch && styles.stretch, className].filter(Boolean).join(' ');

  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
}
