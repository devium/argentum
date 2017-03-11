import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Product } from '../product';
import 'rxjs/add/operator/toPromise';
import { PRODUCTS, PRODUCT_RANGES, CATEGORIES } from './mock-products';
import { ProductRange } from '../product-range';
import { Category } from '../category';

@Injectable()
export class RestService {
  private productsUrl = 'api/products';

  constructor(private http: Http) {
  }

  getProducts(): Promise<Product[]> {
    // return this.http.get(this.productsUrl)
    //   .toPromise()
    //   .then(response => response.json().data as Product[])
    //   .catch(this.handleError);
    return Promise.resolve(PRODUCTS);
  }

  getProductRangeEager(id: string): Promise<ProductRange> {
    return Promise.resolve(PRODUCT_RANGES.filter(range => range.id == id)[0]);
  }

  getProductRangesMeta(): Promise<ProductRange[]> {
    return Promise.resolve(PRODUCT_RANGES);
  }

  getCategories(): Promise<Category[]> {
    return Promise.resolve(CATEGORIES);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
