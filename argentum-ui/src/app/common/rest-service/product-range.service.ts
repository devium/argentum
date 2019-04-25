import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CategoryService} from './category.service';
import {ProductRange, ProductRangeDto} from '../model/product-range';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Category} from '../model/category';
import {withDependencies} from './utils';

@Injectable({
  providedIn: 'root'
})
export class ProductRangeService {

  constructor(private http: HttpClient, private categoryService: CategoryService) {
  }

  list(): Observable<ProductRange[]> {
    return this.http.get<ProductRangeDto[]>('/product_ranges').pipe(
      // Only retrieve requests come with product lists that require category resolution.
      map((dtos: ProductRangeDto[]) => dtos.map((dto: ProductRangeDto) => ProductRange.fromDto(dto, undefined)))
    );
  }

  retrieve(productRangeId: number, categories?: Category[]): Observable<ProductRange> {
    return withDependencies(
      this.http.get<ProductRangeDto>(`/product_ranges/${productRangeId}`),
      [categories, this.categoryService.list]
    ).pipe(
      map(([dto, categoriesDep]: [ProductRangeDto, Category[], {}, {}]) => ProductRange.fromDto(dto, categoriesDep))
    );
  }

  create(productRange: ProductRange): Observable<ProductRange> {
    return this.http.post<ProductRangeDto>('/product_ranges', productRange.toDto()).pipe(
      // Only retrieve requests come with product lists that require category resolution.
      map((dto: ProductRangeDto) => ProductRange.fromDto(dto, undefined))
    );
  }

  update(productRange: ProductRange): Observable<ProductRange> {
    return this.http.patch<ProductRangeDto>(`/product_ranges/${productRange.id}`, productRange.toDto()).pipe(
      // Only retrieve requests come with product lists that require category resolution.
      map((dto: ProductRangeDto) => ProductRange.fromDto(dto, undefined))
    );
  }

  delete(productRange: ProductRange): Observable<null> {
    return this.http.delete<null>(`/product_ranges/${productRange.id}`);
  }
}
