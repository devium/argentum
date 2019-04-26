import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Category} from '../model/category';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) {
  }

  list(): Observable<Category[]> {
    return this.http.get<Category.Dto[]>('/categories').pipe(
      map((dtos: Category.Dto[]) => dtos.map((dto: Category.Dto) => Category.fromDto(dto)))
    );
  }

  create(category: Category): Observable<Category> {
    return this.http.post<Category.Dto>('/categories', category.toDto()).pipe(
      map((dto: Category.Dto) => Category.fromDto(dto))
    );
  }

  update(category: Category): Observable<Category> {
    return this.http.patch<Category.Dto>(`/categories/${category.id}`, category.toDto()).pipe(
      map((dto: Category.Dto) => Category.fromDto(dto))
    );
  }

  delete(category: Category): Observable<null> {
    return this.http.delete<null>(`/categories/${category.id}`);
  }
}
