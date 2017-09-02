export function convertCard(card: string): string {
  card = card.substr(0, 10);
  if (card.length === 8) {
    // 8-digit type card-bar reader (3 digit facility code + 5 digit card-bar number).
    const first = card.substr(0, 3);
    const second = card.substr(3);
    const major = parseInt(first, 10) << 16;
    const minor = parseInt(second, 10);

    if (major > 0x00FF0000 || minor > 0x0000FFFF) {
      console.warn(`Card number exceeds supported range (major: ${major.toString(16)}, minor: ${minor.toString(16)}).`);
    }
    return '' + (major + minor);
  } else {
    // possibly 10-digit type card reader. Discard first two bytes to reduce range to same as 8-digit readers.
    return '' + (parseInt(card, 10) & 0x00FFFFFF);
  }
}
