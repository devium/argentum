import {fakeAsync, TestBed} from '@angular/core/testing';

import {LoginService} from './login.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {BaseInterceptor} from './base-interceptor';

describe('LoginService', () => {
  let service: LoginService;
  let http: HttpClient;
  let httpTestingController: HttpTestingController;
  const requests: any = require('./test-data/requests.json');
  const responses: any = require('./test-data/responses.json');
  let resolved = false;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{provide: HTTP_INTERCEPTORS, useClass: BaseInterceptor, multi: true}],
    });
    http = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    service = new LoginService(http);
    resolved = false;
  });

  afterEach(() => {
    expect(resolved).toBeTruthy('Request callback was not called.');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    resolved = true;
  });

  it('should login correctly', fakeAsync(() => {
    const method = 'POST';
    const url = '/token';
    const suffix = '';

    localStorage.clear();
    service.login('admin', 'argentum').subscribe((token: string) => {
      const tokenRef = 'ff1f8753fce92e46716abc6749d09ee3db73b9e8';
      expect(token).toBe(tokenRef);
      expect(localStorage.getItem('token')).toBe(tokenRef);
      resolved = true;
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}${url}`);
    expect(req.request.method).toBe(method);
    expect(req.request.body).toEqual(requests[`${method}${url}${suffix}`]);
    req.flush(responses[`${method}${url}${suffix}`]);
  }));

  it('should forward the Django error message', fakeAsync(() => {
    const method = 'POST';
    const url = '/token';
    const suffix = '#error';

    service.login('admin', 'nogentum').subscribe(() => void(0), (err: string) => {
      expect(<string>err).toBe('Unable to log in with provided credentials.');
      resolved = true;
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}${url}`);
    expect(req.request.method).toBe(method);
    expect(req.request.body).toEqual(requests[`${method}${url}${suffix}`]);
    req.flush(responses[`${method}${url}${suffix}`], {status: 400, statusText: 'Bad Request'});
  }));

  it('should forward the error message', fakeAsync(() => {
    const method = 'POST';
    const url = '/token';
    const suffix = '#error';

    service.login('admin', 'nogentum').subscribe(() => void(0), (err: string) => {
      expect(err).toBe(`Http failure response for ${environment.apiUrl}${url}: 400 Something Else`);
      resolved = true;
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}${url}`);
    expect(req.request.method).toBe(method);
    expect(req.request.body).toEqual(requests[`${method}${url}${suffix}`]);
    req.flush(null, {status: 400, statusText: 'Something Else'});
  }));
});
