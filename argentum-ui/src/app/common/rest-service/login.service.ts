import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {processErrors} from './utils';

interface TokenDto {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) {
  }

  login(username: string, password: string): Observable<string> {
    return this.http.post<TokenDto>('/token', {'username': username, 'password': password}).pipe(
      map((res: TokenDto) => {
        localStorage.setItem('token', res.token);
        return res.token;
      }),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }
}
