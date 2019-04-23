import {environment} from '../../../environments/environment';
import {HttpTestingController} from '@angular/common/http/testing';

export function testEndpoint(
  httpTestingController: HttpTestingController,
  requests: Object,
  responses: Object,
  method: string,
  url: string,
  identifierSuffix?: string,
) {
  identifierSuffix = identifierSuffix ? identifierSuffix : '';
  const req = httpTestingController.expectOne(`${environment.apiUrl}${url}`);
  expect(req.request.method).toBe(method);

  const identifier = `${method}${url}${identifierSuffix}`;
  const requestBody = requests[identifier];
  if (requestBody) {
    expect(req.request.body).toEqual(requestBody);
  }
  const responseBody = responses[identifier];
  req.flush(responseBody === undefined ? null : responseBody);
}
