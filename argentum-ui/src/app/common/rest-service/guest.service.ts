import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Guest} from '../model/guest';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {processErrors} from './utils';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  constructor(private http: HttpClient) {
  }

  list(): Observable<Guest[]> {
    return this.http.get<Guest.Dto[]>('/guests').pipe(
      map((dtos: Guest.Dto[]) => dtos.map((dto: Guest.Dto) => Guest.fromDto(dto))),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  retrieve(guest: Guest): Observable<Guest> {
    return this.http.get<Guest.Dto>(`/guests/${guest.id}`).pipe(
      map((dto: Guest.Dto) => Guest.fromDto(dto)),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  retrieveByCard(card: string): Observable<Guest> {
    // If no guest is found, 404 is returned. Handle as an error.
    return this.http.get<Guest.Dto[]>('/guests', {params: {card: card}}).pipe(
      map((dtos: Guest.Dto[]) => dtos.length > 0 ? Guest.fromDto(dtos[0]) : null) ,
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  listFiltered(filter: Guest.Filter): Observable<Guest[]> {
    // There must be a better way for this conversion but this works for now.
    const params = {};
    for (const key of Object.keys(filter)) {
        params[key] = filter[key];
    }
    return this.http.get<Guest.Dto[]>('/guests', {params: params}).pipe(
      map((dtos: Guest.Dto[]) => dtos.map((dto: Guest.Dto) => Guest.fromDto(dto))),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  create(guest: Guest): Observable<Guest> {
    return this.http.post<Guest.Dto>('/guests', guest.toDto()).pipe(
      map((dto: Guest.Dto) => Guest.fromDto(dto)),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  update(guest: Guest): Observable<Guest> {
    return this.http.patch<Guest.Dto>(`/guests/${guest.id}`, guest.toDto()).pipe(
      map((dto: Guest.Dto) => Guest.fromDto(dto)),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  listUpdate(guests: Guest[]): Observable<Guest[]> {
    return this.http.patch<Guest.Dto[]>('/guests/list_update', guests.map((guest: Guest) => guest.toDto())).pipe(
      map((dtos: Guest.Dto[]) => dtos.map((dto: Guest.Dto) => Guest.fromDto(dto))),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  deleteAll(): Observable<null> {
    return this.http.delete<null>('/guests/delete_all').pipe(
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }
}
