import {fakeAsync, TestBed} from '@angular/core/testing';

import {GroupService } from './group.service';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {BaseInterceptor} from './base-interceptor';
import {Group} from '../model/group';
import {expectArraysEqual, testEndpoint} from './test-utils';
import {Groups} from './test-data/groups';

fdescribe('GroupService', () => {
  let service: GroupService;
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
    http = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    service = new GroupService(http);
    resolved = false;
  });

  afterEach(() => {
    expect(resolved).toBeTruthy('Request callback was not called.');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    resolved = true;
  });

  it('should list correctly', fakeAsync(() => {
    service.list().subscribe((groups: Group[]) => {
      expectArraysEqual(groups, Groups.ALL);
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'GET', '/groups');
  }));
});
