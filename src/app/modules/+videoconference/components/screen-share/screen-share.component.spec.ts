import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ScreenShareComponent } from './screen-share.component';
import { WidgetProperties } from '@opentok/client';

describe('ScreenShareComponent', () => {
  let component: ScreenShareComponent;
  let fixture: ComponentFixture<ScreenShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScreenShareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenShareComponent);
    component = fixture.componentInstance;
    component.session = jasmine.createSpyObj('OT.Session', ['subscribe', 'on']) as OT.Session;
    component.stream = {videoType: 'screen'} as OT.Stream;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should ngOnInit not session', () => {
      component.session = null;
      component.ngOnInit();
    });
    it('should ngOnInit reason === clientDisconnected', () => {
      const event = {
        reason : 'clientDisconnected'
      };
      expect(component.session.on).toHaveBeenCalled();
      (component.session.on as any).calls.mostRecent().args[1](event);  // Execute the event handler
      component.ngOnInit();
    });
    it('should ngOnInit reason !== clientDisconnected', () => {
      const event = {
        reason : 'xxx'
      };
      expect(component.session.on).toHaveBeenCalled();
      (component.session.on as any).calls.mostRecent().args[1](event);  // Execute the event handler
      component.ngOnInit();
    });
  });

  describe('ngOnChanges', () => {
    it('should stream currenValue!== undefined', () => {
      component.ngOnChanges(
        {stream : {
          currentValue: {
            videoType: 'screen'
          },
          previousValue: null,
          firstChange: null,
          isFirstChange: null}});
      const subOptions: WidgetProperties = {
        width: '100%',
        height: '100%',
        fitMode: 'cover',
        insertMode: 'append'
      };

      expect(component.session.subscribe).toHaveBeenCalledWith(
        component.stream,
        jasmine.any(Element),
        subOptions
      );

    });
    it('should stream currenValue is undefined ', () => {
      component.ngOnChanges(
        {stream : {
          currentValue: undefined,
          previousValue: null,
          firstChange: null,
          isFirstChange: null}});
    });
  });
});
