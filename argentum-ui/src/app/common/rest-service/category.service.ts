import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Category, CategoryDto} from '../model/category';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) {
  }

  list(): Observable<Category[]> {
    return this.http.get<CategoryDto[]>('/categories').pipe(
      map((dtos: CategoryDto[]) => dtos.map((dto: CategoryDto) => Category.fromDto(dto)))
    );
  }

  create(category: Category): Observable<Category> {
    return this.http.post<CategoryDto>('/categories', category.toDto()).pipe(
      map((dto: CategoryDto) => Category.fromDto(dto))
    );
  }

  update(category: Category): Observable<Category> {
    return this.http.patch<CategoryDto>(`/categories/${category.id}`, category.toDto()).pipe(
      map((dto: CategoryDto) => Category.fromDto(dto))
    );
  }

  delete(category: Category): Observable<null> {
    return this.http.delete<null>(`/categories/${category.id}`);
  }
}
