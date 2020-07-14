import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriberComponent } from './subscriber.component';
import { of } from 'rxjs';

describe('SubscriberComponent', () => {
  let component: SubscriberComponent;
  let fixture: ComponentFixture<SubscriberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriberComponent);
    component = fixture.componentInstance;
    component.session = jasmine.createSpyObj('OT.Session', ['subscribe']) as OT.Session;
    component.stream = {} as OT.Stream;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call session.subscribe', () => {
    expect(component.session.subscribe).toHaveBeenCalledWith(
      component.stream,
      jasmine.any(Element),
      jasmine.any(Object),
      jasmine.any(Function)
    );
  });

  describe('ngOnChanges', () => {
    it('should set audio false if event', () => {
      component.subscriber = {
        setAudioVolume: () => {/**/}
      };
      spyOn(component.subscriber, 'setAudioVolume').and.callThrough();
      component.ngOnChanges({subscriberAudio: {currentValue: false}});
      expect(component.subscriber.setAudioVolume).toHaveBeenCalledWith(0);

    });
    it('should set audio true if event', () => {
      component.subscriber = {
        setAudioVolume: () => {/**/}
      };
      spyOn(component.subscriber, 'setAudioVolume').and.callThrough();
      component.ngOnChanges({subscriberAudio: {currentValue: true}});
      expect(component.subscriber.setAudioVolume).toHaveBeenCalledWith(100);

    });
  });
});
