import {fakeAsync, TestBed} from '@angular/core/testing';

import {StatusService} from './status.service';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {BaseInterceptor} from './base-interceptor';
import {Status} from '../model/status';
import {expectArraysEqual, testEndpoint} from './test-utils';
import {Statuses} from './test-data/statuses';

describe('StatusService', () => {
  let service: StatusService;
  let http: HttpClient;
  let httpTestingController: HttpTestingController;
  const requests: Object = require('./test-data/requests.json');
  const responses: Object = require('./test-data/responses.json');
  let resolved = false;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{provide: HTTP_INTERCEPTORS, useClass: BaseInterceptor, multi: true}],
    });
    http = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = new StatusService(http);
    resolved = false;
  });

  afterEach(() => {
    expect(resolved).toBeTruthy('Request callback was not called.');
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
    resolved = true;
  });

  it('should list all statuses', fakeAsync(() => {
    service.list().subscribe((statuses: Status[]) => {
      expectArraysEqual(statuses, Statuses.ALL);
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'GET', '/statuses');
  }));

  it('should create a status', fakeAsync(() => {
    service.create(Statuses.STAFF).subscribe((status: Status) => {
      expect(status.equals(Statuses.STAFF)).toBeTruthy();
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'POST', '/statuses');
  }));

  it('should update a status', fakeAsync(() => {
    service.update(Statuses.PENDING_PATCHED_REQUEST).subscribe((status: Status) => {
      expect(status.equals(Statuses.PENDING_PATCHED_RESPONSE)).toBeTruthy();
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'PATCH', `/statuses/${Statuses.PENDING_PATCHED_REQUEST.id}`);
  }));

  it('should delete a status', fakeAsync(() => {
    service.delete(Statuses.PENDING).subscribe(() => {
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'DELETE', `/statuses/${Statuses.PENDING.id}`);
  }));
});
