import {fakeAsync, TestBed} from '@angular/core/testing';

import {OrderService} from './order.service';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {BaseInterceptor} from './base-interceptor';
import {of} from 'rxjs';
import {Categories} from './test-data/categories';
import createSpyObj = jasmine.createSpyObj;
import {Products} from './test-data/products';
import {Guests} from './test-data/guests';
import {Order} from '../model/order';
import {expectArraysEqual, testEndpoint} from './test-utils';
import {Orders} from './test-data/orders';
import {OrderItems} from './test-data/order-items';
import {OrderItem} from '../model/order-item';

fdescribe('OrderService', () => {
  let service: OrderService;
  let guestService: any;
  let productService: any;
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
    guestService = createSpyObj('GuestService', ['list']);
    guestService.list.and.returnValue(of(Guests.ALL));
    productService = createSpyObj('ProductService', ['list']);
    productService.list.and.returnValue(of(Products.ALL));
    categoryService = createSpyObj('CategoryService', ['list']);
    categoryService.list.and.returnValue(of(Categories.ALL));
    service = new OrderService(http, guestService, productService, categoryService);
    resolved = false;
  });

  afterEach(() => {
    expect(resolved).toBeTruthy('Request callback was not called.');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    resolved = true;
  });

  it('should list all orders', fakeAsync(() => {
    service.list().subscribe((orders: Order[]) => {
      expectArraysEqual(orders, Orders.ALL);
      resolved = true;
    });
    expect(guestService.list).toHaveBeenCalledTimes(1);
    expect(productService.list).toHaveBeenCalledTimes(1);
    // In practice, ProductService would have called CategoryService. We mocked that method though.
    expect(categoryService.list).toHaveBeenCalledTimes(0);
    testEndpoint(httpTestingController, requests, responses, 'GET', '/orders');
  }));

  it('should list orders by card', fakeAsync(() => {
    service.listByCard(Guests.ROBY.card).subscribe((orders: Order[]) => {
      expectArraysEqual(
        orders,
        [
          Orders.TAG_REGISTRATION_TWO_BY_CARD,
          Orders.ONE_WATER_PLUS_TIP_BY_CARD,
          Orders.TAG_REGISTRATION_FOUR_BY_CARD,
          Orders.TAG_REGISTRATION_FIVE_BY_CARD
        ]
      );
      resolved = true;
    });
    // Guest information is hidden from non-admin users and products are serialized fully in this view. Only categories need to be fetched.
    expect(guestService.list).toHaveBeenCalledTimes(0);
    expect(productService.list).toHaveBeenCalledTimes(0);
    expect(categoryService.list).toHaveBeenCalledTimes(1);
    testEndpoint(httpTestingController, requests, responses, 'GET', `/orders?guest__card=${Guests.ROBY.card}`);
  }));

  it('should create a new order-panels', fakeAsync(() => {
    service.create(Orders.ONE_WATER_ONE_COKE_PLUS_TIP).subscribe((order: Order) => {
      expect(order.equals(Orders.ONE_WATER_ONE_COKE_PLUS_TIP_REFERENCE)).toBeTruthy();
      resolved = true;
    });
    // Guest information is hidden from non-admin users. Products, while realistically known, are not serialized fully in this view.
    // CategoryService would implicitly be called by ProductService.
    expect(guestService.list).toHaveBeenCalledTimes(0);
    expect(productService.list).toHaveBeenCalledTimes(1);
    expect(categoryService.list).toHaveBeenCalledTimes(0);
    testEndpoint(httpTestingController, requests, responses, 'POST', '/orders', '#card');
  }));

  it('should commit an order-panels', fakeAsync(() => {
    service.commit(Orders.TWO_COKES_PLUS_TIP).subscribe((order: Order) => {
      expect(order.equals(Orders.TWO_COKES_PLUS_TIP_PATCHED_REFERENCE)).toBeTruthy();
      resolved = true;
    });
    // Guest information is hidden from non-admin users. Products, while realistically known, are not serialized fully in this view.
    // CategoryService would implicitly be called by ProductService.
    expect(guestService.list).toHaveBeenCalledTimes(0);
    expect(productService.list).toHaveBeenCalledTimes(1);
    expect(categoryService.list).toHaveBeenCalledTimes(0);
    testEndpoint(httpTestingController, requests, responses, 'PATCH', `/orders/${Orders.TWO_COKES_PLUS_TIP.id}`, '#commit', '#commit');
  }));

  it('should cancel custom products', fakeAsync(() => {
    service.cancelCustom(Orders.ONE_WATER_PLUS_TIP, 0.05).subscribe((order: Order) => {
      expect(order.equals(Orders.ONE_WATER_PLUS_TIP_PATCHED)).toBeTruthy();
      resolved = true;
    });
    // Guest information is hidden from non-admin users. Products, while realistically known, are not serialized fully in this view.
    // CategoryService would implicitly be called by ProductService.
    expect(guestService.list).toHaveBeenCalledTimes(0);
    expect(productService.list).toHaveBeenCalledTimes(1);
    expect(categoryService.list).toHaveBeenCalledTimes(0);
    testEndpoint(httpTestingController, requests, responses, 'PATCH', `/orders/${Orders.ONE_WATER_PLUS_TIP.id}`, '#cancel', '#cancel');
  }));

  it('should cancel products', fakeAsync(() => {
    service.cancelProduct(OrderItems.ONE_WATER, 0).subscribe((orderItem: OrderItem) => {
      expect(orderItem.equals(OrderItems.ONE_WATER_PATCHED)).toBeTruthy();
      resolved = true;
    });
    // No guest information on an order-panels item. Products, while realistically known, are not serialized fully in this view.
    // CategoryService would implicitly be called by ProductService.
    expect(guestService.list).toHaveBeenCalledTimes(0);
    expect(productService.list).toHaveBeenCalledTimes(1);
    expect(categoryService.list).toHaveBeenCalledTimes(0);
    testEndpoint(httpTestingController, requests, responses, 'PATCH', `/order_items/${OrderItems.ONE_WATER.id}`, '#cancel', '#cancel');
  }));
});
