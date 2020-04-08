import {environment} from '../../../environments/environment';
import {HttpTestingController, TestRequest} from '@angular/common/http/testing';
import {AbstractModel} from '../model/abstract-model';

export function testEndpoint(
  httpTestingController: HttpTestingController,
  requests: Object,
  responses: Object,
  method: string,
  url: string,
  requestSuffix?: string,
  responseSuffix?: string
): TestRequest {
  requestSuffix = requestSuffix ? requestSuffix : '';
  responseSuffix = responseSuffix ? responseSuffix : '';
  const req = httpTestingController.expectOne(`${environment.apiUrl}${url}`);
  expect(req.request.method).toBe(method);

  // Remove detail part of URL for the identifier.
  const re = RegExp('^(.+?/?)(\\d+)?$');
  const noDetailUrl = re.exec(url)[1];
  const identifier = `${method}${noDetailUrl}`;
  const requestBody = requests[identifier + requestSuffix];

  expect(req.request.body).toEqual(requestBody === undefined ? null : requestBody, `Request body mismatch for ${identifier}`);

  const responseBody = responses[identifier + responseSuffix];
  req.flush(responseBody === undefined ? null : responseBody);

  return req;
}

export function expectArraysEqual(array1: Array<AbstractModel>, array2: Array<AbstractModel>) {
  expect(array1.length).toBe(array2.length);
  array1.forEach((model1: AbstractModel, index: number) => expect(model1.equals(array2[index])).toBeTruthy(
    `Mismatch between models with IDs ${model1.id} and ${array2[index].id}`
  ));
}
