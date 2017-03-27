import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Product } from '../model/product';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { ProductRange } from '../model/product-range';
import { Category } from '../model/category';
import { Guest } from '../model/guest';
import { Observable } from 'rxjs';
import { Order } from '../model/order';
import { Statistics } from '../model/statistics';
import { environment } from '../../../environments/environment';
import { ProductResponse, toProductEager } from './response/product-response';
import { fromProduct } from './request/product-request';
import { ProductRangeResponseMeta, toProductRangeMeta } from './response/product-range-response-meta';
import { ProductRangeResponseEager, toProductRangeEager } from './response/product-range-response-eager';
import { fromProductRange } from './request/product-range-request';
import { CategoryResponse, toCategory } from './response/category-response';
import { fromCategory } from './request/category-request';
import { GuestResponse, toGuest } from './response/guest-response';
import { GuestResponsePaginated } from './response/guest-response-paginated';
import { fromGuest } from './request/guest-request';
import { StatisticsResponse, toStatistics } from './response/statistics-response';
import { OrderResponse } from './response/order-response';
import { fromOrder } from './request/order-request';

@Injectable()
export class RestService {
  private readonly apiUrl = environment.apiUrl;
  private readonly headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http) {
  }

  // /products

  private getProductsRaw(): Promise<ProductResponse[]> {
    return this.http.get(`${this.apiUrl}/products`)
      .toPromise()
      .then(response => response.json().data as ProductResponse[])
      .catch(this.handleError);
  }

  mergeProducts(products: Product[]): Promise<ProductResponse[]> {
    let body = products.map(fromProduct);
    return this.http.post(`${this.apiUrl}/products`, body, { headers: this.headers })
      .toPromise()
      .then(response => response.json().data as Product[])
      .catch(this.handleError);
  }

  deleteProducts(products: Product[]): Promise<void> {
    let body = products.map(product => product.id);

    if (products.length == 0) {
      return Promise.resolve();
    }
    return this.http.delete(`${this.apiUrl}/products`, { body, headers: this.headers })
      .toPromise()
      .then(() => void(0))
      .catch(this.handleError);
  }


  // /ranges

  private getProductRangesRaw(): Promise<ProductRangeResponseMeta[]> {
    return this.http.get(`${this.apiUrl}/ranges`)
      .toPromise()
      .then(response => response.json().data as ProductRangeResponseMeta[])
      .catch(this.handleError);
  }

  getProductRanges(): Promise<ProductRange[]> {
    return this.getProductRangesRaw()
      .then((ranges: ProductRangeResponseMeta[]) => Promise.resolve(ranges.map(toProductRangeMeta)));
  }

  private getProductRangeRaw(range: ProductRange): Promise<ProductRangeResponseEager> {
    return this.http.get(`${this.apiUrl}/ranges/${range.id}`)
      .toPromise()
      .then(response => response.json().data as ProductRangeResponseEager)
      .catch(this.handleError);
  }

  getProductRange(range: ProductRange): Promise<ProductRange> {
    let pCategories = this.getCategoriesRaw();
    let pRanges = this.getProductRangeRaw(range);

    return Promise.all([pCategories, pRanges])
      .then((values: any[]) => {
        let categoriesResponse: CategoryResponse[] = values[0];
        let rangeResponse: ProductRangeResponseEager = values[1];

        let categories = categoriesResponse.map(toCategory);

        return Promise.resolve(toProductRangeEager(rangeResponse, categories));
      });
  }

  mergeProductRanges(productRanges: ProductRange[]): Promise<ProductRangeResponseMeta[]> {
    let body = productRanges.map(fromProductRange);

    return this.http.post(`${this.apiUrl}/ranges`, body, { headers: this.headers })
      .toPromise()
      .then(response => response.json().data as ProductRangeResponseMeta[])
      .catch(this.handleError);
  }

  deleteProductRanges(productRanges: ProductRange[]): Promise<void> {
    let body = productRanges.map(range => range.id);

    if (productRanges.length == 0) {
      return Promise.resolve();
    }
    return this.http.delete(this.apiUrl + '/ranges', { body, headers: this.headers })
      .toPromise()
      .then(() => void(0))
      .catch(this.handleError);
  }


  // /categories

  private getCategoriesRaw(): Promise<CategoryResponse[]> {
    return this.http.get(`${this.apiUrl}/categories`)
      .toPromise()
      .then(response => response.json().data as CategoryResponse[])
      .catch(this.handleError);
  }

  getCategories(): Promise<Category[]> {
    return this.getCategoriesRaw()
      .then((categories: CategoryResponse[]) => Promise.resolve(categories.map(toCategory)));
  }

  mergeCategories(categories: Category[]): Promise<CategoryResponse[]> {
    let body = categories.map(fromCategory);

    return this.http.post(`${this.apiUrl}/categories`, body, { headers: this.headers })
      .toPromise()
      .then(response => response.json().data as CategoryResponse[])
      .catch(this.handleError);
  }

  deleteCategories(categories: Category[]): Promise<void> {
    let body = categories.map(category => category.id);

    if (categories.length == 0) {
      return Promise.resolve();
    }
    return this.http.delete(`${this.apiUrl}/categories`, { body, headers: this.headers })
      .toPromise()
      .then(() => void(0))
      .catch(this.handleError);
  }


  getProductData(): Promise<{ products: Product[], categories: Category[], ranges: ProductRange[] }> {
    let pProducts = this.getProductsRaw();
    let pRanges = this.getProductRangesRaw();
    let pCategories = this.getCategoriesRaw();

    return Promise.all([pProducts, pRanges, pCategories])
      .then((values: any[]) => {
        let productsResponse: ProductResponse[] = values[0];
        let rangesResponse: ProductRangeResponseMeta[] = values[1];
        let categoriesResponse: CategoryResponse[] = values[2];

        let categories = categoriesResponse.map(response => toCategory(response));
        let ranges = rangesResponse.map(response => toProductRangeMeta(response));
        let products = productsResponse.map(response => toProductEager(response, categories, ranges));

        return Promise.resolve({ products, ranges, categories });
      });
  }


  // /guests

  private getGuestByCardRaw(card: string): Promise<GuestResponse> {
    return this.http.get(`${this.apiUrl}/guests/card/${card}`)
      .toPromise()
      .then(response => response.json().data as GuestResponse)
      .catch(this.handleError);
  }

  getGuestByCard(card: string): Promise<Guest> {
    return this.getGuestByCardRaw(card)
      .then((guest: GuestResponse) => Promise.resolve(toGuest(guest)))
  }

  private getGuestsPaginatedAndFilteredRaw(pageSize: number, page: number, codeLike: string, nameLike: string, mailLike: string, statusLike: string): Promise<GuestResponsePaginated> {
    return this.http.get(`${this.apiUrl}/guests/?size=${pageSize}&page=${page}&code=${codeLike}&name=${nameLike}&mail=${mailLike}&status=${statusLike}`)
      .toPromise()
      .then(response => response.json().data as GuestResponsePaginated[])
      .catch(this.handleError);
  }

  getGuestsPaginatedAndFiltered(pageSize: number, page: number, codeLike: string, nameLike: string, mailLike: string, statusLike: string): Promise<{ guests: Guest[], guestsTotal: number }> {
    return this.getGuestsPaginatedAndFilteredRaw(pageSize, page, codeLike, nameLike, mailLike, statusLike)
      .then((response: GuestResponsePaginated) => Promise.resolve({
        guests: response.guests.map(toGuest),
        guestsTotal: response.guestsTotal
      }))
  }

  private getGuestsByCodeRaw(codeLike: string): Observable<GuestResponse[]> {
    return this.http.get(`${this.apiUrl}/guests/code/${codeLike}`)
      .map(response => response.json().data as GuestResponse[])
      .catch(this.handleError);
  }

  getGuestsByCode(code: string): Observable<Guest[]> {
    return this.getGuestsByCodeRaw(code).map((guests: GuestResponse[]) => guests.map(toGuest));
  }

  mergeGuests(guests: Guest[]): Promise<GuestResponse[]> {
    let body = guests.map(fromGuest);

    return this.http.post(`${this.apiUrl}/guests`, body, { headers: this.headers })
      .toPromise()
      .then(response => response.json().data as GuestResponse[])
      .catch(this.handleError);
  }

  addBalance(guest: Guest, value: number): Promise<number> {
    return this.http.put(`${this.apiUrl}/guests/${guest.id}/balance`, value, { headers: this.headers })
      .toPromise()
      .then(response => response.json().data as number)
      .catch(this.handleError);
  }

  addBonus(guest: Guest, value: number): Promise<number> {
    return this.http.put(`${this.apiUrl}/guests/${guest.id}/bonus`, value, { headers: this.headers })
      .toPromise()
      .then(response => response.json().data as number)
      .catch(this.handleError);
  }

  registerCard(guest: Guest, card: string): Promise<void> {
    return this.http.put(`${this.apiUrl}/guests/${guest.id}/card`, card, { headers: this.headers })
      .toPromise()
      .then(() => void(0))
      .catch(this.handleError);
  }

  checkIn(guest: Guest): Promise<Date> {
    return this.http.put(`${this.apiUrl}/guests/${guest.id}/checkin`, null)
      .toPromise()
      .then(response => new Date(response.json().data as number))
      .catch(this.handleError);
  }

  private refundRaw(guest: Guest): Promise<GuestResponse> {
    return this.http.put(`${this.apiUrl}/guests/${guest.id}/refund`, guest.balance, { headers: this.headers })
      .toPromise()
      .then(response => response.json().data as GuestResponse)
      .catch(this.handleError);
  }

  refund(guest: Guest): Promise<Guest> {
    return this.refundRaw(guest).then((guest: GuestResponse) => Promise.resolve(toGuest(guest)));
  }


  // /orders

  placeOrder(order: Order): Promise<OrderResponse> {
    let body = fromOrder(order);

    return this.http.post(`${this.apiUrl}/orders`, body, { headers: this.headers })
      .toPromise()
      .then(response => response.json().data as OrderResponse[])
      .catch(this.handleError);
  }


  // /statistics

  private getStatisticsRaw(): Promise<StatisticsResponse> {
    return this.http.get(this.apiUrl + '/statistics')
      .toPromise()
      .then(response => response.json().data as StatisticsResponse)
      .catch(this.handleError);
  }

  getStatistics(): Promise<Statistics> {
    return this.getStatisticsRaw()
      .then((stats: StatisticsResponse) => Promise.resolve(toStatistics(stats)));
  }


  private handleError(error: any): Promise<any> {
    console.error('An API error occurred.', error);
    let body = error.json();
    return Promise.reject(`[${error.status}]${body.error ? ' ' + body.error : ''}${body.message ? ' (' + body.message + ')' : ''}`);
  }
}
