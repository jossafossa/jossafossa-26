import type { ReactNode } from 'react';
import styles from './FancyTable.module.scss';

export type FancyTableProps = {
  rows: Array<[label: string, value: ReactNode]>;
  variant?: 'fancy' | 'condensed';
  className?: string;
};

export function FancyTable({ rows, variant = 'fancy', className }: FancyTableProps) {
  const classes = [
    styles.table,
    variant === 'fancy' ? styles.fancy : styles.condensed,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <table className={classes}>
      <tbody>
        {rows.map(([label, value]) => (
          <tr key={label}>
            <td>{label}</td>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
