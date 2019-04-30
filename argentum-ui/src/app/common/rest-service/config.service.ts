import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Config} from '../model/config';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {processErrors} from './utils';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private http: HttpClient) {
  }

  list(): Observable<Config[]> {
    return this.http.get<Config.Dto[]>('/config').pipe(
      map((dtos: Config.Dto[]) => dtos.map((dto: Config.Dto) => Config.fromDto(dto))),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  update(config: Config): Observable<Config> {
    return this.http.patch<Config.Dto>(`/config/${config.id}`, config.toDto()).pipe(
      map((dto: Config.Dto) => Config.fromDto(dto)),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }
}
