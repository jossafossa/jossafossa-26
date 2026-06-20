// Imperative effect; refactor to an idiomatic React hook later.

export type StripeClasses = {
  effect: string;
  animateIn: string;
  animateOut: string;
};

/**
 * Attach the hover stripe effect to `element`. Returns a cleanup function that
 * detaches the listeners and removes any in-flight effect span.
 */
export function attachStripe(
  element: HTMLElement,
  classes: StripeClasses,
  time = 500,
): () => void {
  element.dataset.content = element.textContent ?? '';
  let active: HTMLSpanElement | undefined;
  const timers = new Set<number>();

  const after = (ms: number, fn: () => void) => {
    const id = window.setTimeout(() => {
      timers.delete(id);
      fn();
    }, ms);
    timers.add(id);
  };

  const enter = () => {
    const span = document.createElement('span');
    span.textContent = element.dataset.content ?? '';
    span.classList.add(classes.effect);
    span.style.transitionDuration = time / 1000 + 's';
    span.style.setProperty('--time', time + 'ms');
    element.append(span);
    active = span;
    after(10, () => span.classList.add(classes.animateIn));
  };

  const leave = () => {
    const span = active;
    if (!span) return;
    active = undefined;
    after(0, () => span.classList.add(classes.animateOut));
    after(time, () => span.remove());
  };

  element.addEventListener('pointerenter', enter);
  element.addEventListener('pointerleave', leave);

  return () => {
    element.removeEventListener('pointerenter', enter);
    element.removeEventListener('pointerleave', leave);
    for (const id of timers) clearTimeout(id);
    active?.remove();
    active = undefined;
  };
}
