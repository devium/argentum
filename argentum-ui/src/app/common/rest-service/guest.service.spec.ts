import {fakeAsync, TestBed} from '@angular/core/testing';

import {GuestService} from './guest.service';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {BaseInterceptor} from './base-interceptor';
import {expectArraysEqual, testEndpoint} from './test-utils';
import {Guest} from '../model/guest';
import {Guests} from './test-data/guests';
import {StatusService} from './status.service';
import createSpyObj = jasmine.createSpyObj;
import {Statuses} from './test-data/statuses';
import {of} from 'rxjs';

describe('GuestService', () => {
  let service: GuestService;
  let statusService: any;
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
    statusService = createSpyObj('StatusService', ['list']);
    statusService.list.and.returnValue(of(Statuses.ALL));
    service = new GuestService(http, statusService);
    resolved = false;
  });

  afterEach(() => {
    expect(resolved).toBeTruthy('Request callback was not called.');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    resolved = true;
  });

  it('should list all guests', fakeAsync(() => {
    service.list().subscribe((guests: Guest[]) => {
      expectArraysEqual(guests, Guests.ALL);
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'GET', '/guests');
  }));

  it('should retrieve a guest by card', fakeAsync(() => {
    service.retrieveByCard(Guests.ROBY.card).subscribe((guest: Guest) => {
      expect(guest.equals(Guests.ROBY)).toBeTruthy();
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'GET', `/guests?card=${Guests.ROBY.card}`);
  }));

  it('should find guests via filters', fakeAsync(() => {
    service.listFiltered({code: 'DEMO', name: 'el', mail: 'sohu.com'}).subscribe((guests: Guest[]) => {
      expectArraysEqual(guests, [Guests.ROBY]);
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'GET', '/guests?code=DEMO&name=el&mail=sohu.com');
  }));

  it('should create a guest with minimal information', fakeAsync(() => {
    service.create(Guests.JOHANNA_MIN_REQUEST).subscribe((guest: Guest) => {
      expect(guest.equals(Guests.JOHANNA_MIN_RESPONSE)).toBeTruthy();
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'POST', '/guests', '#min', '#min');
  }));

  it('should create a guest with maximum information', fakeAsync(() => {
    service.create(Guests.JOHANNA_MAX_REQUEST).subscribe((guest: Guest) => {
      expect(guest.equals(Guests.JOHANNA_MAX_RESPONSE)).toBeTruthy();
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'POST', '/guests', '#max', '#max');
  }));

  it('should update a guest', fakeAsync(() => {
    service.update(Guests.ROBY_PATCHED_REQUEST).subscribe((guest: Guest) => {
      expect(guest.equals(Guests.ROBY_PATCHED_RESPONSE)).toBeTruthy();
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'PATCH', `/guests/${Guests.ROBY_PATCHED_REQUEST.id}`);
  }));

  it('should perform a bulk update', fakeAsync(() => {
    service.listUpdate([Guests.ROBY_LIST_PATCHED_REQUEST, Guests.JOHANNA_LIST_CREATED_REQUEST]).subscribe((guests: Guest[]) => {
      expectArraysEqual(guests, [Guests.JOHANNA_LIST_CREATED_RESPONSE, Guests.ROBY_LIST_PATCHED_RESPONSE]);
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'PATCH', '/guests/list_update');
  }));
});
