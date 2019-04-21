import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) {
  }

  login(username: string, password: string): Observable<string> {
    return this.http.post<LoginResponse>('/token', {'username': username, 'password': password}).pipe(
      map((res: LoginResponse) => {
        localStorage.setItem('token', res.token);
        return res.token;
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.error && 'non_field_errors' in err.error) {
          return throwError(err.error.non_field_errors[0]);
        } else if (err.status === 0) {
          return throwError('No response from server.');
        } else {
          return throwError(err.message);
        }
      })
    );
  }

}
