import {fakeAsync, TestBed} from '@angular/core/testing';

import {StatisticsService} from './statistics.service';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {BaseInterceptor} from './base-interceptor';
import {of} from 'rxjs';
import createSpyObj = jasmine.createSpyObj;
import {Products} from './test-data/products';
import {Statistics} from '../model/statistics';
import {TestStatistics} from './test-data/statistics';
import {testEndpoint} from './test-utils';

fdescribe('StatisticsService', () => {
  let service: StatisticsService;
  let productService: any;
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
    productService = createSpyObj('ProductService', ['list']);
    productService.list.and.returnValue(of(Products.ALL));
    service = new StatisticsService(http, productService);
    resolved = false;
  });

  afterEach(() => {
    expect(resolved).toBeTruthy('Request callback was not called.');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    resolved = true;
  });

  it('should list statistics', fakeAsync(() => {
    service.list().subscribe((statistics: Statistics) => {
      expect(statistics.equals(TestStatistics.STATISTICS)).toBeTruthy();
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'GET', '/statistics');
  }));
});
