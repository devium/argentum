import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GuestService} from './guest.service';
import {Observable} from 'rxjs';
import {Transaction} from '../model/transaction';
import {Guest} from '../model/guest';
import {Order} from '../model/order';
import {withDependencies} from './utils';
import {OrderService} from './order.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient, private guestService: GuestService, private orderService: OrderService) {
  }

  list(guests?: Guest[], orders?: Order[]): Observable<Transaction[]> {
    return withDependencies(
      this.http.get<Transaction.Dto[]>('/transactions'),
      [guests, () => this.guestService.list()],
      [orders, () => this.orderService.list()]
    ).pipe(
      map(([dtos, guestsDep, ordersDep]: [Transaction.Dto[], Guest[], Order[], {}]) =>
        dtos.map((dto: Transaction.Dto) => Transaction.fromDto(dto, ordersDep, guestsDep))
      )
    );
  }

  listByCard(card: string, orders?: Order[]): Observable<Transaction[]> {
    return withDependencies(
      this.http.get<Transaction.Dto[]>('/transactions', {params: {guest__card: card}}),
      [orders, () => this.orderService.list()]
    ).pipe(
      map(([dtos, ordersDep]: [Transaction.Dto[], Order[], {}, {}]) =>
        dtos.map((dto: Transaction.Dto) => Transaction.fromDto(dto, ordersDep))
      )
    );
  }

  create(card: string, value: number, ignoreBonus: boolean = false, orders?: Order[]): Observable<Transaction> {
    return withDependencies(
      this.http.post<Transaction.Dto>('/transactions', Transaction.createDto(card, value, ignoreBonus)),
      [orders, () => this.orderService.list()]
    ).pipe(
      map(([dto, ordersDep]: [Transaction.Dto, Order[], {}, {}]) => Transaction.fromDto(dto, ordersDep))
    );
  }

  commit(transaction: Transaction, orders?: Order[]): Observable<Transaction> {
    return withDependencies(
      this.http.patch<Transaction.Dto>(`/transactions/${transaction.id}`, Transaction.commitDto()),
      [orders, () => this.orderService.list()]
    ).pipe(
      map(([dto, ordersDep]: [Transaction.Dto, Order[], {}, {}]) => Transaction.fromDto(dto, ordersDep))
    );
  }
}
