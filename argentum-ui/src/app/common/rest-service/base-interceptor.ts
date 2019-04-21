import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable()
export class BaseInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      url: environment.apiUrl + req.url
    });

    const token = localStorage.getItem('token');
    if (token !== null) {
      req = req.clone({
        headers: req.headers.set('Authorization', `Token ${token}`)
      });
    }
    return next.handle(req);
  }
}
