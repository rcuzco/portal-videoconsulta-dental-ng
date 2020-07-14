import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublisherComponent } from './publisher.component';
import { OpentokService } from '../../services/opentok';

const mockRoom = {
  roomTitle: 'title',
  attendantName: 'attendant',
  providedId: 'id',
  attendantNames: [],
  token: 'token'
};

fdescribe('PublisherComponent', () => {
  let component: PublisherComponent;
  let fixture: ComponentFixture<PublisherComponent>;
  const publisher = {
    publishAudio: () => { /* EMPTY BLOCK */ },
    publishVideo: () => { /* EMPTY BLOCK */ },
    on: (arg, callback) => { callback(); }
  };
  const response = {
    supported: true
  };
  const OT = {
    initPublisher(a, b, c) { c();
      return publisher; },
    checkScreenSharingCapability() { /* EMPTY BLOCK */ }
  };
  const opentokServiceStub = {
    getOT() {
      return OT;
    }
  };

  beforeEach(async(() => {
    spyOn(OT, 'initPublisher').and.callFake((a, b, c) => {
      console.log(a, b)
      console.log(c);
      if (c) {
        c();
      }
      return publisher;
    });
    spyOn(OT, 'checkScreenSharingCapability').and.callFake(() => response);
    TestBed.configureTestingModule({
      declarations: [ PublisherComponent ],
      providers: [ { provide: OpentokService, useValue: opentokServiceStub }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublisherComponent);
    component = fixture.componentInstance;
    component.session = jasmine.createSpyObj('OT.Session', ['on', 'publish']) as OT.Session;
    component.session['isConnected'] = () => false;
    component.session.publish = (arg, arg2) => {arg2(); };
    component.roomData = mockRoom;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call OT.initPublisher', () => {
    expect(OT.initPublisher).toHaveBeenCalled();
  });

  it('should call publish on the session when receiving sessionConnected', () => {
    spyOn(component.session, 'publish').and.callThrough();
    expect(component.session.publish).not.toHaveBeenCalled();
    expect(component.session.on).toHaveBeenCalled();
    (component.session.on as any).calls.mostRecent().args[1]();  // Execute the event handler
  });

  describe('buttons functions', () => {
    it('should control volume', () => {
      spyOn(component.toggleSubscriberAudio, 'emit').and.callThrough();
      component.subscriberAudioEnabled = false;
      component.settingsList[0].fn();
      expect(component.subscriberAudioEnabled).toBeTruthy();
      expect(component.toggleSubscriberAudio.emit).toHaveBeenCalledWith(true);
    });
    it('should activate mic', () => {
      component.audioEnabled = false;
      component.settingsList[1].fn();
      expect(component.audioEnabled).toBeTruthy();
    });
    it('should activate cam', () => {
      component.videoEnabled = false;
      component.settingsList[2].fn();
      expect(component.videoEnabled).toBeTruthy();
    });
    it('should activate full screen', () => {
      component.fullScreenEnabled = false;
      component.settingsList[3].fn();
      expect(component.fullScreenEnabled).toBeTruthy();
    });
    it('should hung up', () => {
      spyOn(component.hangUp, 'emit').and.callThrough();
      component.settingsList[5].fn();
      expect(component.hangUp.emit).toHaveBeenCalled();
    });
    it('should set icon off if not speaker activated', () => {
      component.subscriberAudioEnabled = true;
      component.settingsList[0].fn();
      expect(component.settingsList[0].icon).toEqual('speaker-off');
    });
    it('should set icon off if not speaker activated', () => {
      component.audioEnabled = true;
      component.settingsList[1].fn();
      expect(component.settingsList[1].icon).toEqual('mic-off');
    });
    it('should set icon off if not speaker activated', () => {
      component.videoEnabled = true;
      component.settingsList[2].fn();
      expect(component.settingsList[2].icon).toEqual('camera-off');
    });
    it('should set icon screen sharing', () => {
      spyOn(component, 'screenShare').and.callThrough();
      component.settingsList[4].fn();
      expect(component.screenShare).toHaveBeenCalled();
    });
  });

  describe('ngAfterViewInit', () => {
    it('should publish if session connected' , () => {
      spyOn(component, 'publish').and.callThrough();
      component.session['isConnected'] = () => true;
      component.ngAfterViewInit();
      expect(component.publish).toHaveBeenCalled();
    });
    it('should not publish if no session', () => {
      spyOn(component, 'publish').and.callThrough();
      component.session = null;
      component.ngAfterViewInit();
      expect(component.publish).not.toHaveBeenCalled();

    });
  });

  describe('toggleFullScreenPublisher', () => {
    it('Test', () => {
      spyOn(component.toggleFullScreenMiniature, 'emit');
      component.toggleFullScreenPublisher();
    });
  });

  describe('screenShare', () => {
    it('Test', () => {
      // expect(OT.checkScreenSharingCapability).toHaveBeenCalled();
      component.screenShare();
      expect(OT.initPublisher).toHaveBeenCalled();

    });
  });
});
