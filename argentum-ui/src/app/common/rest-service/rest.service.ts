import { Injectable } from '@angular/core';
import { Product } from '../model/product';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { ProductRange } from '../model/product-range';
import { Category } from '../model/category';
import { Guest } from '../model/guest';
import { Statistics } from '../model/statistics';
import { environment } from '../../../environments/environment';
import { ProductResponse, toProduct } from './response/product-response';
import { fromProduct } from './request/product-request';
import { ProductRangeResponse, toProductRange } from './response/product-range-response';
import { fromProductRange } from './request/product-range-request';
import { CategoryResponse, toCategory } from './response/category-response';
import { fromCategory } from './request/category-request';
import { GuestResponse, toGuest } from './response/guest-response';
import { GuestResponsePaginated } from './response/guest-response-paginated';
import { fromGuest } from './request/guest-request';
import { StatisticsResponse, toStatistics } from './response/statistics-response';
import { OrderResponse, toOrder } from './response/order-response';
import { fromItems } from './request/order-request';
import { toUser, UserResponse } from './response/user-response';
import { TokenResponse } from './response/token-response';
import { User } from '../model/user';
import { fromUser } from './request/user-request';
import { ConfigResponse, toConfig } from './response/config-response';
import { Config } from '../model/config';
import { fromConfig } from './request/config-request';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { fromStatus } from './request/status-request';
import { Status } from '../model/status';
import { StatusResponse, toStatus } from './response/status-response';
import { Order } from '../model/order';
import { OrderItem } from '../model/order-item';
import { cancelFromOrder, cancelFromOrderItem } from './request/cancel-order-item-request';
import { CoatCheckTagResponse, toCoatCheckTag } from './response/coat-check-tag-response';
import { fromCoatCheckTagIds } from './request/coat-check-tags-request';
import { CoatCheckTag } from '../model/coat-check-tag';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Message } from '../model/message';

