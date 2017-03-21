import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Product } from '../model/product';
import 'rxjs/add/operator/toPromise';
import { CATEGORIES, PRODUCT_RANGES } from './mock-data';
import { ProductRange } from '../model/product-range';
import { Category } from '../model/category';
import { Guest } from '../model/guest';
import { GUESTS } from './mock-guests';
import { ALL_PRODUCTS } from './mock-products';
import { Observable } from 'rxjs';

@Injectable()
export class RestService {
  private productsUrl = 'api/products';

  constructor(private http: Http) {
  }

  getProducts(): Promise<Product[]> {
    // TODO: GET on /products, returns only non-legacy products
    return Promise.resolve(ALL_PRODUCTS);
  }

  getProductRangeEager(id: number): Promise<ProductRange> {
    // TODO: GET on /ranges/{id}, returns only non-legacy products (eagerly)
    return Promise.resolve(PRODUCT_RANGES.find(range => range.id == id));
  }

  getProductRangesMeta(): Promise<ProductRange[]> {
    // TODO: GET on /ranges, returns product range meta data (no products)
    return Promise.resolve(PRODUCT_RANGES);
  }

  getCategories(): Promise<Category[]> {
    // TODO: GET on /categories, returns all categories
    return Promise.resolve(CATEGORIES);
  }

  createProducts(products: Product[]): Promise<Product[]> {
    // TODO: POST on /products, IDs will be assigned
    return Promise.resolve([]);
  }

  deleteProducts(products: Product[]): Promise<void> {
    // TODO: DELETE on /products, array of IDs, flags products as legacy
    products.forEach(product => product.legacy = true);
    return Promise.resolve();
  }

  createCategories(categories: Category[]): Promise<Category[]> {
    // TODO: POST on /categories, IDs will be assigned
    return Promise.resolve([]);
  }

  updateCategories(categories: Category[]): Promise<void> {
    // TODO: PUT on /categories
    return Promise.resolve();
  }

  deleteCategories(categories: Category[]): Promise<void> {
    // TODO: DELETE on /categories, cascade to null on products
    return Promise.resolve();
  }

  createProductRanges(productRanges: ProductRange[]): Promise<ProductRange[]> {
    // TODO POST on /ranges
    return Promise.resolve([]);
  }

  updateProductRanges(productRanges: ProductRange[]): Promise<void> {
    // TODO: PUT on /ranges
    return Promise.resolve([]);
  }

  deleteProductRanges(productRanges: ProductRange[]): Promise<void> {
    // TODO: DELETE on /ranges, cascade to delete on product join table
    return Promise.resolve();
  }

  getGuestByCard(card: string): Promise<Guest> {
    // TODO: GET on /guests/card/{card}
    return Promise.resolve(GUESTS.find(guest => guest.card == card));
  }

  getGuestsPaginatedAndFiltered(pageSize: number, page: number, codeLike: string, nameLike: string, mailLike: string, statusLike: string): Promise<{ guests: Guest[], guestsTotal: number }> {
    // TODO: GET on /guests, paginated & filtered
    let filteredGuests = GUESTS
      .filter(guest => guest.code.toLowerCase().indexOf(codeLike.toLowerCase()) > -1)
      .filter(guest => guest.name.toLowerCase().indexOf(nameLike.toLowerCase()) > -1)
      .filter(guest => guest.mail.toLowerCase().indexOf(mailLike.toLowerCase()) > -1)
      .filter(guest => guest.status.toLowerCase().indexOf(statusLike.toLowerCase()) > -1);

    return Promise.resolve({
      guests: filteredGuests.slice(page * pageSize, page * pageSize + pageSize),
      guestsTotal: filteredGuests.length
    });
  }

  getGuestsByCode(codeLike: string): Observable<Guest[]> {
    // TODO: GET on /guests/code/{code}, partial match
    let filteredGuests = GUESTS
      .filter(guest => guest.code.toLowerCase().indexOf(codeLike.toLowerCase()) > -1);

    return Observable.of(filteredGuests.length > 5 ? [] : filteredGuests);
  }

  createGuests(guests: Guest[]): Promise<Guest[]> {
    // TODO: POST on /guests
    console.log(guests);
    return Promise.resolve([]);
  }

  addBalance(guest: Guest, value: number): Promise<number> {
    // TODO: PUT on /guests/{id}/balance
    return Promise.resolve(guest.balance + value);
  }

  addBonus(guest: Guest, value: number): Promise<number> {
    // TODO: PUT on /guests/{id}/bonus
    return Promise.resolve(guest.bonus + value);
  }

  registerCard(guest: Guest, card: string): Promise<void> {
    // TODO: PUT on /guests/{id}/card, remove card from previous guest if exists
    return Promise.resolve();
  }

  private handleError(error: any): Promise<any> {
    // TODO: error handling
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
