import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import { Product } from '../model/product';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { ProductRange } from '../model/product-range';
import { Category } from '../model/category';
import { Guest } from '../model/guest';
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
import { toUser, UserResponse } from './response/user-response';
import { TokenResponse } from './response/token-response';
import { User } from '../model/user';
import { fromUser } from './request/user-request';
import { ConfigResponse, toConfig } from './response/config-response';
import { Config } from '../model/config';
import { fromConfig } from './request/config-request';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

@Injectable()
export class RestService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: Http) {
  }

  private static prepareHeaders(): Headers {
    return new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
  }

  private static handleError(error: any): Promise<any> {
    console.error('An API error occurred.', error);
    const body = error.json();
    if (error.status === 0) {
      return Promise.reject('No response from backend.');
    }
    return Promise.reject(
      `Error code ${error.status}:${body.error ? ' ' + body.error : ''}` +
      `${body.message ? ' (' + body.message + ')' : ''}`
    );
  }

  // /products

  private getProductsRaw(): Promise<ProductResponse[]> {
    return this.http.get(`${this.apiUrl}/products`, { headers: RestService.prepareHeaders() })
      .toPromise()
      .then(response => response.json().data as ProductResponse[])
      .catch(RestService.handleError);
  }

  mergeProducts(products: Product[]): Promise<ProductResponse[]> {
    const body = products.map(fromProduct);
    return this.http.post(`${this.apiUrl}/products`, body, { headers: RestService.prepareHeaders() })
      .toPromise()
      .then(response => response.json().data as ProductResponse[])
      .catch(RestService.handleError);
  }

  deleteProducts(products: Product[]): Promise<void> {
    const body = products.map(product => product.id);

    if (products.length === 0) {
      return Promise.resolve();
    }
    return this.http.delete(`${this.apiUrl}/products`, { body, headers: RestService.prepareHeaders() })
      .toPromise()
      .then(() => void(0))
      .catch(RestService.handleError);
  }


  // /ranges

  private getProductRangesRaw(): Promise<ProductRangeResponseMeta[]> {
    return this.http.get(`${this.apiUrl}/ranges`, { headers: RestService.prepareHeaders() })
      .toPromise()
      .then(response => response.json().data as ProductRangeResponseMeta[])
      .catch(RestService.handleError);
  }

  getProductRanges(): Promise<ProductRange[]> {
    return this.getProductRangesRaw()
      .then((ranges: ProductRangeResponseMeta[]) => Promise.resolve(ranges.map(toProductRangeMeta)));
  }

  private getProductRangeRaw(range: ProductRange): Promise<ProductRangeResponseEager> {
    return this.http.get(`${this.apiUrl}/ranges/${range.id}`, { headers: RestService.prepareHeaders() })
      .toPromise()
      .then(response => response.json().data as ProductRangeResponseEager)
      .catch(RestService.handleError);
  }

  getProductRange(range: ProductRange): Promise<ProductRange> {
    const pCategories = this.getCategoriesRaw();
    const pRanges = this.getProductRangeRaw(range);

    return Promise.all([pCategories, pRanges])
      .then((values: any[]) => {
        const categoriesResponse: CategoryResponse[] = values[0];
        const rangeResponse: ProductRangeResponseEager = values[1];

        const categories = categoriesResponse.map(toCategory);

        return Promise.resolve(toProductRangeEager(rangeResponse, categories));
      });
  }

  mergeProductRanges(productRanges: ProductRange[]): Promise<ProductRangeResponseMeta[]> {
    const body = productRanges.map(fromProductRange);

    return this.http.post(`${this.apiUrl}/ranges`, body, { headers: RestService.prepareHeaders() })
      .toPromise()
      .then(response => response.json().data as ProductRangeResponseMeta[])
      .catch(RestService.handleError);
  }

  deleteProductRanges(productRanges: ProductRange[]): Promise<void> {
    const body = productRanges.map(range => range.id);

    if (productRanges.length === 0) {
      return Promise.resolve();
    }
    return this.http.delete(this.apiUrl + '/ranges', { body, headers: RestService.prepareHeaders() })
      .toPromise()
      .then(() => void(0))
      .catch(RestService.handleError);
  }


  // /categories

  private getCategoriesRaw(): Promise<CategoryResponse[]> {
    return this.http.get(`${this.apiUrl}/categories`, { headers: RestService.prepareHeaders() })
      .toPromise()
      .then(response => response.json().data as CategoryResponse[])
      .catch(RestService.handleError);
  }

  getCategories(): Promise<Category[]> {
    return this.getCategoriesRaw()
      .then((categories: CategoryResponse[]) => Promise.resolve(categories.map(toCategory)));
  }

  mergeCategories(categories: Category[]): Promise<CategoryResponse[]> {
    const body = categories.map(fromCategory);

    return this.http.post(`${this.apiUrl}/categories`, body, { headers: RestService.prepareHeaders() })
      .toPromise()
      .then(response => response.json().data as CategoryResponse[])
      .catch(RestService.handleError);
  }

  deleteCategories(categories: Category[]): Promise<void> {
    const body = categories.map(category => category.id);

    if (categories.length === 0) {
      return Promise.resolve();
    }
    return this.http.delete(`${this.apiUrl}/categories`, { body, headers: RestService.prepareHeaders() })
      .toPromise()
      .then(() => void(0))
      .catch(RestService.handleError);
  }


  getProductData(): Promise<{ products: Product[], categories: Category[], ranges: ProductRange[] }> {
    const pProducts = this.getProductsRaw();
    const pRanges = this.getProductRangesRaw();
    const pCategories = this.getCategoriesRaw();

    return Promise.all([pProducts, pRanges, pCategories])
      .then((values: any[]) => {
        const productsResponse: ProductResponse[] = values[0];
        const rangesResponse: ProductRangeResponseMeta[] = values[1];
        const categoriesResponse: CategoryResponse[] = values[2];

        const categories = categoriesResponse.map(response => toCategory(response));
        const ranges = rangesResponse.map(response => toProductRangeMeta(response));
        const products = productsResponse.map(response => toProductEager(response, categories, ranges));

        return Promise.resolve({ products, ranges, categories });
      });
  }


  // /guests

  private getGuestByCardRaw(card: string): Promise<GuestResponse> {
    return this.http.get(`${this.apiUrl}/guests/card/${card}`, { headers: RestService.prepareHeaders() })
      .toPromise()
      .then(response => response.json().data as GuestResponse)
      .catch(RestService.handleError);
  }

  getGuestByCard(card: string): Promise<Guest> {
    return this.getGuestByCardRaw(card)
      .then((guest: GuestResponse) => Promise.resolve(toGuest(guest)));
  }

  private getGuestsPaginatedAndFilteredRaw(
    pageSize: number, page: number, codeLike: string, nameLike: string, mailLike: string, statusLike: string
  ): Promise<GuestResponsePaginated> {
    return this.http.get(
      `${this.apiUrl}/guests/?` +
      `size=${pageSize}&` +
      `page=${page}&` +
      `code=${codeLike}&` +
      `name=${nameLike}&` +
      `mail=${mailLike}&` +
      `status=${statusLike}`,
      { headers: RestService.prepareHeaders() }
    )
      .toPromise()
      .then(response => response.json().data as GuestResponsePaginated)
      .catch(RestService.handleError);
  }

  getGuestsPaginatedAndFiltered(
    pageSize: number, page: number, codeLike: string, nameLike: string, mailLike: string, statusLike: string
  ): Promise<{ guests: Guest[], guestsTotal: number }> {
    return this.getGuestsPaginatedAndFilteredRaw(pageSize, page, codeLike, nameLike, mailLike, statusLike)
      .then((response: GuestResponsePaginated) => Promise.resolve({
        guests: response.guests.map(toGuest),
        guestsTotal: response.guestsTotal
      }));
  }

  private getGuestsBySearchRaw(field: string, search: string): Observable<GuestResponse[]> {
    return this.http.get(`${this.apiUrl}/guests/search/${field}/${search}`, { headers: RestService.prepareHeaders() })
      .map(response => response.json().data as GuestResponse[])
      .catch(RestService.handleError);
  }

  getGuestsBySearch(field: string, search: string): Observable<Guest[]> {
    return this.getGuestsBySearchRaw(field, search).map((guests: GuestResponse[]) => guests.map(toGuest));
  }

  mergeGuests(guests: Guest[]): Promise<GuestResponse[]> {
    const body = guests.map(fromGuest);

    return this.http.post(`${this.apiUrl}/guests`, body, { headers: RestService.prepareHeaders() })
      .toPromise()
      .then(response => response.json().data as GuestResponse[])
      .catch(RestService.handleError);
  }

  deleteGuests(): Promise<void> {
    return this.http.delete(`${this.apiUrl}/guests`, { headers: RestService.prepareHeaders() })
      .toPromise()
      .then(() => void(0))
      .catch(RestService.handleError);
  }

  addBalance(guest: Guest, value: number): Promise<number> {
    return this.http.put(`${this.apiUrl}/guests/${guest.id}/balance`, value, { headers: RestService.prepareHeaders() })
      .toPromise()
      .then(response => response.json().data as number)
      .catch(RestService.handleError);
  }

  addBonus(guest: Guest, value: number): Promise<number> {
    return this.http.put(`${this.apiUrl}/guests/${guest.id}/bonus`, value, { headers: RestService.prepareHeaders() })
      .toPromise()
      .then(response => response.json().data as number)
      .catch(RestService.handleError);
  }

  registerCard(guest: Guest, card: string): Promise<void> {
    return this.http.put(`${this.apiUrl}/guests/${guest.id}/card`, card, { headers: RestService.prepareHeaders() })
      .toPromise()
      .then(() => void(0))
      .catch(RestService.handleError);
  }

  checkIn(guest: Guest): Promise<Date> {
    return this.http.put(`${this.apiUrl}/guests/${guest.id}/checkin`, null, { headers: RestService.prepareHeaders() })
      .toPromise()
      .then(response => new Date(response.json().data as number))
      .catch(RestService.handleError);
  }

  private settleRaw(guest: Guest): Promise<GuestResponse> {
    return this.http.put(
        `${this.apiUrl}/guests/${guest.id}/settle`, guest.balance, { headers: RestService.prepareHeaders() }
      )
      .toPromise()
      .then(response => response.json().data as GuestResponse)
      .catch(RestService.handleError);
  }

  settle(guest: Guest): Promise<Guest> {
    return this.settleRaw(guest)
      .then((guestResponse: GuestResponse) => Promise.resolve(toGuest(guestResponse)));
  }


  // /orders

  placeOrder(order: Order): Promise<OrderResponse> {
    const body = fromOrder(order);

    return this.http.post(`${this.apiUrl}/orders`, body, { headers: RestService.prepareHeaders() })
      .toPromise()
      .then(response => response.json().data as OrderResponse)
      .catch(RestService.handleError);
  }


  // /statistics

  private getStatisticsRaw(): Promise<StatisticsResponse> {
    return this.http.get(this.apiUrl + '/statistics', { headers: RestService.prepareHeaders() })
      .toPromise()
      .then(response => response.json().data as StatisticsResponse)
      .catch(RestService.handleError);
  }

  getStatistics(): Promise<Statistics> {
    return this.getStatisticsRaw()
      .then((stats: StatisticsResponse) => Promise.resolve(toStatistics(stats)));
  }


  // /users
  private getUsersRaw(): Promise<UserResponse[]> {
    return this.http.get(this.apiUrl + '/users', { headers: RestService.prepareHeaders() })
      .toPromise()
      .then(response => response.json().data as UserResponse[])
      .catch(RestService.handleError);
  }

  getUsers(): Promise<User[]> {
    return this.getUsersRaw()
      .then((users: UserResponse[]) => Promise.resolve(users.map(toUser)));
  }

  mergeUsers(users: User[]): Promise<UserResponse[]> {
    const body = users.map(fromUser);

    return this.http.post(`${this.apiUrl}/users`, body, { headers: RestService.prepareHeaders() })
      .toPromise()
      .then(response => response.json().data as UserResponse[])
      .catch(RestService.handleError);
  }

  deleteUsers(users: User[]): Promise<void> {
    const body = users.map(user => user.id);

    if (users.length === 0) {
      return Promise.resolve();
    }
    return this.http.delete(`${this.apiUrl}/users`, { body, headers: RestService.prepareHeaders() })
      .toPromise()
      .then(() => void(0))
      .catch(RestService.handleError);
  }

  getUser(): Promise<UserResponse> {
    return this.http.get(this.apiUrl + '/users/me', { headers: RestService.prepareHeaders() })
      .toPromise()
      .then(response => response.json().data as UserResponse)
      .catch(RestService.handleError);
  }


  // /config
  private getConfigRaw(): Promise<ConfigResponse> {
    return this.http.get(this.apiUrl + '/config', { headers: RestService.prepareHeaders() })
      .toPromise()
      .then(response => response.json().data as ConfigResponse)
      .catch(RestService.handleError);
  }

  getConfig(): Promise<Config> {
    return this.getConfigRaw()
      .then((config: ConfigResponse) => toConfig(config));
  }

  setConfig(config: Config): Promise<ConfigResponse> {
    return this.http.put(this.apiUrl + '/config', fromConfig(config), { headers: RestService.prepareHeaders() })
      .toPromise()
      .then(response => response.json().data as ConfigResponse)
      .catch(RestService.handleError);
  }


  authenticate(username: string, password: string): Promise<TokenResponse> {
    const clientEncoded = btoa('argentum-client:secret');

    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('username', username);
    params.append('password', password);

    return this.http.post(this.apiUrl + '/oauth/token', params.toString(), {
      headers: new Headers({
        'Authorization': `Basic ${clientEncoded}`,
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      })
    })
      .toPromise()
      .then(response => {
        const token = response.json() as TokenResponse;
        localStorage.setItem('token', token.access_token);
        return token;
      })
      .catch(RestService.handleError);
  }
}
