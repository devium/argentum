export function convertCard(card: string): string {
  card = card.substr(0, 10);
  if (card.length == 8) {
    // 8-digit type card reader (3 digit facility code + 5 digit card number).
    let first = card.substr(0, 3);
    let second = card.substr(3);
    let major = parseInt(first) << 16;
    let minor = parseInt(second);

    if (major > 0x00FF0000 || minor > 0x0000FFFF) {
      throw RangeError('Card number exceeds supported range.');
    }
    return '' + (major + minor);
  } else {
    // possibly 10-digit type card reader. Discard first two bytes to reduce range to same as 8-digit readers.
    return '' + (parseInt(card) & 0x00FFFFFF);
  }
}
