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
    http = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
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

  it('should remove undefined values from its body', fakeAsync(() => {
    http.post('/test', {'a': 1, 'b': undefined, 'c': {'d': undefined}}).subscribe(() => resolved = true);
    const req = httpTestingController.expectOne(`${environment.apiUrl}/test`);
    expect('a' in req.request.body).toBeTruthy();
    expect('b' in req.request.body).toBeFalsy();
    expect('d' in req.request.body['c']).toBeFalsy();
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
