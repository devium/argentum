import {combineLatest, Observable, of} from 'rxjs';

export function withDependencies<T, TDto, D1, D2, D3>(
  dto$: Observable<TDto>,
  dep1: [D1, () => Observable<D1>],
  dep2?: [D2, () => Observable<D2>],
  dep3?: [D3, () => Observable<D3>],
): Observable<[TDto, D1, D2, D3]> {
  const dep1$ = dep1[0] === undefined ? dep1[1]() : of(dep1[0]);
  const dep2$ = dep2 === undefined ? of(undefined) : dep2[0] === undefined ? dep2[1]() : of(dep2[0]);
  const dep3$ = dep3 === undefined ? of(undefined) : dep3[0] === undefined ? dep3[1]() : of(dep3[0]);
  return combineLatest([dto$, dep1$, dep2$, dep3$]);
}
