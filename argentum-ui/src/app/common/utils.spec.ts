import {convertCard} from './utils';

const TEST_CARDS_A: string[] = [
  '0004374727',
  '0004394189',
  '0004394597',
  '0004403038',
  '0004384249',
  '0004378980',
  '0004412323',
  '0004397897',
  '0004404555',
  '0004378386',
  '0004407095',
  '0232884189',
  '0232880893',
  '0232893400',
  '0232890839',
  '0232881053',
  '0232880027',
  '0232891567',
  '0232884200',
  '0232876110',
  '0232890020',
  '0232874681',
  '0232871394',
  '0232885128',
  '0232878962',
  '0232882200',
  '0232883405',
  '0232880470',
  '0232871582',
  '0232893715'
];

const TEST_CARDS_B: string[] = [
  '06649351',
  '06703277',
  '06703685',
  '06712126',
  '06658873',
  '06653604',
  '06721411',
  '06706985',
  '06713643',
  '06653010',
  '06716183',
  '22534781',
  '22531485',
  '22543992',
  '22541431',
  '22531645',
  '22530619',
  '22542159',
  '22534792',
  '22526702',
  '22540612',
  '22525273',
  '22521986',
  '22535720',
  '22529554',
  '22532792',
  '22533997',
  '22531062',
  '22522174',
  '22544307'
];

describe('utils', () => {
  it('convertCard should convert some numbers correctly', () => {
    expect(convertCard('1234')).toBe('1234');
    expect(convertCard('' + 0x12345678)).toBe('' + 0x00345678);
    expect(convertCard('01234')).toBe('1234');
  });

  it('convertCard should print warnings on cards that are out of major range', () => {
    console.warn = jasmine.createSpy('log');
    convertCard('25600000');
    expect(console.warn).toHaveBeenCalledWith(
      'Card number exceeds supported range (major: 0x1000000, minor: 0x0).'
    );
  });

  it('convertCard should print warnings on cards that are out of minor range', () => {
    console.warn = jasmine.createSpy('log');
    convertCard('25565537');
    expect(console.warn).toHaveBeenCalledWith(
      'Card number exceeds supported range (major: 0xff0000, minor: 0x10001).'
    );
  });

  it('convertCard should result in the same string for two different card readers', () => {
    for (let i = 0; i < TEST_CARDS_A.length; ++i) {
      expect(convertCard(TEST_CARDS_A[i])).toBe(convertCard(TEST_CARDS_B[i]));
    }
  });
});
