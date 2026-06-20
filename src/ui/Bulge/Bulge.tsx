import { useRef } from 'react';
import type { ReactNode } from 'react';
import { useBulge } from '@/hooks/useBulge';

export type BulgeProps = {
  children: ReactNode;
  className?: string;
};

export function Bulge({ children, className }: BulgeProps) {
  const ref = useRef<HTMLDivElement>(null);
  useBulge(ref);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
