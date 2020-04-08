import {fakeAsync, TestBed} from '@angular/core/testing';

import {ProductRangeService} from './product-range.service';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {BaseInterceptor} from './base-interceptor';
import {of} from 'rxjs';
import createSpyObj = jasmine.createSpyObj;
import {ProductRange} from '../model/product-range';
import {expectArraysEqual, testEndpoint} from './test-utils';
import {Categories} from './test-data/categories';
import {Products} from './test-data/products';
import {ProductRanges} from './test-data/product-ranges';

describe('ProductRangeService', () => {
  let service: ProductRangeService;
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
    http = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    categoryService = createSpyObj('CategoryService', ['list']);
    categoryService.list.and.returnValue(of(Categories.ALL));
    service = new ProductRangeService(http, categoryService);
    resolved = false;
  });

  afterEach(() => {
    expect(resolved).toBeTruthy('Request callback was not called.');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    resolved = true;
  });

  it('should list all product ranges', fakeAsync(() => {
    service.list().subscribe((productRanges: ProductRange[]) => {
      expectArraysEqual(productRanges, ProductRanges.ALL_META);
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'GET', '/product_ranges');
  }));

  it('should retrieve a product range including its products', fakeAsync(() => {
    service.retrieve(ProductRanges.JUST_WATER.id).subscribe((productRange: ProductRange) => {
      expect(productRange.equals(ProductRanges.JUST_WATER)).toBeTruthy();
      // Manually check if all product fields have been parsed correctly.
      expect(productRange.products[0].equals(Products.WATER));
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'GET', `/product_ranges/${ProductRanges.JUST_WATER.id}`);
  }));

  it('should create a product range', fakeAsync(() => {
    service.create(ProductRanges.JUST_COKE_META).subscribe((productRange: ProductRange) => {
      expect(productRange.equals(ProductRanges.JUST_COKE_META)).toBeTruthy();
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'POST', '/product_ranges');
  }));

  it('should update a product range', fakeAsync(() => {
    service.update(ProductRanges.JUST_WATER_PATCHED_META).subscribe((productRange: ProductRange) => {
      expect(productRange.equals(ProductRanges.JUST_WATER_PATCHED_META)).toBeTruthy();
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'PATCH', `/product_ranges/${ProductRanges.JUST_WATER_PATCHED_META.id}`);
  }));

  it('should delete a product range', fakeAsync(() => {
    service.delete(ProductRanges.JUST_WATER_META).subscribe(() => {
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'DELETE', `/product_ranges/${ProductRanges.JUST_WATER_META.id}`);
  }));
});
