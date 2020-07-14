import { TestBed, inject } from '@angular/core/testing';

import { UtilsService } from '../utils.service';
import { DomSanitizer } from '@angular/platform-browser';
import { EnvironmentService } from '../../environment';

const mockEnviromentService = {
  data: {
    chat: {
      chunkFile: '1000',
      maxSizeFile: '2000000',
      typesFile: 'image/jpg,image/jpeg,application/pdf'
    }
  }
};

describe('shared -> UtilsService', () => {
  let utilsService: UtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UtilsService,
        DomSanitizer,
        {provide: EnvironmentService, useValue: mockEnviromentService}
      ]
    });

    utilsService = TestBed.inject(UtilsService);
  });

  it('Should be defined', () => {
    expect(utilsService).toBeDefined();
  });

  it('Should be return copy of object but is not the same object', () => {
    const obj = {
      a: {
        b: 1,
        c: {
          d: 4
        }
      }
    };

    const newObj = utilsService.copyDeepObject(obj);

    expect(obj).toEqual(newObj);
    expect(obj).not.toBe(newObj);

  });

  it('Should be return copy of object but is not the same object', () => {
    const exampleDate = new Date('2019-05-15');
    const exampleMap = new Map();
    exampleMap.set('example', 0);
    const aux = [
      { d: 4 }, { d: 5 }
    ];

    const obj = {
      a: {
        b: 1,
        c: aux,
        exampleDate,
        exampleMap,
        exampleUndefined: null
      }
    };

    const newObj = utilsService.copyDeepObject(obj);

    expect(obj).toEqual(newObj);
    expect(obj).not.toBe(newObj);

    obj.a.c[1] = { d: 10 };

    expect(obj).not.toEqual(newObj);

  });

  describe('chunkString', () => {
    it('chunkString', () => {
      utilsService.chunkString('xxxxxxx', 2);
    });
  });

  describe('openPdf', () => {
    it('should msSaveOrOpenBlob id navigator has msSaveOrOpenBlob function', () => {
      spyOnProperty(window, 'navigator').and.returnValue({ msSaveOrOpenBlob: jasmine.createSpy() });
      utilsService.openPDF('data', 'file');
      expect(window.navigator.msSaveOrOpenBlob).toHaveBeenCalled();
    });
    it('should console log if user agent match FxiOS', () => {
      spyOnProperty(window, 'navigator').and.returnValue({ userAgent: 'ssFxiOSss' });
      spyOn(console, 'log').and.callThrough();
      utilsService.openPDF('data', 'file');
      expect(console.log).toHaveBeenCalledWith('Cannot display on FF iOS');
    });
    it('should use file reader if user agent match CriOS', () => {
      spyOnProperty(window, 'navigator').and.returnValue({ userAgent: 'ssCriOSss' });
      utilsService.openPDF('data', 'file');
    });
    it('should window location href if is an Ipad', () => {
      spyOnProperty(window, 'navigator').and.returnValue({ userAgent: 'iPad' });
      utilsService.openPDF('data', 'file');
    });
    it('should window location href if is an Iphone', () => {
      spyOnProperty(window, 'navigator').and.returnValue({ userAgent: 'iPhone' });
      utilsService.openPDF('data', 'file');
    });
    it('should window open if not previous', () => {
      spyOn(URL, 'createObjectURL').and.returnValue('url');
      spyOn(window, 'open');
      utilsService.openPDF('data', 'file');
      expect(window.open).toHaveBeenCalledWith('url', '_blank');
    });
  });
});
