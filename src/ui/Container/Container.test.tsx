import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Container } from './Container';

describe('Container', () => {
  it('renders children', () => {
    const { getByText } = render(<Container>hello</Container>);
    expect(getByText('hello')).toBeInTheDocument();
  });

  it('applies the small modifier only when size="small"', () => {
    const { rerender, getByText } = render(<Container>x</Container>);
    expect(getByText('x').className).not.toMatch(/small/);
    rerender(<Container size="small">x</Container>);
    expect(getByText('x').className).toMatch(/small/);
  });

  it('applies the noPadding modifier when set', () => {
    const { getByText } = render(<Container noPadding>y</Container>);
    expect(getByText('y').className).toMatch(/noPadding/);
  });

  it('forwards a custom className', () => {
    const { getByText } = render(<Container className="extra">z</Container>);
    expect(getByText('z').className).toMatch(/extra/);
  });
});
