import {fakeAsync, TestBed} from '@angular/core/testing';

import {ProductService} from './product.service';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {BaseInterceptor} from './base-interceptor';
import createSpyObj = jasmine.createSpyObj;
import {expectArraysEqual, testEndpoint} from './test-utils';
import {Product} from '../model/product';
import {Products} from './test-data/products';
import {of} from 'rxjs';
import {Categories} from './test-data/categories';

fdescribe('ProductService', () => {
  let service: ProductService;
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
    categoryService.list.and.returnValue(of(Categories.ALL));
    service = new ProductService(http, categoryService);
    resolved = false;
  });

  afterEach(() => {
    expect(resolved).toBeTruthy('Request callback was not called.');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    resolved = true;
  });

  it('should list all products', fakeAsync(() => {
    service.list().subscribe((products: Product[]) => {
      expectArraysEqual(products, Products.ALL);
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'GET', '/products');
  }));

  it('should create a product with minimal information', fakeAsync(() => {
    service.create(Products.BEER_MIN).subscribe((product: Product) => {
      expect(product.equals(Products.BEER_MIN_REFERENCE)).toBeTruthy();
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'POST', '/products', '#min');
  }));

  it('should create a product with full information', fakeAsync(() => {
    service.create(Products.BEER_MAX).subscribe((product: Product) => {
      expect(product.equals(Products.BEER_MAX_REFERENCE)).toBeTruthy();
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'POST', '/products', '#max');
  }));

  it('should deprecate a product', fakeAsync(() => {
    service.deprecate(Products.WATER).subscribe((product: Product) => {
      expect(product.equals(Products.WATER_DEPRECATED_REFERENCE)).toBeTruthy();
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'PATCH', `/products/${Products.WATER.id}`, '#deprecate');
  }));

  it('should update a product', fakeAsync(() => {
    service.update(Products.WATER_PATCHED).subscribe((product: Product) => {
      expect(product.equals(Products.WATER_PATCHED_REFERENCE)).toBeTruthy();
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'PATCH', `/products/${Products.WATER.id}`);
  }));
});
