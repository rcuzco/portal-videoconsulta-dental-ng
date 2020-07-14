import { Component, OnInit, Input, ElementRef, ViewChild, SimpleChanges } from '@angular/core';
import { VIDEOCONFERENCE_CONSTANTS } from '../../constants/videoconference.constants';
import { WidgetProperties } from '@opentok/client';

@Component({
  selector: 'sas-screen-share',
  templateUrl: './screen-share.component.html',
  styleUrls: ['./screen-share.component.css']
})
export class ScreenShareComponent implements OnInit {
  @Input() session: OT.Session;
  @Input() stream: OT.Stream;
  @ViewChild('screenDiv', { static: true }) private screenDiv: ElementRef;
  private videoConstants = VIDEOCONFERENCE_CONSTANTS;


  ngOnInit() {
    if (this.session) {
      this.session.on(this.videoConstants.VIDEO_EVENTS.STREAM_DESTROYED, (event: any) => {
        if (event.reason === this.videoConstants.SCREEN_SHARING.REASONS.CLIENT_DISCONNECTED) {
          console.log('User clicked stop sharing');
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.stream && changes.stream.currentValue !== undefined && this.screenDiv) {
      const subOptions: WidgetProperties = {
        width: '100%',
        height: '100%',
        fitMode: 'cover',
        insertMode: 'append',
      };
      this.session.subscribe(changes.stream.currentValue, this.screenDiv.nativeElement, subOptions);
    }
  }

}
