import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Product } from "./product";
import "rxjs/add/operator/toPromise";
import { PRODUCTS } from "./mock-products";

@Injectable()
export class ProductService {
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

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
