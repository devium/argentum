import { RangePipe } from "./range.pipe";

describe('RangePipe', () => {
  it('create an instance', () => {
    const pipe = new RangePipe();
    expect(pipe).toBeTruthy();
  });

  it('should create an array for the specified range', () => {
    const pipe = new RangePipe();
    let result: number[] = pipe.transform(3, 7);
    expect(result).toEqual([3, 4, 5, 6, 7]);
  });
});