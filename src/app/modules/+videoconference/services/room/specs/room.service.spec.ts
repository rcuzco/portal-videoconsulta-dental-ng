import { TestBed, inject } from '@angular/core/testing';

import { RoomService } from '../room.service';
import { EnvironmentService } from '../../../../../shared/services';
import { of } from 'rxjs';
import { Room } from '../../../models';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';


describe('RoomService', () => {
  let httpClientStubSpy: jasmine.SpyObj<HttpClient>;
  beforeEach(() => {
    const spyHttpClient = jasmine.createSpyObj('HttpClient', ['put']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RoomService,
        { provide: EnvironmentService, useValue: { data: { apiUrl: 'baseUrl', tokbox: {} } } },
        {provide: HttpClient, useValue: spyHttpClient}
      ]
    });
    httpClientStubSpy = TestBed.get(HttpClient);
    httpClientStubSpy.put.and.returnValue(of(true));
  });

  describe('service', () => {
    let service;
    beforeEach(inject([RoomService], (s: RoomService) => {
      service = s;
    }));

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should access room', () => {
      service.accessRoom('id');
      expect(httpClientStubSpy.put).toHaveBeenCalledWith('baseUrl/rooms/accesses/id', {});
    });
  });
});
