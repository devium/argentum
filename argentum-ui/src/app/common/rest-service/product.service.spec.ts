import {fakeAsync, TestBed} from '@angular/core/testing';

import {ProductService} from './product.service';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {BaseInterceptor} from './base-interceptor';
import createSpyObj = jasmine.createSpyObj;
import {CATEGORIES_ALL} from './test-data/categories';
import {testEndpoint} from './test-utils';
import {Product} from '../model/product';
import {
  PRODUCT_BEER_MAX,
  PRODUCT_BEER_MAX_REFERENCE,
  PRODUCT_BEER_MIN,
  PRODUCT_BEER_MIN_REFERENCE, PRODUCT_WATER, PRODUCT_WATER_PATCHED, PRODUCT_WATER_PATCHED_REFERENCE,
  PRODUCTS_ALL
} from './test-data/products';
import {of} from 'rxjs';

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
    categoryService.list.and.returnValue(of(CATEGORIES_ALL));
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
      expect(products.length).toBe(PRODUCTS_ALL.length);
      products.forEach((product: Product, index: number) => expect(product.equals(PRODUCTS_ALL[index])).toBeTruthy(product.id));
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'GET', '/products');
  }));

  it('should create a product with minimal information', fakeAsync(() => {
    service.create(PRODUCT_BEER_MIN).subscribe((product: Product) => {
      expect(product.equals(PRODUCT_BEER_MIN_REFERENCE)).toBeTruthy();
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'POST', '/products', '#min');
  }));

  it('should create a product with full information', fakeAsync(() => {
    service.create(PRODUCT_BEER_MAX).subscribe((product: Product) => {
      expect(product.equals(PRODUCT_BEER_MAX_REFERENCE)).toBeTruthy();
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'POST', '/products', '#max');
  }));

  it('should update a product', fakeAsync(() => {
    service.update(PRODUCT_WATER_PATCHED).subscribe((product: Product) => {
      expect(product.equals(PRODUCT_WATER_PATCHED_REFERENCE)).toBeTruthy();
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'PATCH', `/products/${PRODUCT_WATER.id}`);
  }));
});
