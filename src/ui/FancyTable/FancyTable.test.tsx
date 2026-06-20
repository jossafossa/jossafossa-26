import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { FancyTable } from './FancyTable';

describe('FancyTable', () => {
  const rows: Array<[string, React.ReactNode]> = [
    ['Email', 'info@example.com'],
    ['Address', 'Groningen'],
  ];

  it('renders a row per entry with label and value cells', () => {
    const { getByText, getAllByRole } = render(<FancyTable rows={rows} />);
    expect(getByText('Email')).toBeInTheDocument();
    expect(getByText('info@example.com')).toBeInTheDocument();
    expect(getAllByRole('row')).toHaveLength(2);
  });

  it('uses the fancy variant by default', () => {
    const { container } = render(<FancyTable rows={rows} />);
    expect(container.querySelector('table')!.className).toMatch(/fancy/);
  });

  it('applies the condensed variant', () => {
    const { container } = render(<FancyTable rows={rows} variant="condensed" />);
    const cls = container.querySelector('table')!.className;
    expect(cls).toMatch(/condensed/);
    expect(cls).not.toMatch(/fancy/);
  });

  it('renders ReactNode values', () => {
    const { getByText } = render(<FancyTable rows={[['Skill', <b key="x">expert</b>]]} />);
    expect(getByText('expert').tagName).toBe('B');
  });

  it('forwards a custom className', () => {
    const { container } = render(<FancyTable rows={rows} className="x" />);
    expect(container.querySelector('table')!.className).toMatch(/x/);
  });
});
