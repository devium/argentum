import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable()
export class BaseInterceptor implements HttpInterceptor {
  private static purgeUndefined(object: Object) {
    Object.keys(object).forEach((key: string) => {
      if (object[key] === undefined) {
        delete object[key];
      } else if (object[key] instanceof Object) {
        this.purgeUndefined(object[key]);
      }
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Prepend the API url to the request url.
    req = req.clone({
      url: environment.apiUrl + req.url
    });

    // Remove undefined fields from the JSON body.
    if (req.body) {
      BaseInterceptor.purgeUndefined(req.body);
    }

    // Add authorization header.
    const token = localStorage.getItem('token');
    if (token !== null) {
      req = req.clone({
        headers: req.headers.set('Authorization', `Token ${token}`)
      });
    }
    return next.handle(req);
  }
}
