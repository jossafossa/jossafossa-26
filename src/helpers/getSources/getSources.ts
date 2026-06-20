// Pre-generated webp variants live in /public/img as `{name}-{W}x{H}.webp`.
export type ImageSource = {
  srcset: string;
  type: string;
};

const SIZES = [200, 400, 800, 1500, 2000] as const;

export function getSources(src: string): { sources: ImageSource[]; fallback: string } {
  // Strapi (or any absolute) URLs are served as-is — no pre-generated variants.
  if (/^https?:\/\//.test(src) || src.startsWith('/uploads/')) {
    return { sources: [], fallback: src };
  }

  const name = src.replace(/\.[^./]+$/, '');
  const srcset = SIZES.map((size) => `/img/${name}-${size}x${size}.webp ${size}w`).join(', ');
  return {
    sources: [{ srcset, type: 'image/webp' }],
    fallback: `/img/${name}-200x200.webp`,
  };
}
