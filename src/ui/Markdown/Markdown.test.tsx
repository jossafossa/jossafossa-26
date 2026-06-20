import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Markdown } from './Markdown';

describe('Markdown', () => {
  it('renders bold markdown as <strong> inside a .markdown block wrapper', () => {
    const { container, getByText } = render(<Markdown>{'I am **bold**'}</Markdown>);
    const wrapper = container.firstElementChild!;
    expect(wrapper.className).toMatch(/markdown/);
    expect(wrapper.querySelector('p')).toBeInTheDocument();
    expect(getByText('bold').tagName).toBe('STRONG');
  });

  it('renders code spans', () => {
    const { getByText } = render(<Markdown>{'use `var()`'}</Markdown>);
    expect(getByText('var()').tagName).toBe('CODE');
  });

  it('inline mode omits the block wrapper and the <p>', () => {
    const { container, getByText } = render(<Markdown inline>{'just **text**'}</Markdown>);
    expect(container.querySelector('.markdown')).not.toBeInTheDocument();
    expect(container.querySelector('p')).not.toBeInTheDocument();
    expect(getByText('text').tagName).toBe('STRONG');
  });

  it('forwards a custom className on the block wrapper', () => {
    const { container } = render(<Markdown className="bio">hi</Markdown>);
    expect(container.firstElementChild!.className).toMatch(/bio/);
  });
});
