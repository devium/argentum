import {fakeAsync, TestBed} from '@angular/core/testing';

import {BonusTransactionService} from './bonus-transaction.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {BaseInterceptor} from './base-interceptor';
import {of} from 'rxjs';
import {Guests} from './test-data/guests';
import createSpyObj = jasmine.createSpyObj;
import {BonusTransaction} from '../model/bonus_transaction';
import {expectArraysEqual, testEndpoint} from './test-utils';
import {BonusTransactions} from './test-data/bonus-transactions';

fdescribe('BonusTransactionService', () => {
  let service: BonusTransactionService;
  let guestService: any;
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
    guestService = createSpyObj('GuestService', ['list']);
    guestService.list.and.returnValue(of(Guests.ALL));
    service = new BonusTransactionService(http, guestService);
    resolved = false;
  });

  afterEach(() => {
    expect(resolved).toBeTruthy('Request callback was not called.');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    resolved = true;
  });

  it('should list all bonus transactions', fakeAsync(() => {
    service.list().subscribe((bonusTransactions: BonusTransaction[]) => {
      expectArraysEqual(bonusTransactions, BonusTransactions.ALL);
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'GET', '/bonus_transactions');
  }));

  it('should list bonus transactions by card', fakeAsync(() => {
    service.listByCard(Guests.ROBY.card).subscribe((bonusTransactions: BonusTransaction[]) => {
      expectArraysEqual(bonusTransactions, [BonusTransactions.BTX1_BY_CARD_REFERENCE, BonusTransactions.BTX3_BY_CARD_REFERENCE]);
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'GET', `/bonus_transactions?guest__card=${Guests.ROBY.card}`);
  }));

  it('should create a bonus transaction', fakeAsync(() => {
    service.create(Guests.ROBY, BonusTransactions.BTX4_REFERENCE.value).subscribe((bonusTransaction: BonusTransaction) => {
      expect(bonusTransaction.equals(BonusTransactions.BTX4_REFERENCE)).toBeTruthy();
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'POST', '/bonus_transactions');
  }));

  it('should create a bonus transaction by card', fakeAsync(() => {
    service.createByCard(Guests.ROBY.card, BonusTransactions.BTX4_REFERENCE.value).subscribe((bonusTransaction: BonusTransaction) => {
      expect(bonusTransaction.equals(BonusTransactions.BTX4_REFERENCE)).toBeTruthy();
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'POST', '/bonus_transactions', '#card');
  }));

  it('should commit a bonus transaction', fakeAsync(() => {
    service.commit(BonusTransactions.BTX3).subscribe((bonusTransaction: BonusTransaction) => {
      expect(bonusTransaction.equals(BonusTransactions.BTX3_PATCHED_REFERENCE)).toBeTruthy();
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'PATCH', `/bonus_transactions/${BonusTransactions.BTX3.id}`);
  }));
});
