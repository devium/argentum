import { IterablePipe } from './iterable.pipe';

describe('IterablePipe', () => {
  it('should create an instance', () => {
    const pipe = new IterablePipe();
    expect(pipe).toBeTruthy();
  });

  it('should convert a string to an array', () => {
    const pipe = new IterablePipe();
    expect(pipe.transform('hello', null)).toEqual([
      { key: '0', value: 'h' },
      { key: '1', value: 'e' },
      { key: '2', value: 'l' },
      { key: '3', value: 'l' },
      { key: '4', value: 'o' }
    ]);
  });

  it('should convert a map to an array', () => {
    const pipe = new IterablePipe();
    const map = {
      message: 'hello',
      amount: 3,
      bonus: 1.5
    };
    expect(pipe.transform(map, null)).toEqual([
      { key: 'message', value: 'hello' },
      { key: 'amount', value: 3 },
      { key: 'bonus', value: 1.5 }
    ]);
  });
});
