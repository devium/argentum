import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Tag} from '../model/tag';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {processErrors} from './utils';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private http: HttpClient) {
  }

  list(): Observable<Tag[]> {
    return this.http.get<Tag.Dto[]>('/tags').pipe(
      map((dtos: Tag.Dto[]) => dtos.map((dto: Tag.Dto) => Tag.fromDto(dto))),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  listByCard(card: string): Observable<Tag[]> {
    return this.http.get<Tag.Dto[]>('/tags', {params: {guest__card: card}}).pipe(
      map((dtos: Tag.Dto[]) => dtos.map((dto: Tag.Dto) => Tag.fromDto(dto))),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }
}
