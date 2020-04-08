import { TestBed } from '@angular/core/testing';
import {AbstractModel} from './abstract-model';

describe('AbstractModel', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should compare equal by reference', () => {
    class A extends AbstractModel {
      constructor() {
        super(1);
      }
    }
    const a1 = new A();
    const a2 = a1;
    expect(a1.equals(a2)).toBeTruthy();
  });

  it('should compare equal by native types', () => {
    class A extends AbstractModel {
      constructor(id: number, public v1: string, public v2: number) {
        super(id);
      }
    }
    const a1 = new A(1, 'test', 1);
    const a2 = new A(1, 'test', 1);
    expect(a1.equals(a2)).toBeTruthy();

    const a = new A(1, 'test', 1);
    const b = new A(2, 'test', 2);
    const c = new A(3, 'test', 1);
    expect(a.equals(b)).toBeFalsy();
    expect(a.equals(c)).toBeFalsy();
    expect(b.equals(c)).toBeFalsy();
  });

  it('should compare equal by model IDs', () => {
    class A extends AbstractModel {
      constructor(id: number, public value: number) {
        super(id);
      }
    }

    class B extends AbstractModel {
      constructor(public a: A) {
        super(1);
      }
    }

    const b1 = new B(new A(1, 2));
    const b2 = new B(new A(1, 3));
    expect(b1.equals(b2)).toBeTruthy();

    const b = new B(new A(1, 2));
    const c = new B(new A(2, 2));
    expect(b.equals(c)).toBeFalsy();
  });

  it('should compare equal by model array IDs', () => {
    class A extends AbstractModel {
      constructor(id: number, public value: number) {
        super(id);
      }
    }

    class B extends AbstractModel {
      constructor(public as: A[]) {
        super(1);
      }
    }
    const b1 = new B([new A(1, 2), new A(2, 3)]);
    const b2 = new B([new A(1, 4), new A(2, 5)]);
    expect(b1.equals(b2)).toBeTruthy();

    const b = new B([new A(1, 2), new A(2, 3)]);
    const c = new B([new A(1, 2), new A(3, 3)]);
    expect(b.equals(c)).toBeFalsy();
  });

  it('should compare equal by native arrays', () => {
    class A extends AbstractModel {
      constructor(public vs: number[]) {
        super(1);
      }
    }
    const a1 = new A([1, 2]);
    const a2 = new A([1, 2]);
    expect(a1.equals(a2)).toBeTruthy();

    const b = new A([1, 2]);
    const c = new A([2, 3]);
    expect(b.equals(c)).toBeFalsy();
  });

  it('should clone correctly', () => {
    class A extends AbstractModel {
      constructor(id: number, public value: number) {
        super(id);
      }
    }

    class B extends AbstractModel {
      constructor(public v1: Date, public v2: string, public a: A, public as: A[]) {
        super(1);
      }
      doSomething() {
      }
    }
    const b1 = new B(new Date('2019-12-31T22:30'), 'test', new A(1, 2), [new A(2, 3), new A(3, 4)]);
    const b2 = <B>b1.clone();
    expect(b1.equals(b2)).toBeTruthy();
    expect(b1.as.length).toBe(2);
    b1.as.pop();
    expect(b1.as.length).toBe(1);
    expect(b2.as.length).toBe(2);
    expect(b2.doSomething).toBeDefined();
    expect(b1.v1).not.toBe(b2.v1);
  });
});
