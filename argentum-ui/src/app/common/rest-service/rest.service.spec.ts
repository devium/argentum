import { TestBed, inject } from '@angular/core/testing';
import { RestService } from './rest.service';
import { HttpModule, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

xdescribe('RestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RestService,
        { provide: XHRBackend, useClass: MockBackend }
      ],
      imports: [HttpModule]
    });
  });

  it('should ...', inject([RestService], (service: RestService) => {
    expect(service).toBeTruthy();
  }));
});
