import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Order} from '../model/order';
import {Observable} from 'rxjs';
import {TagRegistration} from '../model/tag-registration';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TagRegistrationService {

  constructor(private http: HttpClient) {
  }

  create(card: string, labels: number[], order: Order): Observable<TagRegistration>[] {
    return labels.map(
      (label: number) => this.http.post<TagRegistration.Dto>(
        '/tag_registrations',
        TagRegistration.createDto(label, card, order)
      ).pipe(
        map((dto: TagRegistration.Dto) => TagRegistration.fromDto(dto, [order]))
      )
    );
  }

  commit(tagRegistrations: TagRegistration[], order: Order): Observable<TagRegistration>[] {
    return tagRegistrations.map(
      (tagRegistration: TagRegistration) => this.http.patch<TagRegistration.Dto>(
        `/tag_registrations/${tagRegistration.id}`,
        TagRegistration.commitDto()
      ).pipe(
        map((dto: TagRegistration.Dto) => TagRegistration.fromDto(dto, [order]))
      )
    );
  }
}
