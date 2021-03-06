import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Order} from '../model/order';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Product} from '../model/product';
import {ProductService} from './product.service';
import {processErrors, withDependencies} from './utils';
import {Guest} from '../model/guest';
import {GuestService} from './guest.service';
import {Category} from '../model/category';
import {CategoryService} from './category.service';
import {OrderItem} from '../model/order-item';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private http: HttpClient,
    private guestService: GuestService,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {
  }

  list(guests?: Guest[], products?: Product[]): Observable<Order[]> {
    return withDependencies(
      this.http.get<Order.Dto[]>('/orders'),
      [guests, () => this.guestService.list()],
      [products, () => this.productService.list()]
    ).pipe(
      map(([dtos, guestsDep, productsDep]: [Order.Dto[], Guest[], Product[], {}]) => {
        return dtos.map((dto: Order.Dto) => Order.fromDto(dto, guestsDep, productsDep));
      }),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  listByCard(card: string, categories?: Category[]): Observable<Order[]> {
    // Products are serialized in the response. No need to request them.
    return withDependencies(
      this.http.get<Order.Dto[]>('/orders', {params: {guest__card: card}}), [categories, () => this.categoryService.list()]).pipe(
      map(([dtos, categoriesDep]: [Order.Dto[], Category[], {}, {}]) => {
        return dtos.map((dto: Order.Dto) => Order.fromDto(dto, undefined, undefined, categoriesDep));
      }),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  create(order: Order, products?: Product[]): Observable<Order> {
    // The caller should always have the products that need to be resolved in the response, so make sure to pass them.
    return withDependencies(
      this.http.post<Order.Dto>('/orders', order.toDto()),
      [products, () => this.productService.list()]
    ).pipe(
      map(([dto, productsDep]: [Order.Dto, Product[], {}, {}]) => Order.fromDto(dto, undefined, productsDep, undefined)),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  commit(order: Order, products?: Product[]): Observable<Order> {
    // The caller should always have the products that need to be resolved in the response, so make sure to pass them.
    return withDependencies(
      this.http.patch<Order.Dto>(`/orders/${order.id}`, Order.commitDto()),
      [products, () => this.productService.list()]
    ).pipe(
      map(([dto, productsDep]: [Order.Dto, Product[], {}, {}]) => Order.fromDto(dto, undefined, productsDep, undefined)),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  cancelCustom(order: Order, newCustom: number, products?: Product[]): Observable<Order> {
    // The caller should always have the products that need to be resolved in the response, so make sure to pass them.
    return withDependencies(
      this.http.patch<Order.Dto>(`/orders/${order.id}`, Order.cancelDto(newCustom)),
      [products, () => this.productService.list()]
    ).pipe(
      map(([dto, productsDep]: [Order.Dto, Product[], {}, {}]) => Order.fromDto(dto, undefined, productsDep, undefined)),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  cancelProduct(orderItem: OrderItem, newQuantity: number, products?: Product[]): Observable<OrderItem> {
    // The caller should always have the products that need to be resolved in the response, so make sure to pass them.
    return withDependencies(
      this.http.patch<OrderItem.Dto>(`/order_items/${orderItem.id}`, OrderItem.cancelDto(newQuantity)),
      [products, () => this.productService.list()]
    ).pipe(
      map(([dto, productsDep]: [OrderItem.Dto, Product[], {}, {}]) => OrderItem.fromDto(dto, productsDep, undefined)),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }
}
