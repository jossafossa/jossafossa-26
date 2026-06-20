import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import type { Profile } from '@/data/cv.types';

vi.mock('@/ui/Container', () => ({ Container: ({ children }: any) => <div>{children}</div> }));
vi.mock('@/ui/Row', () => ({ Row: ({ children }: any) => <div>{children}</div> }));
vi.mock('@/ui/Col', () => ({ Col: ({ children }: any) => <div>{children}</div> }));
vi.mock('@/ui/Button', () => ({
  Button: ({ href, children }: any) => (
    <a data-testid="button" href={href}>
      {children}
    </a>
  ),
}));
vi.mock('@/ui/FancyTable', () => ({
  FancyTable: ({ rows, variant }: any) => (
    <table data-testid="fancytable" data-variant={variant}>
      <tbody>
        {rows.map(([label, value]: [string, string]) => (
          <tr key={label}>
            <td>{label}</td>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
}));
vi.mock('@/ui/BubbleImage', () => ({
  BubbleImage: ({ images, alt }: any) => (
    <div data-testid="bubble" data-images={images.join(',')} data-alt={alt} />
  ),
}));

import { Header } from './Header';

const profile: Profile = {
  name: 'Joost Hobma',
  images: ['a.jpg', 'b.jpg'],
  linksLabel: 'Portfolio:',
  links: [
    { url: 'https://one.nl', label: 'one' },
    { url: 'https://two.nl', label: 'two' },
  ],
  contactInfo: [
    { label: 'Email', value: 'a@b.nl' },
    { label: 'Address', value: 'Groningen' },
  ],
  footer: { label: 'Built with React' },
};

describe('Header', () => {
  it('renders the name as a heading', () => {
    const { getByRole } = render(<Header profile={profile} />);
    expect(getByRole('heading', { name: 'Joost Hobma' })).toBeInTheDocument();
  });

  it('passes the profile images to BubbleImage', () => {
    const { getByTestId } = render(<Header profile={profile} />);
    const bubble = getByTestId('bubble');
    expect(bubble).toHaveAttribute('data-images', 'a.jpg,b.jpg');
    expect(bubble).toHaveAttribute('data-alt', 'Joost Hobma');
  });

  it('renders the links label and a Button per link', () => {
    const { getByText, getAllByTestId } = render(<Header profile={profile} />);
    expect(getByText('Portfolio:')).toBeInTheDocument();
    const buttons = getAllByTestId('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveAttribute('href', 'https://one.nl');
    expect(buttons[1]).toHaveAttribute('href', 'https://two.nl');
  });

  it('renders a condensed FancyTable of contact info', () => {
    const { getByTestId, getByText } = render(<Header profile={profile} />);
    const table = getByTestId('fancytable');
    expect(table).toHaveAttribute('data-variant', 'condensed');
    expect(getByText('Email')).toBeInTheDocument();
    expect(getByText('a@b.nl')).toBeInTheDocument();
    expect(getByText('Groningen')).toBeInTheDocument();
  });
});
