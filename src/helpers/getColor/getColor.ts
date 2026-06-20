const COLORS = [
  '#cd380b', '#FF5722', '#FF9800', '#4CAF50', '#009688', '#00BCD4', '#03A9F4',
  '#3F51B5', '#673AB7', '#9C27B0', '#E91E63', '#F44336', '#795548', '#607D8B',
  '#2196F3', '#2E7D32', '#d46ab9', '#f9a825', '#cd380b', '#e65100', '#21ba45',
  '#388e3c', '#00796b', '#0288d1', '#303f9f', '#512da8', '#ad1457', '#c62828',
  '#5d4037', '#455a64', '#1976d2', '#8e24aa', '#f57f17', '#b85c3f', '#144e6a',
  '#4a148c', '#d84315', '#00695c', '#05BB66', '#DF8F12', '#6726C5',
];

export function getColor(slug: string): string {
  const index = slug
    .split('')
    .map((char) => char.charCodeAt(0))
    .reduce((a, b) => a + b, 0);

  return COLORS[index % COLORS.length];
}
