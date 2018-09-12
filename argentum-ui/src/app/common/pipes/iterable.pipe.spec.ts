import { IterablePipe } from './iterable.pipe';

xdescribe('IterablePipe', () => {
  it('create an instance', () => {
    const pipe = new IterablePipe();
    expect(pipe).toBeTruthy();
  });
});
