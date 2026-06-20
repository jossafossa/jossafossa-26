import type { ReactNode } from 'react';
import styles from './Container.module.scss';

export type ContainerProps = {
  size?: 'default' | 'small';
  noPadding?: boolean;
  className?: string;
  children: ReactNode;
}

export function Container({ size = 'default', noPadding = false, className, children }: ContainerProps) {
  const classes = [
    styles.container,
    size === 'small' && styles.small,
    noPadding && styles.noPadding,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
}
