import {fakeAsync, TestBed} from '@angular/core/testing';

import {DiscountService} from './discount.service';
import {CategoryService} from './category.service';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {BaseInterceptor} from './base-interceptor';
import {of} from 'rxjs';
import {Categories} from './test-data/categories';
import createSpyObj = jasmine.createSpyObj;
import {Statuses} from './test-data/statuses';
import {StatusService} from './status.service';
import {Discount} from '../model/discount';
import {expectArraysEqual, testEndpoint} from './test-utils';
import {Discounts} from './test-data/discounts';
import {Guests} from './test-data/guests';

fdescribe('DiscountService', () => {
  let service: DiscountService;
  let statusService: any;
  let categoryService: any;
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
    statusService = createSpyObj('StatusService', ['list']);
    statusService.list.and.returnValue(of(Statuses.ALL));
    categoryService = createSpyObj('CategoryService', ['list']);
    categoryService.list.and.returnValue(of(Categories.ALL));
    service = new DiscountService(http, statusService, categoryService);
    resolved = false;
  });

  afterEach(() => {
    expect(resolved).toBeTruthy('Request callback was not called.');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    resolved = true;
  });

  it('should list all discounts', fakeAsync(() => {
    service.list().subscribe((discounts: Discount[]) => {
      expectArraysEqual(discounts, Discounts.ALL);
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'GET', '/discounts');
    expect(statusService.list).toHaveBeenCalledTimes(1);
    expect(categoryService.list).toHaveBeenCalledTimes(1);
  }));

  it('should list discounts by card', fakeAsync(() => {
    service.listByCard(Guests.ROBY.card).subscribe((discounts: Discount[]) => {
      expectArraysEqual(discounts, [Discounts.PAID_SOFT_DRINKS]);
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'GET', `/discounts?status__guests__card=${Guests.ROBY.card}`);
  }));

  it('should create a discount', fakeAsync(() => {
    service.create(Discounts.PENDING_SOFT_DRINKS).subscribe((discount: Discount) => {
      expect(discount.equals(Discounts.PENDING_SOFT_DRINKS)).toBeTruthy();
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'POST', '/discounts');
  }));

  it('should update a discount', fakeAsync(() => {
    service.update(Discounts.PAID_SOFT_DRINKS_PATCHED).subscribe((discount: Discount) => {
      expect(discount.equals(Discounts.PAID_SOFT_DRINKS_PATCHED_REFERENCE)).toBeTruthy();
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'PATCH', `/discounts/${Discounts.PAID_SOFT_DRINKS.id}`);
  }));

  it('should delete a discount', fakeAsync(() => {
    service.delete(Discounts.PAID_SOFT_DRINKS).subscribe(() => {
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'DELETE', `/discounts/${Discounts.PAID_SOFT_DRINKS.id}`);
  }));
});
