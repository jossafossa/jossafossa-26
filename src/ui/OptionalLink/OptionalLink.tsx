import type { ReactNode } from 'react';

export type OptionalLinkProps = {
  href?: string;
  className?: string;
  children: ReactNode;
}

/** Renders an external <a> when `href` is set, otherwise a plain fragment. */
export function OptionalLink({ href, className, children }: OptionalLinkProps) {
  if (href) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return <>{children}</>;
}
