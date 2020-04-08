import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Order} from '../model/order';
import {combineLatest, Observable, of} from 'rxjs';
import {TagRegistration} from '../model/tag-registration';
import {map} from 'rxjs/operators';
import {Transaction} from '../model/transaction';

@Injectable({
  providedIn: 'root'
})
export class TagRegistrationService {

  constructor(private http: HttpClient) {
  }

  create(card: string, labels: number[], order: Order): Observable<TagRegistration> {
    return this.http.post<TagRegistration.Dto>('/tag_registrations', TagRegistration.createDto(labels, card, order)).pipe(
      map((dto: TagRegistration.Dto) => TagRegistration.fromDto(dto, [order]))
    );
  }

  commit(tagRegistration: TagRegistration, order: Order): Observable<TagRegistration> {
    return this.http.patch<TagRegistration.Dto>(`/tag_registrations/${tagRegistration.id}`, TagRegistration.commitDto()).pipe(
      map((dto: TagRegistration.Dto) => TagRegistration.fromDto(dto, [order]))
    );
  }
}
