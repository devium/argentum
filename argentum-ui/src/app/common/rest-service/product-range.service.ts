import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {CategoryService} from './category.service';
import {ProductRange} from '../model/product-range';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Category} from '../model/category';
import {processErrors, withDependencies} from './utils';

@Injectable({
  providedIn: 'root'
})
export class ProductRangeService {

  constructor(private http: HttpClient, private categoryService: CategoryService) {
  }

  list(): Observable<ProductRange[]> {
    return this.http.get<ProductRange.Dto[]>('/product_ranges').pipe(
      // Only retrieve requests come with product lists that require category resolution.
      map((dtos: ProductRange.Dto[]) => dtos.map((dto: ProductRange.Dto) => ProductRange.fromDto(dto, undefined))),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  retrieve(productRangeId: number, categories?: Category[]): Observable<ProductRange> {
    return withDependencies(
      this.http.get<ProductRange.Dto>(`/product_ranges/${productRangeId}`),
      [categories, () => this.categoryService.list()]
    ).pipe(
      map(([dto, categoriesDep]: [ProductRange.Dto, Category[], {}, {}]) => ProductRange.fromDto(dto, categoriesDep)),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  create(productRange: ProductRange): Observable<ProductRange> {
    return this.http.post<ProductRange.Dto>('/product_ranges', productRange.toDto()).pipe(
      // Only retrieve requests come with product lists that require category resolution.
      map((dto: ProductRange.Dto) => ProductRange.fromDto(dto, undefined)),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  update(productRange: ProductRange): Observable<ProductRange> {
    return this.http.patch<ProductRange.Dto>(`/product_ranges/${productRange.id}`, productRange.toDto()).pipe(
      // Only retrieve requests come with product lists that require category resolution.
      map((dto: ProductRange.Dto) => ProductRange.fromDto(dto, undefined)),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  delete(productRange: ProductRange): Observable<null> {
    return this.http.delete<null>(`/product_ranges/${productRange.id}`).pipe(
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }
}
