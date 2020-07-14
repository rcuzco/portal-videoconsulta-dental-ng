import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { TokenService } from './../../token/token.service';

import { RestInterceptor } from './../rest.interceptor';

describe(`RESTHttpInterceptor`, () => {
  let httpMock: HttpTestingController;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HttpClient,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: RestInterceptor,
          multi: true,
        },
        TokenService
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });


  it('should not add an Authorization header', (done) => {
    const fakeUrl = 'http://fakeUrl.com';
    spyOn(TokenService.prototype, 'getToken').and.returnValue(null);
    http.get(fakeUrl).subscribe(response => {
      expect(fakeUrl).toBeTruthy();
      expect(httpRequest.request.headers.has('Authorization')).toBe(false);
      done();
    });

    const httpRequest = httpMock.expectOne(`${fakeUrl}`);
    httpRequest.flush({});
    httpMock.verify();
  });


  it('should  add an Authorization header', (done) => {
    const fakeUrl = 'http://fakeUrl.com';
    spyOn(TokenService.prototype, 'getToken').and.returnValue('hola');

    http.get(fakeUrl).subscribe(response => {
      expect(fakeUrl).toBeTruthy();
      expect(httpRequest.request.headers.has('Authorization')).toBe(true);
      done();
    });

    const httpRequest = httpMock.expectOne(`${fakeUrl}`);
    httpRequest.flush({});
    httpMock.verify();
  });

  it('should throw error', () => {
    const fakeUrl = 'http://fakeUrl.com';
    spyOn(TokenService.prototype, 'getToken').and.returnValue('token');
    const mockErrorResponse = { status: 400, statusText: 'GENERIC ERROR' };

    http.get(fakeUrl).subscribe(response => {/* EMPTY */}, error => {
      expect(error.statusText).toEqual('GENERIC ERROR');
    });

    httpMock.expectOne(`${fakeUrl}`).flush('', mockErrorResponse);
    httpMock.verify();

  });
});
