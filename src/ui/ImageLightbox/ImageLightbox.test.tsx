import { describe, it, expect, vi } from 'vitest';
import { render, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('@/ui/ResponsiveImage', () => ({
  ResponsiveImage: ({ src, alt }: { src: string; alt?: string }) => (
    <img data-testid="slide" src={src} alt={alt} />
  ),
}));

import { ImageLightbox } from './ImageLightbox';

const images = ['a.webp', 'b.webp', 'c.webp'];

describe('ImageLightbox', () => {
  it('is closed initially and opens on trigger click', async () => {
    const user = userEvent.setup();
    const { queryByRole, getByRole, getByTestId } = render(
      <ImageLightbox images={images} trigger={<button>open</button>} />,
    );
    expect(queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(getByRole('button', { name: 'open' }));
    expect(getByRole('dialog')).toBeInTheDocument();
    expect(getByTestId('slide')).toHaveAttribute('src', 'a.webp');
  });

  it('wraps a non-element trigger in a button', async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<ImageLightbox images={images} trigger="View" />);
    await user.click(getByRole('button', { name: 'View' }));
    expect(getByRole('dialog')).toBeInTheDocument();
  });

  it('navigates next and loops past the end', async () => {
    const user = userEvent.setup();
    const { getByRole, getByTestId } = render(
      <ImageLightbox images={images} trigger={<button>open</button>} />,
    );
    await user.click(getByRole('button', { name: 'open' }));
    const dialog = getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: 'Volgende' }));
    expect(getByTestId('slide')).toHaveAttribute('src', 'b.webp');
    await user.click(within(dialog).getByRole('button', { name: 'Volgende' }));
    await user.click(within(dialog).getByRole('button', { name: 'Volgende' }));
    expect(getByTestId('slide')).toHaveAttribute('src', 'a.webp'); // looped
  });

  it('navigates previous with wrap-around', async () => {
    const user = userEvent.setup();
    const { getByRole, getByTestId } = render(
      <ImageLightbox images={images} trigger={<button>open</button>} />,
    );
    await user.click(getByRole('button', { name: 'open' }));
    await user.click(within(getByRole('dialog')).getByRole('button', { name: 'Vorige' }));
    expect(getByTestId('slide')).toHaveAttribute('src', 'c.webp'); // wrapped
  });

  it('navigates with arrow keys', async () => {
    const user = userEvent.setup();
    const { getByRole, getByTestId } = render(
      <ImageLightbox images={images} trigger={<button>open</button>} />,
    );
    await user.click(getByRole('button', { name: 'open' }));
    await user.keyboard('{ArrowRight}');
    expect(getByTestId('slide')).toHaveAttribute('src', 'b.webp');
    await user.keyboard('{ArrowLeft}');
    expect(getByTestId('slide')).toHaveAttribute('src', 'a.webp');
    await user.keyboard('{ArrowLeft}');
    expect(getByTestId('slide')).toHaveAttribute('src', 'c.webp'); // wrapped
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    const { getByRole, queryByRole } = render(
      <ImageLightbox images={images} trigger={<button>open</button>} />,
    );
    await user.click(getByRole('button', { name: 'open' }));
    await user.keyboard('{Escape}');
    expect(queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on backdrop click but not on dialog click', async () => {
    const user = userEvent.setup();
    const { getByRole, queryByRole } = render(
      <ImageLightbox images={images} trigger={<button>open</button>} />,
    );
    await user.click(getByRole('button', { name: 'open' }));
    await user.click(getByRole('dialog'));
    expect(getByRole('dialog')).toBeInTheDocument(); // still open
    await user.click(getByRole('button', { name: 'Sluiten' }));
    expect(queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('restores focus to the trigger after closing', async () => {
    const user = userEvent.setup();
    const { getByRole } = render(
      <ImageLightbox images={images} trigger={<button>open</button>} />,
    );
    const triggerBtn = getByRole('button', { name: 'open' });
    await user.click(triggerBtn);
    await user.keyboard('{Escape}');
    expect(triggerBtn).toHaveFocus();
  });

  it('prevents default + stops propagation so a wrapping link does not navigate', () => {
    const { getByRole } = render(
      <a href="https://example.com" data-testid="wrap">
        <ImageLightbox images={images} trigger={<button>open</button>} />
      </a>,
    );
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    act(() => {
      getByRole('button', { name: 'open' }).dispatchEvent(event);
    });
    expect(event.defaultPrevented).toBe(true);
    expect(getByRole('dialog')).toBeInTheDocument();
  });

  it('hides nav buttons for a single image', async () => {
    const user = userEvent.setup();
    const { getByRole, queryByRole } = render(
      <ImageLightbox images={['only.webp']} trigger={<button>open</button>} />,
    );
    await user.click(getByRole('button', { name: 'open' }));
    expect(queryByRole('button', { name: 'Volgende' })).not.toBeInTheDocument();
    expect(queryByRole('button', { name: 'Vorige' })).not.toBeInTheDocument();
  });
});
