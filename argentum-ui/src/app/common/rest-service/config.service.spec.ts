import {fakeAsync, TestBed} from '@angular/core/testing';

import { ConfigService } from './config.service';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {BaseInterceptor} from './base-interceptor';
import {Config} from '../model/config';
import {expectArraysEqual, testEndpoint} from './test-utils';
import {Configs} from './test-data/configs';

describe('ConfigService', () => {
  let service: ConfigService;
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
    service = new ConfigService(http);
    resolved = false;
  });

  afterEach(() => {
    expect(resolved).toBeTruthy('Request callback was not called.');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    resolved = true;
  });

  it('should list all config entries', fakeAsync(() => {
    service.list().subscribe((configs: Config[]) => {
      expectArraysEqual(configs, Configs.ALL);
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'GET', '/config');
  }));

  it('should update a config entry', fakeAsync(() => {
    service.update(Configs.POSTPAID_LIMIT_PATCHED).subscribe((config: Config) => {
      expect(config.equals(Configs.POSTPAID_LIMIT_PATCHED)).toBeTruthy();
    });
    resolved = true;
    testEndpoint(httpTestingController, requests, responses, 'PATCH', `/config/${Configs.POSTPAID_LIMIT.id}`);
  }));
});
