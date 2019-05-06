import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Guest} from '../model/guest';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {processErrors, withDependencies} from './utils';
import {StatusService} from './status.service';
import {Status} from '../model/status';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  constructor(private http: HttpClient, private statusService: StatusService) {
  }

  list(statuses?: Status[]): Observable<Guest[]> {
    return withDependencies(
      this.http.get<Guest.Dto[]>('/guests'),
      [statuses, () => this.statusService.list()]
    ).pipe(
      map(([dtos, statusesDep]: [Guest.Dto[], Status[], {}, {}]) => dtos.map((dto: Guest.Dto) => Guest.fromDto(dto, statusesDep))),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  retrieve(guest: Guest, statuses?: Status[]): Observable<Guest> {
    return withDependencies(
      this.http.get<Guest.Dto>(`/guests/${guest.id}`),
      [statuses, () => this.statusService.list()]
    ).pipe(
      map(([dto, statusesDep]: [Guest.Dto, Status[], {}, {}]) => Guest.fromDto(dto, statusesDep)),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  retrieveByCard(card: string, statuses?: Status[]): Observable<Guest> {
    // If no guest is found, 404 is returned. Handle as an error.
    return withDependencies(
      this.http.get<Guest.Dto[]>('/guests', {params: {card: card}}),
      [statuses, () => this.statusService.list()]
    ).pipe(
      map(([dtos, statusesDep]: [Guest.Dto[], Status[], {}, {}]) => dtos.length > 0 ? Guest.fromDto(dtos[0], statusesDep) : null),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  listFiltered(filter: Guest.Filter, statuses?: Status[]): Observable<Guest[]> {
    // There must be a better way for this conversion but this works for now.
    const params = {};
    for (const key of Object.keys(filter)) {
      params[key] = filter[key];
    }
    return withDependencies(
      this.http.get<Guest.Dto[]>('/guests', {params: params}),
      [statuses, () => this.statusService.list()]
    ).pipe(
      map(([dtos, statusesDep]: [Guest.Dto[], Status[], {}, {}]) => dtos.map((dto: Guest.Dto) => Guest.fromDto(dto, statusesDep))),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  create(guest: Guest, statuses?: Status[]): Observable<Guest> {
    return withDependencies(
      this.http.post<Guest.Dto>('/guests', guest.toDto()),
      [statuses, () => this.statusService.list()]
    ).pipe(
      map(([dto, statusesDep]: [Guest.Dto, Status[], {}, {}]) => Guest.fromDto(dto, statusesDep)),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  checkIn(guest: Guest, statuses?: Status[]): Observable<Guest> {
    return withDependencies(
      this.http.patch<Guest.Dto>(`/guests/${guest.id}`, Guest.checkInDto()),
      [statuses, () => this.statusService.list()]
    ).pipe(
      map(([dto, statusesDep]: [Guest.Dto, Status[], {}, {}]) => Guest.fromDto(dto, statusesDep)),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  setCard(guest: Guest, statuses?: Status[]): Observable<Guest> {
    return withDependencies(
      this.http.patch<Guest.Dto>(`/guests/${guest.id}`, guest.cardDto()),
      [statuses, () => this.statusService.list()]
    ).pipe(
      map(([dto, statusesDep]: [Guest.Dto, Status[], {}, {}]) => Guest.fromDto(dto, statusesDep)),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  update(guest: Guest, statuses?: Status[]): Observable<Guest> {
    return withDependencies(
      this.http.patch<Guest.Dto>(`/guests/${guest.id}`, guest.toDto()),
      [statuses, () => this.statusService.list()]
    ).pipe(
      map(([dto, statusesDep]: [Guest.Dto, Status[], {}, {}]) => Guest.fromDto(dto, statusesDep)),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  listUpdate(guests: Guest[], statuses?: Status[]): Observable<Guest[]> {
    return withDependencies(
      this.http.patch<Guest.Dto[]>('/guests/list_update', guests.map((guest: Guest) => guest.toDto())),
      [statuses, () => this.statusService.list()]
    )
      .pipe(
        map(([dtos, statusesDep]: [Guest.Dto[], Status[], {}, {}]) => dtos.map((dto: Guest.Dto) => Guest.fromDto(dto, statusesDep))),
        catchError((err: HttpErrorResponse) => processErrors(err))
      );
  }

  deleteAll(): Observable<null> {
    return this.http.delete<null>('/guests/delete_all').pipe(
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }
}
