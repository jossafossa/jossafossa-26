import { useEffect } from 'react';
import type { MouseEvent, MouseEventHandler, ReactNode } from 'react';
import { useRipple } from '@/hooks/useRipple';
import { attachStripe } from './stripe';
import styles from './Button.module.scss';

export type ButtonProps = {
  href?: string;
  onClick?: MouseEventHandler;
  children: ReactNode;
  className?: string;
};

/** Renders an <a> when `href` is set, else a <button>; hover stripe + click ripple. */
export function Button({ href, onClick, children, className }: ButtonProps) {
  const { ref, rippleProps, ripples } = useRipple<HTMLElement>();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return attachStripe(el, {
      effect: styles.effect,
      animateIn: styles.animateIn,
      animateOut: styles.animateOut,
    });
  }, [ref]);

  const handleClick = (event: MouseEvent) => {
    rippleProps.onClick(event);
    onClick?.(event);
  };

  const classes = [styles.button, className].filter(Boolean).join(' ');
  const shared = { className: classes, onClick: handleClick };

  if (href) {
    return (
      <a
        {...shared}
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
        {ripples}
      </a>
    );
  }

  return (
    <button {...shared} ref={ref as React.Ref<HTMLButtonElement>} type="button">
      {children}
      {ripples}
    </button>
  );
}
