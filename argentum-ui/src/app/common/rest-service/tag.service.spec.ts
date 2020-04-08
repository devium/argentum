import {fakeAsync, TestBed} from '@angular/core/testing';

import { TagService } from './tag.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {BaseInterceptor} from './base-interceptor';
import {Tag} from '../model/tag';
import {expectArraysEqual, testEndpoint} from './test-utils';
import {Tags} from './test-data/tags';
import {Guests} from './test-data/guests';

describe('TagService', () => {
  let service: TagService;
  let http: HttpClient;
  let httpTestingController: HttpTestingController;
  const requests: Object = require('./test-data/requests.json');
  const responses: Object = require('./test-data/responses.json');
  let resolved = false;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{provide: HTTP_INTERCEPTORS, useClass: BaseInterceptor, multi: true}]
    });
    resolved = false;
    http = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = new TagService(http);
  });

  afterEach(() => {
    expect(resolved).toBeTruthy('Request callback was not called.');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    resolved = true;
  });

  it('should list all tags', fakeAsync(() => {
    service.list().subscribe((tags: Tag[]) => {
      expectArraysEqual(tags, Tags.ALL);
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'GET', '/tags');
  }));

  it('should list tags by card', fakeAsync(() => {
    service.listByCard(Guests.ROBY.card).subscribe((tags: Tag[]) => {
      expectArraysEqual(tags, [Tags.TWO]);
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'GET', `/tags?guest__card=${Guests.ROBY.card}`);
  }));
});
