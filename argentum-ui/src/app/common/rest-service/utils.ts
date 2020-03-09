import {combineLatest, Observable, of, throwError} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';

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

function traverseError(error: any): string[] {
  // Traverses an object recursively until a native type leaf is reached. The traversed path is stored in prepended [brackets].
  if (error instanceof Array) {
    return error.map((element: any, index: number) => `[${index}]${traverseError(element)}`);
  } else if (error instanceof Object) {
    return Object.keys(error).map((key: string) => `[${key}]${traverseError(error[key])}`);
  } else {
    return [`: ${error}`];
  }
}

export function processErrors(error: HttpErrorResponse) {
  console.log(error);
  let messages = [];
  if (error.error) {
    messages = traverseError(error.error);
  }
  console.log(messages.join('\n'));
  const pureMessages = messages
    .filter((message: string) => message.indexOf(']: ') !== -1)
    .map((message: string) => message.substr(message.indexOf(']: ') + 3));
  return throwError(pureMessages.join('<br>\n'));
}
