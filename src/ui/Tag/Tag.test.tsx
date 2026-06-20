import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Tag } from './Tag';

describe('Tag', () => {
  it('renders the label', () => {
    const { getByText } = render(<Tag label="CSS" />);
    expect(getByText('CSS')).toBeInTheDocument();
  });

  it('sets the --accent custom property when accent is given', () => {
    const { getByText } = render(<Tag label="PHP" accent="#ff0000" />);
    expect(getByText('PHP').style.getPropertyValue('--accent')).toBe('#ff0000');
  });

  it('omits the --accent property when no accent is given', () => {
    const { getByText } = render(<Tag label="JS" />);
    expect(getByText('JS').style.getPropertyValue('--accent')).toBe('');
  });

  it('forwards a custom className', () => {
    const { getByText } = render(<Tag label="X" className="extra" />);
    expect(getByText('X').className).toMatch(/extra/);
  });
});
