import type { CSSProperties, ReactNode } from 'react';
import styles from './Col.module.scss';

export type ColProps = {
  span?: number;
  md?: number;
  lg?: number;
  className?: string;
  children: ReactNode;
}

/** `span`/`md`/`lg` set the span out of the parent <Row>'s cols at base / >=600px / >=1000px. */
export function Col({ span = 1, md, lg, className, children }: ColProps) {
  const spanMd = md ?? span;
  const spanLg = lg ?? spanMd;
  const style = {
    '--span': span,
    '--span-md': spanMd,
    '--span-lg': spanLg,
  } as CSSProperties;

  const classes = [styles.col, className].filter(Boolean).join(' ');

  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
}
