import {fakeAsync, TestBed} from '@angular/core/testing';

import {GuestService} from './guest.service';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {BaseInterceptor} from './base-interceptor';
import {expectArraysEqual, testEndpoint} from './test-utils';
import {Guest} from '../model/guest';
import {Guests} from './test-data/guests';

fdescribe('GuestService', () => {
  let service: GuestService;
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
    resolved = false;
    http = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    service = new GuestService(http);
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
    service.create(Guests.JOHANNA_MIN).subscribe((guest: Guest) => {
      expect(guest.equals(Guests.JOHANNA_MIN_REFERENCE)).toBeTruthy();
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'POST', '/guests', '#min');
  }));

  it('should create a guest with maximum information', fakeAsync(() => {
    service.create(Guests.JOHANNA_MAX).subscribe((guest: Guest) => {
      expect(guest.equals(Guests.JOHANNA_MAX_REFERENCE)).toBeTruthy();
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'POST', '/guests', '#max');
  }));

  it('should update a guest', fakeAsync(() => {
    service.update(Guests.ROBY_PATCHED).subscribe((guest: Guest) => {
      expect(guest.equals(Guests.ROBY_PATCHED_REFERENCE)).toBeTruthy();
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'PATCH', `/guests/${Guests.ROBY.id}`);
  }));

  it('should perform a bulk update', fakeAsync(() => {
    service.listUpdate([Guests.ROBY_LIST_PATCHED, Guests.JOHANNA_MIN]).subscribe((guests: Guest[]) => {
      expectArraysEqual(guests, [Guests.JOHANNA_MIN_REFERENCE, Guests.ROBY_LIST_PATCHED_REFERENCE]);
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'PATCH', '/guests/list_update');
  }));
});
