import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Product } from "../model/product";
import "rxjs/add/operator/toPromise";
import { PRODUCTS, PRODUCT_RANGES, CATEGORIES } from "./mock-data";
import { ProductRange } from "../model/product-range";
import { Category } from "../model/category";
import { Guest } from "../model/guest";
import { GUESTS } from "./mock-guests";

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

  getProductRangeEager(id: number): Promise<ProductRange> {
    // TODO: GET on product range
    return Promise.resolve(PRODUCT_RANGES.find(range => range.id == id));
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

  saveProductRanges(productRanges: ProductRange[]) {
    // TODO: POST/PUT on product ranges
  }

  deleteProductRanges(productRanges: ProductRange[]) {
    // TODO: DELETE on product ranges + cascade
  }

  getGuestByCard(card: string): Promise<Guest> {
    // TODO: GET on cards
    return Promise.resolve(GUESTS.find(guest => guest.card == card));
  }

  getGuestsPaginated(pageSize: number, page: number) {
    // TODO: paginated GET on guests
    return Promise.resolve({
      guests: GUESTS.slice(page * pageSize, page * pageSize + pageSize),
      guestsTotal: GUESTS.length
    });
  }

  updateGuestBonus(guest: Guest) {
    // TODO: PUT on guest ID with bonus as content
  }

  private handleError(error: any): Promise<any> {
    // TODO: error handling
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
