import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {fakeAsync, TestBed} from '@angular/core/testing';
import {BaseInterceptor} from './base-interceptor';
import {environment} from '../../../environments/environment';

describe('BaseInterceptor', () => {
  let http: HttpClient;
  let httpTestingController: HttpTestingController;
  let resolved = false;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [{ provide: HTTP_INTERCEPTORS, useClass: BaseInterceptor, multi: true }],
    });
    http = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    resolved = false;
  });

  afterEach(() => {
    expect(resolved).toBeTruthy('Request callback was not called.');
  });

  it('should add the API url to the path', fakeAsync(() => {
    http.get('/test').subscribe(() => resolved = true);
    const req = httpTestingController.expectOne(`${environment.apiUrl}/test`);
    expect(req.request.method).toBe('GET');
    req.flush(null);
  }));

  it('should add a token header if present', fakeAsync(() => {
    localStorage.clear();
    http.get('/test').subscribe(() => resolved = true);
    let req = httpTestingController.expectOne(`${environment.apiUrl}/test`);
    expect(req.request.headers.get('Authorization')).toBeNull();
    req.flush(null);

    localStorage.setItem('token', 'test');
    http.get('/test').subscribe(() => resolved = resolved && true);
    req = httpTestingController.expectOne(`${environment.apiUrl}/test`);
    expect(req.request.headers.get('Authorization')).toBe('Token test');
    req.flush(null);
  }));
});
