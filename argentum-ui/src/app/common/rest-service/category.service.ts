import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Category} from '../model/category';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {processErrors} from './utils';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) {
  }

  list(): Observable<Category[]> {
    return this.http.get<Category.Dto[]>('/categories').pipe(
      map((dtos: Category.Dto[]) => dtos.map((dto: Category.Dto) => Category.fromDto(dto))),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  create(category: Category): Observable<Category> {
    return this.http.post<Category.Dto>('/categories', category.toDto()).pipe(
      map((dto: Category.Dto) => Category.fromDto(dto)),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  update(category: Category): Observable<Category> {
    return this.http.patch<Category.Dto>(`/categories/${category.id}`, category.toDto()).pipe(
      map((dto: Category.Dto) => Category.fromDto(dto)),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  delete(category: Category): Observable<null> {
    return this.http.delete<null>(`/categories/${category.id}`).pipe(
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }
}