@Injectable()
export class RestService {
  // Note: requests that contain an empty array are OK. Backend is supposed to handle those.
  readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  readonly authOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    })
  };

  readonly authJsonOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    })
  };

  private static handleError(error: HttpErrorResponse): Promise<any> {
    console.error('An API error occurred.', error);
    if (error.status === 400 && error.error.error === 'invalid_grant') {
      return Promise.reject('Invalid username or password.');
    }
    if (error.status === 0) {
      return Promise.reject('No response from backend. Is the API server running?');
    }
    return Promise.reject(error.message);
  }

  private static checkMessage<T>(message: Message<T>): Promise<T> {
    if (message.data === null || message.error !== null) {
      // An erroneous response object that is not flagged as an HTTP error should not happen but just to be safe, we
      // wrap it in an HttpErrorResponse to be handled by the usual error handler.
      return Promise.reject(new HttpErrorResponse({
        error: { status: 0, name: 'Unknown error', message: message.error }
      }));
    }
    return Promise.resolve(message.data);
  }

  updateToken() {
    this.authOptions.headers = this.authOptions.headers.set(
      'Authorization', `Bearer ${localStorage.getItem('token')}`
    );
    this.authJsonOptions.headers = this.authJsonOptions.headers.set(
      'Authorization', `Bearer ${localStorage.getItem('token')}`
    );
  }

  // /coat_check

  getGuestCoatCheckTags(guest: Guest): Promise<CoatCheckTag[]> {
    return this.http.get<Message<CoatCheckTagResponse[]>>(
      `${this.apiUrl}/guests/${guest.id}/coat_check_tags`,
      this.authOptions
    )
      .toPromise()
      .then(RestService.checkMessage)
      .then((tags: CoatCheckTagResponse[]) => tags.map(toCoatCheckTag))
      .catch(RestService.handleError);
  }

  getAllCoatCheckTags(): Promise<number[]> {
    return this.http.get<Message<number[]>>(
      `${this.apiUrl}/coat_check`,
      this.authOptions
    )
      .toPromise()
      .then(RestService.checkMessage)
      .catch(RestService.handleError);
  }

  deregisterTags(tagIds: number[]): Promise<void> {
    return this.http.request(
      'delete',
      `${this.apiUrl}/coat_check`,
      Object.assign({}, this.authJsonOptions, { body: tagIds })
    )
      .toPromise()
      .catch(RestService.handleError);
  }

  registerTags(tagIds: number[], guest: Guest, price: number): Promise<CoatCheckTag[]> {
    const body = fromCoatCheckTagIds(tagIds, guest, price);
    return this.http.put<Message<CoatCheckTagResponse[]>>(
      `${this.apiUrl}/coat_check`,
      body,
      this.authJsonOptions
    )
      .toPromise()
      .then(RestService.checkMessage)
      .then((response: CoatCheckTagResponse[]) => response.map(toCoatCheckTag))
      .catch(RestService.handleError);
  }

  // /products

  getProducts(): Promise<Product[]> {
    return this.http.get<Message<ProductResponse[]>>(
      `${this.apiUrl}/products`,
      this.authJsonOptions
    )
      .toPromise()
      .then(RestService.checkMessage)
      .then((products: ProductResponse[]) => products.map(toProduct))
      .catch(RestService.handleError);
  }

  getAllProducts(): Promise<Product[]> {
    // Includes legacy products.
    return this.http.get<Message<ProductResponse[]>>(
      `${this.apiUrl}/products/all`,
      this.authJsonOptions
    )
      .toPromise()
      .then(RestService.checkMessage)
      .then((products: ProductResponse[]) => products.map(
        (product: ProductResponse) => toProduct(product)
      ))
      .catch(RestService.handleError);
  }

  mergeProducts(products: Product[]): Promise<void> {
    const body = products.map(fromProduct);
    return this.http.post(
      `${this.apiUrl}/products`, body,
      this.authJsonOptions
    )
      .toPromise()
      .catch(RestService.handleError);
  }

  deleteProducts(products: Product[]): Promise<void> {
    const body = products.map(product => product.id);

    return this.http.request(
      'delete',
      `${this.apiUrl}/products`,
      Object.assign({}, this.authJsonOptions, { body: body })
    )
      .toPromise()
      .catch(RestService.handleError);
  }


  // /ranges

  getProductRanges(): Promise<ProductRangeResponse[]> {
    return this.http.get<Message<ProductRangeResponse[]>>(
      `${this.apiUrl}/ranges`,
      this.authJsonOptions
    )
      .toPromise()
      .then(RestService.checkMessage)
      .then((ranges: ProductRangeResponse[]) => ranges.map(toProductRange))
      .catch(RestService.handleError);
  }

  getRangeProducts(range: ProductRange): Promise<Product[]> {
    return this.http.get<Message<ProductResponse[]>>(
      `${this.apiUrl}/ranges/${range.id}`,
      this.authJsonOptions
    )
      .toPromise()
      .then(RestService.checkMessage)
      .then((products: ProductResponse[]) => products.map(toProduct))
      .catch(RestService.handleError);
  }

  mergeProductRanges(productRanges: ProductRange[]): Promise<void> {
    const body = productRanges.map(fromProductRange);

    return this.http.post(
      `${this.apiUrl}/ranges`,
      body,
      this.authJsonOptions
    )
      .toPromise()
      .catch(RestService.handleError);
  }

  deleteProductRanges(productRanges: ProductRange[]): Promise<void> {
    const body = productRanges.map(range => range.id);

    return this.http.request(
      'delete',
      this.apiUrl + '/ranges',
      Object.assign({}, this.authJsonOptions, { body: body })
    )
      .toPromise()
      .catch(RestService.handleError);
  }


  // /categories

  getCategories(): Promise<Category[]> {
    return this.http.get<Message<CategoryResponse[]>>(
      `${this.apiUrl}/categories`,
      this.authOptions
    )
      .toPromise()
      .then(RestService.checkMessage)
      .then((categories: CategoryResponse[]) => categories.map(toCategory))
      .catch(RestService.handleError);
  }

  mergeCategories(categories: Category[]): Promise<void> {
    const body = categories.map(fromCategory);

    return this.http.post(
      `${this.apiUrl}/categories`,
      body,
      this.authJsonOptions
    )
      .toPromise()
      .catch(RestService.handleError);
  }

  deleteCategories(categories: Category[]): Promise<void> {
    const body = categories.map(category => category.id);

    return this.http.request(
      'delete',
      `${this.apiUrl}/categories`,
      Object.assign({}, this.authJsonOptions, { body: body })
    )
      .toPromise()
      .catch(RestService.handleError);
  }


  getProductData(): Promise<{ products: Product[], categories: Category[], ranges: ProductRange[] }> {
    const pProducts = this.getProducts();
    const pRanges = this.getProductRanges();
    const pCategories = this.getCategories();

    return Promise.all([pProducts, pRanges, pCategories])
      .then((values: any[]) => {
        const products: Product[] = values[0];
        const ranges: ProductRange[] = values[1];
        const categories: Category[] = values[2];

        return { products, ranges, categories };
      });
  }


  // /guests

  getGuestByCard(card: string): Promise<Guest> {
    return this.http.get<Message<GuestResponse>>(
      `${this.apiUrl}/guests/card/${card}`,
      this.authOptions
    )
      .toPromise()
      .then(RestService.checkMessage)
      .then((guest: GuestResponse) => toGuest(guest))
      .catch(RestService.handleError);
  }

  getGuestsPaginatedAndFiltered(
    pageSize: number,
    page: number,
    codeLike: string,
    nameLike: string,
    mailLike: string,
    statusLike: string
  ): Promise<{guests: Guest[], guestsTotal: number}> {
    return this.http.get<Message<GuestResponsePaginated>>(
      `${this.apiUrl}/guests/?` +
      `size=${pageSize}&` +
      `page=${page}&` +
      `code=${codeLike}&` +
      `name=${nameLike}&` +
      `mail=${mailLike}&` +
      `status=${statusLike}`,
      this.authJsonOptions
    )
      .toPromise()
      .then(RestService.checkMessage)
      .then((response: GuestResponsePaginated) => ({
        guests: response.guests.map(toGuest),
        guestsTotal: response.guestsTotal
      }))
      .catch(RestService.handleError);
  }

  getGuestsBySearch(field: string, search: string): Observable<Guest[]> {
    return this.http.get<Message<GuestResponse[]>>(
      `${this.apiUrl}/guests/search/${field}/${search}`,
      this.authJsonOptions
    )
      .map((response: Message<GuestResponse[]>) => response.data)
      .map((guests: GuestResponse[]) => guests.map(toGuest))
      .catch(RestService.handleError);
  }

  mergeGuests(guests: Guest[]): Promise<void> {
    const body = guests.map(fromGuest);

    return this.http.post(
      `${this.apiUrl}/guests`,
      body,
      this.authJsonOptions
    )
      .toPromise()
      .catch(RestService.handleError);
  }

  deleteGuests(): Promise<void> {
    return this.http.delete(
      `${this.apiUrl}/guests`,
      this.authOptions
    )
      .toPromise()
      .catch(RestService.handleError);
  }

  addBalance(guest: Guest, value: number): Promise<number> {
    return this.http.put<Message<number>>(
      `${this.apiUrl}/guests/${guest.id}/balance`,
      value,
      this.authJsonOptions
    )
      .toPromise()
      .then(RestService.checkMessage)
      .catch(RestService.handleError);
  }

  addBonus(guest: Guest, value: number): Promise<number> {
    return this.http.put<Message<number>>(
      `${this.apiUrl}/guests/${guest.id}/bonus`,
      value,
      this.authJsonOptions
    )
      .toPromise()
      .then(RestService.checkMessage)
      .catch(RestService.handleError);
  }

  registerCard(guest: Guest, card: string): Promise<void> {
    return this.http.put(
      `${this.apiUrl}/guests/${guest.id}/card`,
      card,
      this.authJsonOptions
    )
      .toPromise()
      .catch(RestService.handleError);
  }

  checkIn(guest: Guest): Promise<Date> {
    return this.http.put<Message<number>>(
      `${this.apiUrl}/guests/${guest.id}/checkin`,
      null,
      this.authOptions
    )
      .toPromise()
      .then(RestService.checkMessage)
      .then((checkInDate: number) => new Date(checkInDate))
      .catch(RestService.handleError);
  }

  private getOrdersRaw(guest: Guest): Promise<OrderResponse[]> {
    return this.http.get<Message<OrderResponse[]>>(
      `${this.apiUrl}/guests/${guest.id}/orders`,
      this.authJsonOptions
    )
      .toPromise()
      .then(RestService.checkMessage)
      .catch(RestService.handleError);
  }

  getOrders(guest: Guest): Promise<Order[]> {
    const pProducts = this.getAllProducts();
    const pOrders = this.getOrdersRaw(guest);
    return Promise.all([pProducts, pOrders])
      .then((values: any[]) => {
        const products: Product[] = values[0];
        const ordersResponse: OrderResponse[] = values[1];

        const productsMap = new Map<number, Product>();
        products.forEach((product: Product) => productsMap[product.id] = product);

        return ordersResponse.map((orderResponse: OrderResponse) => toOrder(orderResponse, productsMap));
      })
      .catch(RestService.handleError);
  }

  // /statuses

  getStatuses(): Promise<Status[]> {
    return this.http.get<Message<StatusResponse[]>>(
      `${this.apiUrl}/statuses`,
      this.authOptions
    )
      .toPromise()
      .then(RestService.checkMessage)
      .then((statuses: StatusResponse[]) => statuses.map(toStatus))
      .catch(RestService.handleError);
  }

  mergeStatuses(statuses: Status[]): Promise<void> {
    const body = statuses.map(fromStatus);

    return this.http.post(
      `${this.apiUrl}/statuses`,
      body,
      this.authJsonOptions
    )
      .toPromise()
      .catch(RestService.handleError);
  }

  deleteStatuses(statuses: Status[]): Promise<void> {
    const body = statuses.map(status => status.id);

    return this.http.request(
      'delete',
      `${this.apiUrl}/statuses`,
      Object.assign({}, this.authJsonOptions, { body: body })
    )
      .toPromise()
      .catch(RestService.handleError);
  }


  // /orders

  placeOrder(guest: Guest, products: Map<Product, number>): Promise<void> {
    const body = fromItems(guest, products);

    return this.http.post(
      `${this.apiUrl}/orders`,
      body,
      this.authJsonOptions
    )
      .toPromise()
      .catch(RestService.handleError);
  }

  cancelOrderItem(orderItem: OrderItem): Promise<void> {
    const body = [cancelFromOrderItem(orderItem)];

    return this.http.request(
      'delete',
      `${this.apiUrl}/orders`,
      Object.assign({}, this.authJsonOptions, { body: body })
    )
      .toPromise()
      .catch(RestService.handleError);
  }

  cancelCustom(order: Order): Promise<void> {
    const body = [cancelFromOrder(order)];

    return this.http.request(
      'delete',
      `${this.apiUrl}/orders`,
      Object.assign({}, this.authJsonOptions, { body: body })
    )
      .toPromise()
      .catch(RestService.handleError);
  }


  // /statistics

  getStatistics(): Promise<Statistics> {
    return this.http.get<Message<StatisticsResponse>>(
      this.apiUrl + '/statistics',
      this.authOptions
    )
      .toPromise()
      .then(RestService.checkMessage)
      .then((stats: StatisticsResponse) => toStatistics(stats))
      .catch(RestService.handleError);
  }

  // /users
  getUsers(): Promise<User[]> {
    return this.http.get<Message<UserResponse[]>>(
      this.apiUrl + '/users',
      this.authOptions
    )
      .toPromise()
      .then(RestService.checkMessage)
      .then((users: UserResponse[]) => users.map(toUser))
      .catch(RestService.handleError);
  }

  mergeUsers(users: User[]): Promise<void> {
    const body = users.map(fromUser);

    return this.http.post(
      `${this.apiUrl}/users`,
      body,
      this.authJsonOptions
    )
      .toPromise()
      .catch(RestService.handleError);
  }

  deleteUsers(users: User[]): Promise<void> {
    const body = users.map(user => user.id);

    if (users.length === 0) {
      return Promise.resolve();
    }
    return this.http.request(
      'delete',
      `${this.apiUrl}/users`,
      Object.assign({}, this.authJsonOptions, { body: body })
    )
      .toPromise()
      .catch(RestService.handleError);
  }

  getUser(): Promise<User> {
    return this.http.get<Message<UserResponse>>(
      this.apiUrl + '/users/me',
      this.authOptions
    )
      .toPromise()
      .then(RestService.checkMessage)
      .then(toUser)
      .catch(RestService.handleError);
  }


  // /config
  getConfig(): Promise<Config> {
    return this.http.get<Message<ConfigResponse>>(
      this.apiUrl + '/config',
      this.authOptions
    )
      .toPromise()
      .then(RestService.checkMessage)
      .then((config: ConfigResponse) => toConfig(config))
      .catch(RestService.handleError);
  }

  setConfig(config: Config): Promise<void> {
    return this.http.put(
      this.apiUrl + '/config',
      fromConfig(config),
      this.authJsonOptions
    )
      .toPromise()
      .catch(RestService.handleError);
  }


  authenticate(username: string, password: string): Promise<TokenResponse> {
    const clientEncoded = btoa('argentum-client:secret');

    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('username', username);
    params.append('password', password);

    return this.http.post<TokenResponse>(
      this.apiUrl + '/oauth/token',
      params.toString(),
      {
        headers: new HttpHeaders({
          'Authorization': `Basic ${clientEncoded}`,
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        })
      }
    )
      .toPromise()
      .then((token: TokenResponse) => {
        localStorage.setItem('token', token.access_token);
        this.updateToken();
        return token;
      })
      .catch(RestService.handleError);
  }
}
