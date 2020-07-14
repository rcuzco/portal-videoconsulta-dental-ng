
import { TestBed, async } from '@angular/core/testing';
import { VideoconferenceMainComponent } from '../videoconference-main.component';
import { PublisherComponent } from '../../publisher/publisher.component';
import { SubscriberComponent } from '../../subscriber/subscriber.component';
import { OpentokService } from '../../../services/opentok';
import { EnvironmentService } from '../../../../../shared/services';
import { ActivatedRoute } from '@angular/router';
import { Observable, from, of, throwError } from 'rxjs';
import { RoomService } from '../../../services';
import { Room } from '../../../models';
import { TranslateModule } from '@ngx-translate/core';

describe('VideoconferenceMainComponent', () => {
  let roomServiceStubSpy: jasmine.SpyObj<RoomService>;
  let fixture;
  let session;
  let app;
  let opentokService;
  const OT = {
    initSession() {/*EMPTY BLOCK*/ },
    initPublisher() {/*EMPTY BLOCK*/ }
  };
  const mockRoom = {
    roomTitle: 'title',
    attendantName: 'attendant',
    providedId: 'id',
    attendantNames: [],
    token: 'token'
  };

  beforeEach(async(() => {
    session = jasmine.createSpyObj('session', ['connect', 'on', 'subscribe', 'isConnected', 'disconnect', 'signal']);
    const spyRoomService = jasmine.createSpyObj('RoomService', ['accessRoom']);
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        VideoconferenceMainComponent,
        PublisherComponent,
        SubscriberComponent,
      ],
      providers: [
        OpentokService,
        { provide: EnvironmentService, useValue: { data: { tokbox: {} } } },
        { provide: ActivatedRoute, useValue: { queryParams: of({ access: 1 })}},
        { provide: RoomService, useValue: spyRoomService}
      ]
    }).compileComponents();
    roomServiceStubSpy = TestBed.get(RoomService);
    roomServiceStubSpy.accessRoom.and.returnValue(of(mockRoom));
    fixture = TestBed.createComponent(VideoconferenceMainComponent);
    opentokService = fixture.debugElement.injector.get(OpentokService);
    spyOn(opentokService, 'getOT').and.returnValue(OT);
    opentokService.session = session;
    spyOn(opentokService, 'initSession').and.returnValue(Promise.resolve(session));
    app = fixture.debugElement.componentInstance;
    app.screenShareFrame = false;
    fixture.detectChanges();
  }));
  it('should create the app', () => {
    expect(app).toBeTruthy();
  });
  it('should have called initSession on the opentokService', () => {
    expect(app.session).toBe(session);
    expect(opentokService.initSession).toHaveBeenCalled();
  });
  it('should populate the streams when we get a streamCreated', () => {
    expect(app.streams).toEqual([]);
    expect(session.on).toHaveBeenCalledWith('streamCreated', jasmine.any(Function));
    expect(session.on).toHaveBeenCalledWith('streamDestroyed', jasmine.any(Function));
    const stream = {};
    const event = {
      stream
    };
    session.on.calls.argsFor(0)[1](event); // Call streamCreated handler
    expect(app.streams).toEqual([stream]);
    session.on.calls.argsFor(1)[1](event); // Call streamDestroyed handler
    expect(app.streams).toEqual([]);
  });
  describe('handleRoomError', () => {
    it('should set disconnected status if meeting is over', () => {
      roomServiceStubSpy.accessRoom.and.returnValue(throwError({status: 410, error: {}}));
      app.ngOnInit();
      expect(app.titlePage).toEqual('WAITING_ROOM.TITLE');
      expect(app.disconnected).toEqual('over');
    });
    it('should set disconnected status if not started and set room shedule', () => {
      roomServiceStubSpy.accessRoom.and.returnValue(throwError({status: 400, error: {delta: 1, startsAt: new Date('2015-03-03')}}));
      app.ngOnInit();
      expect(app.titlePage).toEqual('WAITING_ROOM.TITLE');
      expect(app.disconnected).toEqual('not_started');
      expect(app.roomSchedule).toEqual({delta: 1, startsAt: new Date('2015-03-03')});
    });
  });

  describe('toggle elements', () => {
    it('should toggle full screen', () => {
      app.toggleFullScreen('ev');
      expect(app.fullScreen).toEqual('ev');
    });
    it('should toggle subscriber audio', () => {
      app.toggleSubscriberAudio('ev');
      expect(app.subscriberAudio).toEqual('ev');
    });
    it('should toggle chat', () => {
      app.toggleChat('ev');
      expect(app.openChatBubble).toEqual('ev');
    });
    it('should toggle full desktop publisher', () => {
      app.fullDesktopPublisher = false;
      app.toggleFullDeskTopPublisher();
      expect(app.fullDesktopPublisher).toBeTruthy();
    });
    it('should toggle full screen', () => {
      app.fullScreenPublisher = false;
      app.toggleFullScreenPublisher();
      expect(app.fullScreenPublisher).toBeTruthy();
    });
  });

  describe('order streams', () => {
    it('should return index', () => {
      expect(app.orderStreams(1)).toEqual(1);
    });
  });

  describe('hung up', () => {
    it('should call signal hung up', () => {
      app.hungUp();
      expect(app.session.signal).toHaveBeenCalled();
      (app.session.signal as any).calls.mostRecent().args[1]();
    });
  });

  describe('connect', () => {
    it('should call init session with saved room data', () => {
      app.roomData = mockRoom;
      app.connect();
      expect(opentokService.initSession).toHaveBeenCalledWith(mockRoom);
    });
  });
  describe('toggleShareFrame', () => {
    it('should call toggleShareFrame', () => {
      app.toggleShareFrame();
      expect(app.screenShareFrame).toBeTruthy();
    });
  });

});
