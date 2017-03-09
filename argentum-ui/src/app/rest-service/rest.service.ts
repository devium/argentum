import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Product } from "../product";
import "rxjs/add/operator/toPromise";
import { PRODUCTS } from "./mock-products";
import { ProductRange } from "../product-range";
import { PRODUCT_RANGES } from "./mock-product-ranges";
import { CATEGORIES } from "./mock-categories";
import { Category } from "../category";

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

  getProductRanges(): Promise<ProductRange[]> {
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
