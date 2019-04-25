import {fakeAsync, TestBed} from '@angular/core/testing';

import {ProductRangeService} from './product-range.service';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {BaseInterceptor} from './base-interceptor';
import {of} from 'rxjs';
import {CATEGORIES_ALL} from './test-data/categories';
import createSpyObj = jasmine.createSpyObj;
import {ProductRange} from '../model/product-range';
import {
  PRODUCT_RANGE_JUST_COKE_META,
  PRODUCT_RANGE_JUST_WATER, PRODUCT_RANGE_JUST_WATER_META,
  PRODUCT_RANGE_JUST_WATER_PATCHED_META,
  PRODUCT_RANGES_ALL_META
} from './test-data/product-ranges';
import {testEndpoint} from './test-utils';
import {PRODUCT_WATER} from './test-data/products';

fdescribe('ProductRangeService', () => {
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
    resolved = false;
    http = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    categoryService = createSpyObj('CategoryService', ['list']);
    categoryService.list.and.returnValue(of(CATEGORIES_ALL));
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
      expect(productRanges.length).toBe(PRODUCT_RANGES_ALL_META.length);
      productRanges.forEach(
        (productRange: ProductRange, index: number) =>
          expect(productRange.equals(PRODUCT_RANGES_ALL_META[index])).toBeTruthy(productRange.id)
      );
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'GET', '/product_ranges');
  }));

  it('should retrieve a product range including its products', fakeAsync(() => {
    service.retrieve(PRODUCT_RANGE_JUST_WATER.id).subscribe((productRange: ProductRange) => {
      expect(productRange.equals(PRODUCT_RANGE_JUST_WATER)).toBeTruthy();
      // Manually check if all product fields have been parsed correctly.
      expect(productRange.products[0].equals(PRODUCT_WATER));
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'GET', `/product_ranges/${PRODUCT_RANGE_JUST_WATER.id}`);
  }));

  it('should create a product range', fakeAsync(() => {
    service.create(PRODUCT_RANGE_JUST_COKE_META).subscribe((productRange: ProductRange) => {
      expect(productRange.equals(PRODUCT_RANGE_JUST_COKE_META)).toBeTruthy();
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'POST', '/product_ranges');
  }));

  it('should update a product range', fakeAsync(() => {
    service.update(PRODUCT_RANGE_JUST_WATER_PATCHED_META).subscribe((productRange: ProductRange) => {
      expect(productRange.equals(PRODUCT_RANGE_JUST_WATER_PATCHED_META)).toBeTruthy();
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'PATCH', `/product_ranges/${PRODUCT_RANGE_JUST_WATER_META.id}`);
  }));

  it('should delete a product range', fakeAsync(() => {
    service.delete(PRODUCT_RANGE_JUST_WATER_META).subscribe(() => {
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'DELETE', `/product_ranges/${PRODUCT_RANGE_JUST_WATER_META.id}`);
  }));
});
