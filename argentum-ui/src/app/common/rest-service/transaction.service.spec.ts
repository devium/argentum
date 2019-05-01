import {fakeAsync, TestBed} from '@angular/core/testing';

import { TransactionService } from './transaction.service';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {BaseInterceptor} from './base-interceptor';
import {of} from 'rxjs';
import createSpyObj = jasmine.createSpyObj;
import {Orders} from './test-data/orders';
import {Guests} from './test-data/guests';
import {Transaction} from '../model/transaction';
import {expectArraysEqual, testEndpoint} from './test-utils';
import {Transactions} from './test-data/transactions';

fdescribe('TransactionService', () => {
  let service: TransactionService;
  let guestService: any;
  let orderService: any;
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
    orderService = createSpyObj('OrderService', ['list']);
    orderService.list.and.returnValue(of(Orders.ALL));
    orderService.listByCard.and.returnValue(of(Orders.ALL));
    service = new TransactionService(http, guestService, orderService);
    resolved = false;
  });

  afterEach(() => {
    expect(resolved).toBeTruthy('Request callback was not called.');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    resolved = true;
  });

  it('should list all transactions', fakeAsync(() => {
    service.list().subscribe((transactions: Transaction[]) => {
      expectArraysEqual(transactions, Transactions.ALL);
      resolved = true;
    });
    expect(guestService.list).toHaveBeenCalledTimes(1);
    expect(orderService.list).toHaveBeenCalledTimes(1);
    testEndpoint(httpTestingController, requests, responses, 'GET', '/transactions');
  }));

  it('should list transactions by card', fakeAsync(() => {
    service.listByCard(Guests.ROBY.card).subscribe((transactions: Transaction[]) => {
      expectArraysEqual(transactions, [Transactions.TX1_BY_CARD, Transactions.TX_ORDER1_BY_CARD]);
      resolved = true;
    });
    expect(guestService.list).toHaveBeenCalledTimes(0);
    expect(orderService.list).toHaveBeenCalledTimes(1);
    testEndpoint(httpTestingController, requests, responses, 'GET', `/transactions?guest__card=${Guests.ROBY.card}`);
  }));

  it('should create a transaction', fakeAsync(() => {
    service.create(Guests.ROBY, Transactions.TX5_REFERENCE.value).subscribe((transaction: Transaction) => {
      expect(transaction.equals(Transactions.TX5_REFERENCE)).toBeTruthy();
      resolved = true;
    });
    expect(guestService.list).toHaveBeenCalledTimes(0);
    expect(orderService.list).toHaveBeenCalledTimes(1);
    testEndpoint(httpTestingController, requests, responses, 'POST', '/transactions');
  }));

  it('should create a transaction by card', fakeAsync(() => {
    service.createByCard(Guests.ROBY.card, Transactions.TX5_REFERENCE.value).subscribe((transaction: Transaction) => {
      expect(transaction.equals(Transactions.TX5_REFERENCE)).toBeTruthy();
      resolved = true;
    });
    expect(guestService.list).toHaveBeenCalledTimes(0);
    expect(orderService.list).toHaveBeenCalledTimes(1);
    testEndpoint(httpTestingController, requests, responses, 'POST', '/transactions', '#card');
  }));

  it('should commit a transaction', fakeAsync(() => {
    service.commit(Transactions.TX4).subscribe((transaction: Transaction) => {
      expect(transaction.equals(Transactions.TX4_PATCHED_REFERENCE)).toBeTruthy();
      resolved = true;
    });
    expect(guestService.list).toHaveBeenCalledTimes(0);
    expect(orderService.list).toHaveBeenCalledTimes(1);
    testEndpoint(httpTestingController, requests, responses, 'PATCH', '/transactions/4');
  }));
});
