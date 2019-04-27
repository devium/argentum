import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GuestService} from './guest.service';
import {BonusTransaction} from '../model/bonus_transaction';
import {Observable} from 'rxjs';
import {Guest} from '../model/guest';
import {withDependencies} from './utils';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BonusTransactionService {

  constructor(private http: HttpClient, private guestService: GuestService) {
  }

  list(guests?: Guest[]): Observable<BonusTransaction[]> {
    return withDependencies(
      this.http.get<BonusTransaction.Dto[]>('/bonus_transactions'),
      [guests, this.guestService.list]
    ).pipe(
      map(([dtos, guestsDep]: [BonusTransaction.Dto[], Guest[], {}, {}]) => {
        return dtos.map((dto: BonusTransaction.Dto) => BonusTransaction.fromDto(dto, guestsDep));
      })
    );
  }

  listByCard(card: string): Observable<BonusTransaction[]> {
    return this.http.get<BonusTransaction.Dto[]>('/bonus_transactions', {params: {guest__card: card}}).pipe(
      map((dtos: BonusTransaction.Dto[]) => dtos.map((dto: BonusTransaction.Dto) => BonusTransaction.fromDto(dto)))
    );
  }

  create(card: string, value: number): Observable<BonusTransaction> {
    return this.http.post<BonusTransaction.Dto>('/bonus_transactions', BonusTransaction.createDto(card, value)).pipe(
      map((dto: BonusTransaction.Dto) => BonusTransaction.fromDto(dto))
    );
  }

  commit(bonusTransaction: BonusTransaction): Observable<BonusTransaction> {
    return this.http.patch<BonusTransaction.Dto>(`/bonus_transactions/${bonusTransaction.id}`, BonusTransaction.commitDto()).pipe(
      map((dto: BonusTransaction.Dto) => BonusTransaction.fromDto(dto))
    );
  }
}
