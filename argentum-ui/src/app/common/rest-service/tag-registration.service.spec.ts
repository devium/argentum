import {fakeAsync, TestBed} from '@angular/core/testing';

import { TagRegistrationService } from './tag-registration.service';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {BaseInterceptor} from './base-interceptor';
import {Guests} from './test-data/guests';
import {TagRegistrations} from './test-data/tag-registrations';
import {TagRegistration} from '../model/tag-registration';
import {testEndpoint} from './test-utils';

describe('TagRegistrationService', () => {
  let service: TagRegistrationService;
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
    service = new TagRegistrationService(http);
  });

  afterEach(() => {
    expect(resolved).toBeTruthy('Request callback was not called.');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    resolved = true;
  });

  it('should create a tag registration', fakeAsync(() => {
    service.create(Guests.ROBY.card, TagRegistrations.ROBY_FIVE_REFERENCE.labels, TagRegistrations.ROBY_FIVE_REFERENCE.order).subscribe(
      (tagRegistration: TagRegistration) => {
        expect(tagRegistration.equals(TagRegistrations.ROBY_FIVE_REFERENCE)).toBeTruthy();
        resolved = true;
      }
    );
    testEndpoint(httpTestingController, requests, responses, 'POST', '/tag_registrations', '#card', '#card');
  }));

  it('should commit a tag registration', fakeAsync(() => {
    service.commit(TagRegistrations.ROBY_FOUR, TagRegistrations.ROBY_FOUR.order).subscribe(
      (tagRegistration: TagRegistration) => {
        expect(tagRegistration.equals(TagRegistrations.ROBY_FOUR_COMMITTED_REFERENCE)).toBeTruthy();
        resolved = true;
      }
    );
    testEndpoint(
      httpTestingController, requests, responses, 'PATCH', `/tag_registrations/${TagRegistrations.ROBY_FOUR.id}`, '#commit', '#commit'
    );
  }));
});
