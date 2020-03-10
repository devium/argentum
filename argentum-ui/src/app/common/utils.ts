export function getPaginated(data: any[], pageSize: number, page: number): any[] {
  return data.slice(pageSize * (page - 1), pageSize * page);
}

export function getPaddingItemCount(count: number, pageSize: number, page: number): number {
  if (count === 0) {
    return pageSize;
  }
  if (count - pageSize * (page - 1) < pageSize) {
    return pageSize - count % pageSize;
  }
  return 0;
}

export function convertCard(card: string): string {
  if (!card) {
    return card;
  }
  card = card.substr(0, 10);
  if (card.length === 8) {
    // 8-digit type card-bar reader (3 digit facility code + 5 digit card-bar number).
    const first = card.substr(0, 3);
    const second = card.substr(3);
    // tslint:disable-next-line:no-bitwise
    const major = parseInt(first, 10) << 16;
    const minor = parseInt(second, 10);

    if (major > 0x00FF0000 || minor > 0x0000FFFF) {
      console.warn(
        `Card number exceeds supported range (major: 0x${major.toString(16)}, minor: 0x${minor.toString(16)}).`
      );
    }
    return '' + (major + minor);
  } else {
    // possibly 10-digit type card reader. Discard first two bytes to reduce range to same as 8-digit readers.
    // tslint:disable-next-line:no-bitwise
    return '' + (parseInt(card, 10) & 0x00FFFFFF);
  }
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

export function formatCurrency(value: number): string {
  if (value === undefined) {
    return undefined;
  }
  if (value == null) {
    return null;
  }
  return value.toFixed(2);
}

export function formatDiscount(value: number): string {
  if (value === undefined) {
    return undefined;
  }
  if (value == null) {
    return null;
  }
  return value.toFixed(2);
}

export function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return hours + ':' + ('00' + minutes).slice(-2);
}


export function isDarkBackground(color: string): boolean {
  const r = parseInt(color.substr(1, 2), 16);
  const g = parseInt(color.substr(3, 2), 16);
  const b = parseInt(color.substr(5, 2), 16);

  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luminance < 128;
}

export function getRandomInt(max: number): number {
  return Math.floor(Math.random() * Math.floor(max));
}
