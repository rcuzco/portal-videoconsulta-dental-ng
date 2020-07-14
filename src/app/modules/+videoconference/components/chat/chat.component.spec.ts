import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { UtilsService, EnvironmentService } from '../../../../shared/services';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ElementRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { Message } from '../../models';
export class MockElementRef extends ElementRef {
  constructor() { super(null); }
}

describe('ChatComponent', () => {
  let component: ChatComponent;
  let elRef: ElementRef;
  let fixture: ComponentFixture<ChatComponent>;
  const environmentServiceMock = {
    data: {
      chat: {
        chunkFile: '1000',
        maxSizeFile: '2000000',
        typesFile: 'image/jpg,image/jpeg,application/pdf',
      },
    },
  };
  let utilsServiceStubSpy: jasmine.SpyObj<UtilsService>;

  beforeEach(async(() => {
    const spyUtilsService = jasmine.createSpyObj('UtilsService', ['blobToUrl', 'datatoBlob', 'openPDF', 'chunkString', 'readFile']);
    TestBed.configureTestingModule({
      declarations: [ChatComponent],
      providers: [
        { provide: EnvironmentService, useValue: environmentServiceMock },
        { provide: ElementRef, useValue: MockElementRef },
        { provide: UtilsService, useValue: spyUtilsService },
        FormBuilder,
      ],
      imports: [ReactiveFormsModule, FormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    elRef = TestBed.get(ElementRef);
    utilsServiceStubSpy = TestBed.get(UtilsService);
    utilsServiceStubSpy.datatoBlob.and.returnValue(of(new Blob()));
    utilsServiceStubSpy.openPDF.and.callThrough();
    utilsServiceStubSpy.chunkString.and.returnValue(['chunk']);
    utilsServiceStubSpy.blobToUrl.and.returnValue('fakeUrl');
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    component.chatMessages = [];
    component.typesFile = environmentServiceMock.data.chat.typesFile;
    component.session = jasmine.createSpyObj('OT.Session', ['on', 'signal']) as OT.Session;
    component.session.connection = jasmine.createSpyObj('OT.Connection', [], ['connectionId']) as OT.Connection;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit', () => {
    const spy = spyOn(component, 'loadSignal');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('addFiles', () => {
    utilsServiceStubSpy.readFile.and.returnValue(of({
      chunks: ['a'],
      type: '',
      name: '',
    }));
    spyOn(component, 'sendFile').and.callThrough();
    const event = { target: { files: [new Blob([{ size: 2, type: 'application/pdf', byteLength: 2, byteOffset: 1, buffer: new ArrayBuffer(8) }])] } };
    component.addFiles(event);
    expect(component.sendFile).toHaveBeenCalledWith(event.target);
  });

  describe('buildImgMessage', () => {
    it('should push image to chat', () => {
      component.buildImgMessage({ owner: 'mine' }, 'data');
      expect(component.chatMessages).toEqual([{ owner: 'mine', fileName: 'data', img: 'fakeUrl' }]);
    });
  });

  describe('buildMessage', () => {
    it('should set owner mine if owner', () => {
      component.session.connection = {
        connectionId: '1',
        creationTime: 1,
        data: 'data'
      };
      const event = {
        type: 'signal:file-image-end',
        data: 'xxxxxx::data',
        from: {
          connectionId: '1'
        }
      };
      component.buildMessage(event);
      expect(component.chatMessages[0].owner).toEqual('mine');
    });
    it('should set owner theirs if not owner', () => {
      component.session.connection = {
        connectionId: '2',
        creationTime: 1,
        data: 'data'
      };
      const event = {
        type: 'signal:file-image-end',
        data: 'xxxxxx::data',
        from: {
          connectionId: '1'
        }
      };
      component.buildMessage(event);
      expect(component.chatMessages[0].owner).toEqual('theirs');
    });
  });

  describe('buildPDFMessage', () => {
    it('should push pdf to chat', () => {
      component.completeFile = 'file';
      component.buildPDFMessage({ owner: 'mine' }, 'data');
      expect(component.chatMessages).toEqual([{ owner: 'mine', fileName: 'data', doc: 'file' }]);
    });
  });

  describe('buildTextMessage', () => {
    it('should push pdf to chat', () => {
      component.completeFile = 'file';
      component.buildTextMessage({ owner: 'mine' }, 'data');
      expect(component.chatMessages).toEqual([{ owner: 'mine', text: 'data' }]);
    });
  });

  describe('getSmallChat', () => {
    it('getSmallChat bubbleChat', () => {
      component.bubbleChat = true;
      spyOn(component.toggleChat, 'emit');
      component.getSmallChat();
      expect(component.toggleChat.emit).toHaveBeenCalled();
    });
    it('getSmallChat !bubbleChat', () => {
      component.bubbleChat = false;
      spyOn(component.toggleChat, 'emit');
      component.getSmallChat();
      expect(component.toggleChat.emit).toHaveBeenCalled();
    });
  });

  describe('loadSignal', () => {
    it('should add to completeFile data if signal file', () => {
      spyOn(component, 'getMessageData').and.callThrough();
      const event = {
        type: 'signal:file',
        data: 'xxxxxx',
        from: {
          connectionId: '1'
        }
      };
      (component.session.on as any).calls.mostRecent().args[1](event);
      component.loadSignal();
      expect(component.getMessageData).toHaveBeenCalledWith(event.data);
    });
    it('should call buildMessage if other signal', () => {
      spyOn(component, 'buildMessage').and.callThrough();
      const event = {
        type: 'signal:msg',
        data: 'xxxxxx',
        from: {
          connectionId: '1'
        }
      };
      (component.session.on as any).calls.mostRecent().args[1](event);
      component.loadSignal();
      expect(component.buildMessage).toHaveBeenCalledWith(event);
    });
  });

  it('onSubmit', () => {
    spyOn(component, 'sendMessage').and.callThrough();
    component.ngOnInit();
    component.formChat.controls.textChat.setValue('MESSAGE');
    component.onSubmit();
    expect(component.sendMessage).toHaveBeenCalledWith('MESSAGE', 'msg');
  });

  describe('sendMessage', () => {
    it('sendMessage signal correct', () => {
      const type = 'signal:file-pdf';
      const message = 'mensaje';
      component.sendMessage(message, type);
      (component.session.signal as any).calls.mostRecent().args[1]();
      expect(component.formChat.controls.textChat.value).toEqual('');
      expect(component.formChat.controls.file.value).toEqual('');
    });

    it('sendMessage signal error', () => {
      const type = 'signal:file-pdf';
      const message = 'mensaje';
      component.sendMessage(message, type);
      expect(component.session.signal).toHaveBeenCalled();
      (component.session.signal as any).calls.mostRecent().args[1]({name: 'error', message: 'No se ha enviado correctamente'});  // Execute the event handler
    });
  });

  describe('sendFile', () => {
    it('should send message if pdf', () => {
      spyOn(component, 'sendMessage').and.callThrough();
      utilsServiceStubSpy.readFile.and.returnValue(of({
        chunks: ['a'],
        type: 'application/pdf',
        name: 'name',
      }));
      component.sendFile('file');
      expect(component.sendMessage).toHaveBeenCalledWith('name', 'file-pdf-end');
    });
    it('should send message if img', () => {
      spyOn(component, 'sendMessage').and.callThrough();
      utilsServiceStubSpy.readFile.and.returnValue(of({
        chunks: ['a'],
        type: 'image/jpg',
        name: 'name',
      }));
      component.sendFile('file');
      expect(component.sendMessage).toHaveBeenCalledWith('name', 'file-image-end');
    });
    it('should set error size ', () => {
      utilsServiceStubSpy.readFile.and.returnValue(throwError('errorSize'));
      component.sendFile('file');
      expect(component.showAlertSizeFile).toBeTruthy();
    });
    it('should set error type', () => {
      utilsServiceStubSpy.readFile.and.returnValue(throwError('errorType'));
      component.sendFile('file');
      expect(component.showAlertTypeFile).toBeTruthy();
    });
  });

  describe('showPDF', () => {
    it('should call utils.openPDF', () => {
      component.showPDF('file', 'name');
      expect(utilsServiceStubSpy.openPDF).toHaveBeenCalledWith('file', 'name');
    });
  });

  describe('toggleAlerts', () => {
    it('should toggle alert size', () => {
      component.toggleAlertSizeFile();
      expect(component.showAlertSizeFile).toBeTruthy();
    });
    it('should toggle alert type', () => {
      component.toggleAlertTypeFile();
      expect(component.showAlertTypeFile).toBeTruthy();
    });
  });

  // describe('sendFile', () => {
  //   it('sendFile pattern.length !== 0 && application/pdf', () => {
  //     spyOn(component, 'sendMessage').and.callThrough();
  //     const mockFile = new File([new Blob([{ size: 100000, byteLength: 2, byteOffset: 1, buffer: new ArrayBuffer(8) }])], 'filename', { type: 'application/pdf' });
  //     const file = {files: [mockFile]};
  //     component.sendFile(file);
  //     expect(component.showAlertSizeFile).toBeFalsy();
  //   });

  //   it('sendFile pattern.length !== 0 && image/jpg', () => {
  //     spyOn(component, 'sendMessage').and.callThrough();
  //     const mockFile = new File([new Blob([{ size: 100000, byteLength: 2, byteOffset: 1, buffer: new ArrayBuffer(8) }])], 'filename', { type: 'image/jpg' });
  //     const file = {files: [mockFile]};
  //     component.sendFile(file);
  //     expect(component.showAlertSizeFile).toBeFalsy();
  //   });

  //   it('sendFile pattern.length === 0 && image/jpeg', () => {
  //     spyOn(component, 'sendMessage').and.callThrough();
  //     const mockFile = new File([new Blob([{ size: 100000, byteLength: 2, byteOffset: 1, buffer: new ArrayBuffer(8) }])], 'filename', { type: 'image/jpeg' });
  //     const file = {files: [mockFile]};
  //     component.sendFile(file);
  //     expect(component.sendFile(file)).toBeUndefined();
  //   });

  //   it('sendFile pattern.length === 0 && default', () => {
  //     spyOn(component, 'sendMessage').and.callThrough();
  //     const mockFile = new File([new Blob([{ size: 100000, byteLength: 2, byteOffset: 1, buffer: new ArrayBuffer(8) }])], 'filename', { type: 'default' });
  //     const file = {files: [mockFile]};
  //     expect(component.sendFile(file)).toBeUndefined();
  //   });

  //   it('sendFile file.size > this.envConf.data.chat.maxSizeFile', () => {
  //     spyOn(component, 'sendMessage').and.callThrough();
  //     const file = {files: [{ size: 3000000, type: 'application/pdf'}]};
  //     expect(component.sendFile(file)).toBeUndefined();
  //     expect(component.showAlertSizeFile).toBeTruthy();
  //   });

  // });

  // it('addFiles', () => {
  //   spyOn(component, 'sendFile').and.callThrough();
  //   const event = {target: {files: [new Blob([{ size: 2, type: 'application/pdf', byteLength: 2, byteOffset: 1, buffer: new ArrayBuffer(8) }])]}};
  //   component.addFiles(event);
  //   expect(component.sendFile).toHaveBeenCalledWith(event.target);
  // });

  // describe('getSmallChat', () => {
  //   it('getSmallChat bubbleChat', () => {
  //     component.bubbleChat = true;
  //     spyOn(component.toggleChat, 'emit');
  //     component.getSmallChat();
  //     expect(component.toggleChat.emit).toHaveBeenCalled();
  //   });
  //   it('getSmallChat !bubbleChat', () => {
  //     component.bubbleChat = false;
  //     spyOn(component.toggleChat, 'emit');
  //     component.getSmallChat();
  //     expect(component.toggleChat.emit).toHaveBeenCalled();
  //   });
  // });
});
