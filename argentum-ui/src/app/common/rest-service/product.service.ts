import {Injectable} from '@angular/core';
import {Category} from '../model/category';
import {Observable} from 'rxjs';
import {Product, ProductDto} from '../model/product';
import {withDependencies} from './utils';
import {HttpClient} from '@angular/common/http';
import {CategoryService} from './category.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient, private categoryService: CategoryService) {
  }

  list(categories?: Category[]): Observable<Product[]> {
    return withDependencies(
      this.http.get<ProductDto[]>('/products'),
      [categories, this.categoryService.list]
    ).pipe(
      map(
        ([dtos, categoriesDep]: [ProductDto[], Category[], {}, {}]) =>
          dtos.map((dto: ProductDto) => Product.fromDto(dto, categoriesDep))
      )
    );
  }

  create(product: Product, categories?: Category[]): Observable<Product> {
    return withDependencies(
      this.http.post<ProductDto>('/products', product.toDto()),
      [categories, this.categoryService.list]
    ).pipe(
      map(([dto, categoriesDep]: [ProductDto, Category[], {}, {}]) => Product.fromDto(dto, categoriesDep))
    );
  }

  update(product: Product, categories?: Category[]): Observable<Product> {
    return withDependencies(
      this.http.patch<ProductDto>(`/products/${product.id}`, product.toDto()),
      [categories, this.categoryService.list]
    ).pipe(
      map(([dto, categoriesDep]: [ProductDto, Category[], {}, {}]) => Product.fromDto(dto, categoriesDep))
    );
  }
}
