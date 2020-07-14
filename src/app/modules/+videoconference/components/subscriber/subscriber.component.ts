import { Component, ElementRef, AfterViewInit, ViewChild, Input, OnChanges } from '@angular/core';
import * as OT from '@opentok/client';

@Component({
  selector: 'sas-subscriber',
  templateUrl: './subscriber.component.html',
  styleUrls: ['./subscriber.component.scss']
})

export class SubscriberComponent implements AfterViewInit, OnChanges{
  @ViewChild('subscriberDiv') subscriberDiv: ElementRef;
  @Input() session: OT.Session;
  @Input() stream: OT.Stream;
  @Input() subscriberAudio: boolean;

  subscriber;

  constructor() { /* EMPTY BLOCK */ }

  ngAfterViewInit() {
    this.subscriber = this.session.subscribe(this.stream, this.subscriberDiv.nativeElement, {
      width: '100%',
      height: '100%',
      fitMode: 'cover',
      insertMode: 'append',
      testNetwork: true,
      style: {
        audioLevelDisplayMode: 'on',
        buttonDisplayMode: 'off',
        nameDisplayMode: 'on'
      }
    }, () => {
      this.subscriber.setAudioVolume( 100 );
    });
  }

  ngOnChanges(ev) {
    if (ev.subscriberAudio && typeof ev.subscriberAudio.currentValue === 'boolean') {
      this.subscriber.setAudioVolume(ev.subscriberAudio.currentValue ? 100 : 0);
    }
  }
}
