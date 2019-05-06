import {fakeAsync, TestBed} from '@angular/core/testing';

import {CategoryService} from './category.service';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {BaseInterceptor} from './base-interceptor';
import {Category} from '../model/category';
import {expectArraysEqual, testEndpoint} from './test-utils';
import {Categories} from './test-data/categories';

fdescribe('CategoryService', () => {
  let service: CategoryService;
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
    service = new CategoryService(http);
    resolved = false;
  });

  afterEach(() => {
    expect(resolved).toBeTruthy('Request callback was not called.');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    resolved = true;
  });

  it('should list all categories', fakeAsync(() => {
    service.list().subscribe((categories: Category[]) => {
      expectArraysEqual(categories, Categories.ALL);
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'GET', '/categories');
  }));

  it('should create a category', fakeAsync(() => {
    service.create(Categories.SPIRITS).subscribe((category: Category) => {
      expect(category.equals(Categories.SPIRITS)).toBeTruthy();
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'POST', '/categories');
  }));

  it('should update a category', fakeAsync(() => {
    service.update(Categories.SOFT_DRINKS_PATCHED).subscribe((category: Category) => {
      expect(category.equals(Categories.SOFT_DRINKS_PATCHED_REFERENCE)).toBeTruthy();
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'PATCH', `/categories/${Categories.SOFT_DRINKS.id}`);
  }));

  it('should delete a category', fakeAsync(() => {
    service.delete(Categories.HARD_DRINKS).subscribe(() => {
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'DELETE', `/categories/${Categories.HARD_DRINKS.id}`);
  }));
});
