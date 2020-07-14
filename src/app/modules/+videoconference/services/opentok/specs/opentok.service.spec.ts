import { TestBed, inject } from '@angular/core/testing';
import * as OT from '@opentok/client';

import { OpentokService } from './../opentok.service';
import { EnvironmentService, Environment } from '../../../../../shared/services';

const mockEnviromentService = {
  data: {
    tokbox: {
      API_KEY: 'apiKey',
      SESSION_ID: 'sessionId',
      TOKEN: 'token'
    }
  }
};

const mockRoom = {
  roomTitle: 'title',
  attendantName: 'attendant',
  providedId: 'id',
  attendantNames: [],
  token: 'token'
};

describe('OpentokService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OpentokService,
        { provide: EnvironmentService, useValue: mockEnviromentService }
      ]
    });
  });

  describe('service', () => {
    let service;
    beforeEach(inject([OpentokService], (s: OpentokService) => {
      service = s;
    }));

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('getOT() should return OT', () => {
      expect(service.getOT()).toEqual(OT);
    });

    describe('initSession()', () => {
      const mockOT = {
        initSession() {/* EMPTY BLOCK */ }
      };
      let session;

      beforeEach(() => {
        spyOn(service, 'getOT').and.returnValue(mockOT);
        session = jasmine.createSpyObj('session', ['connect', 'on']);
        spyOn(mockOT, 'initSession').and.returnValue(session);
      });

      it('should call OT.initSession', () => {
        service.initSession(mockRoom);
        expect(service.session).toEqual(session);
      });

      it('connect should call connect', () => {
        service.initSession(mockRoom);
        service.connect();
        expect(service.session.connect).toHaveBeenCalledWith(mockEnviromentService.data.tokbox.TOKEN, jasmine.any(Function));
      });
      it('should excute if error', () => {
        service.initSession(mockRoom);
        service.session.connect.and.callFake((arg, arg2) => {
          return arg2(arg);
        });
        service.connect();
      });
    });
  });
});
