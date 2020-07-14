import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentService } from '../environment.service';
import { TokenService } from '../../token';


describe('Shared -> Service EnvironmentService', () => {
  let environmentService;
  let httpMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [

        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [
        EnvironmentService,
        TokenService
      ]
    });

    environmentService = TestBed.inject(EnvironmentService);
    httpMock = TestBed.inject(HttpTestingController);

  });

  it('Should be defined', () => {
    expect(environmentService).toBeDefined();
  });

  it('Should return promise', () => {

    const data = environmentService.loadConfig();
    expect(data instanceof Promise).toEqual(true);
  });

  it('Should store config data', (done) => {

    const config = { 'api1': 'http://fake.com' };

    environmentService.loadConfig().then(() => {
      expect(environmentService.data).toEqual(config);
      done();
    });
    httpMock.expectOne('config.json').flush(config);
    httpMock.verify();
  });

});
