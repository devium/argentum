export function isDarkBackground(color: string): boolean {
  let r = parseInt(color.substr(1, 2), 16);
  let g = parseInt(color.substr(3, 2), 16);
  let b = parseInt(color.substr(5, 2), 16);

  let luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luminance < 128;
}
