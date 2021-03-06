import {Injectable} from '@angular/core';
import {Category} from '../model/category';
import {Observable} from 'rxjs';
import {Product} from '../model/product';
import {processErrors, withDependencies} from './utils';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {CategoryService} from './category.service';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient, private categoryService: CategoryService) {
  }

  list(categories?: Category[]): Observable<Product[]> {
    return withDependencies(
      this.http.get<Product.Dto[]>('/products'),
      [categories, () => this.categoryService.list()]
    ).pipe(
      map(
        ([dtos, categoriesDep]: [Product.Dto[], Category[], {}, {}]) =>
          dtos.map((dto: Product.Dto) => Product.fromDto(dto, categoriesDep))
      ),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  create(product: Product, categories?: Category[]): Observable<Product> {
    return withDependencies(
      this.http.post<Product.Dto>('/products', product.toDto()),
      [categories, () => this.categoryService.list()]
    ).pipe(
      map(([dto, categoriesDep]: [Product.Dto, Category[], {}, {}]) => Product.fromDto(dto, categoriesDep)),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  deprecate(product: Product, categories?: Category[]): Observable<Product> {
    return withDependencies(
      this.http.patch<Product.Dto>(`/products/${product.id}`, Product.deprecateDto()),
      [categories, () => this.categoryService.list()]
    ).pipe(
      map(([dto, categoriesDep]: [Product.Dto, Category[], {}, {}]) => Product.fromDto(dto, categoriesDep)),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  update(product: Product, categories?: Category[]): Observable<Product> {
    return withDependencies(
      this.http.patch<Product.Dto>(`/products/${product.id}`, product.toDto()),
      [categories, () => this.categoryService.list()]
    ).pipe(
      map(([dto, categoriesDep]: [Product.Dto, Category[], {}, {}]) => Product.fromDto(dto, categoriesDep)),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }
}
