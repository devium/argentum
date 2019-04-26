import {environment} from '../../../environments/environment';
import {HttpTestingController, TestRequest} from '@angular/common/http/testing';
import {AbstractModel} from '../model/abstract-model';

export function testEndpoint(
  httpTestingController: HttpTestingController,
  requests: Object,
  responses: Object,
  method: string,
  url: string,
  identifierSuffix?: string,
): TestRequest {
  identifierSuffix = identifierSuffix ? identifierSuffix : '';
  const req = httpTestingController.expectOne(`${environment.apiUrl}${url}`);
  expect(req.request.method).toBe(method);

  const identifier = `${method}${url}${identifierSuffix}`;
  const requestBody = requests[identifier];
  expect(req.request.body).toEqual(requestBody === undefined ? null : requestBody);
  const responseBody = responses[identifier];
  req.flush(responseBody === undefined ? null : responseBody);
  return req;
}

export function expectArraysEqual(array1: Array<AbstractModel>, array2: Array<AbstractModel>) {
  expect(array1.length).toBe(array2.length);
  array1.forEach((model1: AbstractModel, index: number) => expect(model1.equals(array2[index])).toBeTruthy(model1.id));
}
