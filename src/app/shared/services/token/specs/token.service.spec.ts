import { TestBed, inject } from '@angular/core/testing';

import { TokenService } from '../token.service';

describe('shared -> TokenService', () => {

  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TokenService
      ]
    });

    tokenService = TestBed.inject(TokenService);

  });

  it('Should be defined', () => {
    expect(tokenService).toBeDefined();
  });

  it('Should be token setted in sessionStorage after setToken', () => {
    const token = 'testToken';
    tokenService.setToken(token);

    const expectedResult = JSON.parse(sessionStorage.getItem('SASTOKEN'));

    expect(token).toEqual(expectedResult);

  });

  it('Should be token returned is same of setted previosly', () => {
    const token = 'testToken';
    sessionStorage.setItem('SASTOKEN', (JSON.stringify(token)));

    const tokenReturned = tokenService.getToken();
    expect(token).toEqual(tokenReturned);

    const tokenReturned2 = tokenService.getToken();

    expect(token).toEqual(tokenReturned2);

  });

});
