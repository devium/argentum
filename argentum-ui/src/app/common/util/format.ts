export function formatCurrency(value: number): string {
  if (value === undefined) {
    return undefined;
  }
  if (value == null) {
    return null;
  }
  return value.toFixed(2);
}

export function formatDate(date: Date): string {
  if (date === undefined) {
    return undefined;
  }
  if (date === null) {
    return null;
  }
  // Omit milliseconds.
  return date.toISOString().split('.')[0] + 'Z';
}
