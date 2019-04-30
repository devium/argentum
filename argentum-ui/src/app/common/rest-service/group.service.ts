import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Group} from '../model/group';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {processErrors} from './utils';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient) {
  }

  list(): Observable<Group[]> {
    return this.http.get('/groups').pipe(
      map((dtos: Group.Dto[]) => dtos.map((dto: Group.Dto) => Group.fromDto(dto))),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }
}
