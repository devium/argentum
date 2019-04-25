export function format_currency(value: number): string {
  if (value === undefined) {
    return undefined;
  }
  return value.toFixed(2);
}
