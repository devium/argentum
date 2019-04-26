import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Status} from '../model/status';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor(private http: HttpClient) {
  }

  list(): Observable<Status[]> {
    return this.http.get<Status.Dto[]>('/statuses').pipe(
      map((dtos: Status.Dto[]) => dtos.map((dto: Status.Dto) => Status.fromDto(dto)))
    );
  }

  create(status: Status): Observable<Status> {
    return this.http.post<Status.Dto>('/statuses', status.toDto()).pipe(
      map((dto: Status.Dto) => Status.fromDto(dto))
    );
  }

  update(status: Status): Observable<Status> {
    return this.http.patch<Status.Dto>(`/statuses/${status.id}`, status.toDto()).pipe(
      map((dto: Status.Dto) => Status.fromDto(dto))
    );
  }

  delete(status: Status): Observable<null> {
    return this.http.delete<null>(`/statuses/${status.id}`);
  }
}
