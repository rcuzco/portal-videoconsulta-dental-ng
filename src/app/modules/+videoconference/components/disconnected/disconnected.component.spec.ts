import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DisconnectedComponent } from './disconnected.component';

describe('DisconnectedComponent', () => {
  let component: DisconnectedComponent;
  let fixture: ComponentFixture<DisconnectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisconnectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisconnectedComponent);
    component = fixture.componentInstance;
    component.roomSchedule = {
      startsAt: new Date('2021-12-24T11:45:00+02:00'),
      delta: 40
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initData', () => {
    it('should create component if started or over', () => {
      component.roomSchedule = {
        startsAt: new Date('2021-12-24T11:45:00+02:00'),
        delta: 40
      };
      component.reason = 'hung_up';
      component.ngOnInit();
      expect(component.startDate).toEqual({
        day: 24,
        month: 'December',
        year: 2021,
        hour: 10,
        minute: 45
      });
    });
    it('should create component if meeting is not started', () => {
      component.roomSchedule = {
        startsAt: new Date('2021-12-24T01:45:00+02:00'),
        delta: 40
      };
      component.reason = 'not_started';
      component.ngOnInit();
      expect(component.startDate).toEqual({
        day: 24,
        month: 'December',
        year: 2021,
        hour: '00',
        minute: 45
      });
    });
    it('should not init data if not shedule', () => {
      component.roomSchedule = null;
      expect(component.ngOnInit()).toBeUndefined();
    });
  });

  describe('reconnect', () => {
    it('should emit connect output', () => {
      spyOn(component.connect, 'emit').and.callThrough();
      component.reconnect();
      expect(component.connect.emit).toHaveBeenCalled();
    });
  });

});
