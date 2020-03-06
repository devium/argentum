import {fakeAsync, TestBed} from '@angular/core/testing';

import {UserService} from './user.service';
import {GroupService} from './group.service';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {BaseInterceptor} from './base-interceptor';
import {of} from 'rxjs/internal/observable/of';
import createSpyObj = jasmine.createSpyObj;
import {User} from '../model/user';
import {expectArraysEqual, testEndpoint} from './test-utils';
import {Groups} from './test-data/groups';
import {Users} from './test-data/users';

fdescribe('UserService', () => {
  let service: UserService;
  let groupService: any;
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
    groupService = createSpyObj('GroupService', ['list']);
    groupService.list.and.returnValue(of(Groups.ALL));
    service = new UserService(http, groupService);
    resolved = false;
  });

  afterEach(() => {
    expect(resolved).toBeTruthy('Request callback was not called.');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    resolved = true;
  });

  it('should retrieve the current user but not groups when explicitly provided', fakeAsync(() => {
    service.me(Groups.ALL).subscribe((user: User) => {
      expect(user.equals(Users.RECEPTION));
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'GET', '/users/me');
    expect(groupService.list).toHaveBeenCalledTimes(0);
  }));

  it('should retrieve the current user and groups if none are provided', fakeAsync(() => {
    service.me().subscribe((user: User) => {
      expect(user.equals(Users.RECEPTION));
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'GET', '/users/me');
    expect(groupService.list).toHaveBeenCalled();
  }));

  it('should list all users', fakeAsync(() => {
    service.list().subscribe((users: User[]) => {
      expectArraysEqual(users, Users.ALL);
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'GET', '/users');
  }));

  it('should create a user', fakeAsync(() => {
    service.create(Users.BUFFET).subscribe((user: User) => {
      const userWithoutPw = <User>Users.BUFFET.clone();
      userWithoutPw.password = '';
      expect(user.equals(userWithoutPw)).toBeTruthy();
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'POST', '/users');
  }));

  it('should update a user', fakeAsync(() => {
    service.update(Users.WARDROBE_PATCHED).subscribe((user: User) => {
      const userWithoutPw = <User>Users.WARDROBE_PATCHED.clone();
      userWithoutPw.password = '';
      expect(user.equals(userWithoutPw)).toBeTruthy();
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'PATCH', `/users/${Users.WARDROBE.id}`);
  }));

  it('should delete a user', fakeAsync(() => {
    service.delete(Users.WARDROBE).subscribe(() => {
      resolved = true;
    });
    testEndpoint(httpTestingController, requests, responses, 'DELETE', `/users/${Users.WARDROBE.id}`);
  }));
});
