import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TokenService } from '../../token';
import { PropertiesService } from '../properties.service';
import { of } from 'rxjs';
import * as GlobalEnvironment from '../../../../../environments/environment';



describe('Shared -> Service PropertiesService', () => {
  let service;
  let httpClientStubSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    const spyHttpClient = jasmine.createSpyObj('HttpClient', ['get']);
    TestBed.configureTestingModule({
      imports: [

        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [
        PropertiesService,
        {provide: HttpClient, useValue: spyHttpClient}
      ]
    });

    service = TestBed.inject(PropertiesService);
    httpClientStubSpy = TestBed.get(HttpClient);
    httpClientStubSpy.get.and.returnValue(of(true));
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('loadProps', () => {
    it('should not load if not prod', () => {
      service.loadProps().then(res => {
        expect(res).toBeUndefined();
      });
    });
    it('should not load if prod', () => {
      GlobalEnvironment.environment.production = true;
      service.loadProps().then(res => {
        expect(res).toBeTruthy();
      });
    });
  });

});
