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
      map((categoryDtos: CategoryDto[]) => categoryDtos.map((categoryDto: CategoryDto) => Category.fromDto(categoryDto)))
    );
  }

  create(category: Category): Observable<Category> {
    return this.http.post<CategoryDto>('/categories', category.toDto()).pipe(
      map((categoryDto: CategoryDto) => Category.fromDto(categoryDto))
    );
  }

  update(category: Category): Observable<Category> {
    return this.http.patch<CategoryDto>(`/categories/${category.id}`, category.toDto()).pipe(
      map((categoryDto: CategoryDto) => Category.fromDto(categoryDto))
    );
  }

  delete(category: Category): Observable<null> {
    return this.http.delete<null>(`/categories/${category.id}`);
  }
}
