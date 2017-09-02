export function isDarkBackground(color: string): boolean {
  const r = parseInt(color.substr(1, 2), 16);
  const g = parseInt(color.substr(3, 2), 16);
  const b = parseInt(color.substr(5, 2), 16);

  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luminance < 128;
}
