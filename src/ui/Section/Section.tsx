import type { ReactNode } from 'react';
import styles from './Section.module.scss';

export type SectionProps = {
  variant?: 'light' | 'dark';
  id?: string;
  className?: string;
  children: ReactNode;
}

export function Section({ variant = 'light', id, className, children }: SectionProps) {
  const classes = [styles.section, variant === 'dark' && styles.dark, className]
    .filter(Boolean)
    .join(' ');

  return (
    <section id={id} className={classes}>
      {children}
    </section>
  );
}
