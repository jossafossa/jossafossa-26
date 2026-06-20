import type { ReactNode } from 'react';
import styles from './SectionTitle.module.scss';

export type SectionTitleProps = {
  children: ReactNode;
  as?: 'h1' | 'h2';
  underline?: 'left' | 'right';
  banner?: boolean;
  className?: string;
};

// Defaults to h2 — the only h1 on the page is the profile name in Header.
export function SectionTitle({ children, as: Tag = 'h2', underline, banner = false, className }: SectionTitleProps) {
  const classes = [
    styles.title,
    underline === 'left' && styles.underlineLeft,
    underline === 'right' && styles.underlineRight,
    banner && styles.banner,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <Tag className={classes}>{children}</Tag>;
}
