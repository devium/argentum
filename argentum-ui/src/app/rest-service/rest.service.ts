import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Product } from "../product";
import "rxjs/add/operator/toPromise";
import { PRODUCTS, PRODUCT_RANGES, CATEGORIES } from "./mock-products";
import { ProductRange } from "../product-range";
import { Category } from "../category";

@Injectable()
export class RestService {
  private productsUrl = 'api/products';

  constructor(private http: Http) {
  }

  getProducts(): Promise<Product[]> {
    // TODO: GET on products
    // return this.http.get(this.productsUrl)
    //   .toPromise()
    //   .then(response => response.json().data as Product[])
    //   .catch(this.handleError);
    return Promise.resolve(PRODUCTS);
  }

  getProductRangeEager(id: string): Promise<ProductRange> {
    // TODO: GET on product range
    return Promise.resolve(PRODUCT_RANGES.filter(range => range.id == id)[0]);
  }

  getProductRangesMeta(): Promise<ProductRange[]> {
    // TODO: GET on product ranges
    return Promise.resolve(PRODUCT_RANGES);
  }

  getCategories(): Promise<Category[]> {
    // TODO: GET on categories
    return Promise.resolve(CATEGORIES);
  }

  saveProducts(products: Product[]) {
    // TODO: POST on products
  }

  deleteProducts(products: Product[]) {
    // TODO: PUT on products with legacy set to true
    products.forEach(product => product.legacy = true);
  }

  saveCategories(categories: Category[]) {
    // TODO: POST on categories
  }

  deleteCategories(categories: Category[]) {
    // TODO: DELETE on categories + set category on affected products to null
  }

  private handleError(error: any): Promise<any> {
    // TODO: error handling
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
