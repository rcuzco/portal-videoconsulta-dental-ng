import { Component, ElementRef, AfterViewInit, ViewChild, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { RoomSchedule } from '../../models';
import { interval, Subject } from 'rxjs';
import { takeWhile, takeUntil } from 'rxjs/operators';
import { VIDEOCONFERENCE_CONSTANTS } from '../../constants';

type disconnectedReason = 'over' | 'not_started' | 'hung_up';

@Component({
  selector: 'sas-disconnected',
  templateUrl: './disconnected.component.html',
  styleUrls: ['./disconnected.component.scss']
})

export class DisconnectedComponent implements OnInit {

  @Input() reason: disconnectedReason;
  @Input() roomSchedule: RoomSchedule;
  @Output() connect: EventEmitter<any> = new EventEmitter();
  @Output() fetchAndConnect: EventEmitter<any> = new EventEmitter();

  startDate: any;
  disconnectedStatus = VIDEOCONFERENCE_CONSTANTS.DISCONNECTED_STATUS;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  ngOnInit() {
    this.initData();
  }

  reconnect() {
    this.connect.emit();
  }

  private calculateRemainingTime() {
    const courtesySeconds = 60;
    const currentDate = new Date();
    const startsAtDate = new Date(this.roomSchedule.startsAt);
    const diff = startsAtDate.getTime() - currentDate.getTime();
    let remainingSeconds = (Math.round(Math.abs(diff / 1000)) - this.roomSchedule.delta) + courtesySeconds;
    const source = interval(1000).pipe(takeWhile(() => remainingSeconds !== 0));
    source.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      remainingSeconds -= 1;
      console.log('Remaining Time: ', remainingSeconds);
      if (remainingSeconds <= 0) {
        this.fetchAndConnect.emit();
      }
    });
  }

  private initData() {
    if (this.roomSchedule) {
      this.startDate = this.formatDate();
      if (this.reason === this.disconnectedStatus.NOT_STARTED) {
        this.calculateRemainingTime();
      }
    }
  }

  private formatDate() {
    const date = new Date(this.roomSchedule.startsAt);
    return {
      day: date.getDate(),
      month: VIDEOCONFERENCE_CONSTANTS.MONTHS[date.getMonth()],
      year: date.getFullYear(),
      hour: this.formatTime(date.getHours()),
      minute: this.formatTime(date.getMinutes())
    };
  }

  private formatTime(n) {
    if (n < 10) {
      n = '0' + n;
    }
    return n;
  }
}
