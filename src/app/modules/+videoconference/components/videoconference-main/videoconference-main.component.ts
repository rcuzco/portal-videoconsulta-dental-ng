import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { Subject } from 'rxjs';

import { OpentokService } from '../../services/opentok';
import { ActivatedRoute } from '@angular/router';
import { RoomService } from '../../services/room';
import { takeUntil } from 'rxjs/operators';
import { Room, RoomSchedule } from '../../models';
import { VIDEOCONFERENCE_CONSTANTS } from '../../constants';

@Component({
  selector: 'sas-videoconference-main',
  styleUrls: ['./videoconference-main.component.scss'],
  templateUrl: './videoconference-main.component.html'
})
export class VideoconferenceMainComponent implements OnInit, OnDestroy {

  public session: OT.Session;
  public streams: Array<OT.Stream> = [];
  public changeDetectorRef: ChangeDetectorRef;
  public messageToSend = '';
  public roomData: Room;
  public fullScreen = false;
  public fullScreenPublisher = false;
  public subscriberAudio: boolean;
  public openChatBubble: boolean = true;
  public disconnected: string;
  public titlePage = 'VIDEO_DEMO.TITLE';
  public roomSchedule: RoomSchedule;
  public fullDesktopPublisher = false;
  public streamScreenShare: OT.Stream;
  public screenShareFrame = false;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private videoConstants = VIDEOCONFERENCE_CONSTANTS;


  constructor(
    private ref: ChangeDetectorRef,
    private opentokService: OpentokService,
    private activatedRoute: ActivatedRoute,
    private roomService: RoomService
  ) {
    this.changeDetectorRef = ref;
  }

  ngOnInit() {
    this.fetchAndConnect();
  }

  connect(roomData: Room = this.roomData) {
    this.opentokService.initSession(roomData).then((session: OT.Session) => {
      this.session = session;
      this.disconnected = null;
      this.titlePage = 'VIDEO_DEMO.TITLE';
      this.session.on(this.videoConstants.VIDEO_EVENTS.STREAM_CREATED, (event: any) => {
        if (event.stream.videoType === this.videoConstants.SCREEN_SHARING.SCREEN) {
          this.streamScreenShare = event.stream;
        }
        this.streams.push(event.stream);
        this.changeDetectorRef.detectChanges();
      });
      this.session.on(this.videoConstants.VIDEO_EVENTS.STREAM_DESTROYED, (event: any) => {
        const idx = this.streams.indexOf(event.stream);
        if (idx > -1) {
          this.streams.splice(idx, 1);
          this.changeDetectorRef.detectChanges();
        }
      });
      this.session.on(this.videoConstants.VIDEO_EVENTS.SIGNAL.HUNG_UP, () => {
        this.hungUp();
      });

    }).then(() => this.opentokService.connect())
      .catch((err) => {
        console.error(err);
        console.log('Unable to connect. Make sure you have updated the config.ts file with your OpenTok details.');
      });
  }

  fetchAndConnect() {
    this.activatedRoute.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      this.accessRoom(params[VIDEOCONFERENCE_CONSTANTS.URL_PARAM_ATTENDANT]);
    });
  }

  hungUp() {
    this.session.signal({
      type: this.videoConstants.VIDEO_EVENTS.HUNG_UP
    }, () => {
      this.fullScreen = false;
      this.openChatBubble = true;
      this.fullDesktopPublisher = false;
      this.session.disconnect();
      this.disconnected = VIDEOCONFERENCE_CONSTANTS.DISCONNECTED_STATUS.HUNG_UP;
      this.titlePage = 'HUNG_UP.TITLE';
      this.streams = [];
    });
  }

  toggleFullScreen(ev) {
    this.fullScreen = ev;
  }

  toggleFullDeskTopPublisher() {
    this.fullDesktopPublisher = !this.fullDesktopPublisher;
  }

  toggleFullScreenPublisher() {
    this.fullScreenPublisher = !this.fullScreenPublisher;
  }

  toggleSubscriberAudio(ev) {
    this.subscriberAudio = ev;
  }

  toggleChat(ev) {
    this.openChatBubble = ev;
  }

  orderStreams(index) {
    return index;
  }

  toggleShareFrame() {
    this.screenShareFrame = !this.screenShareFrame;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private accessRoom(attendantId) {
    this.roomService.accessRoom(attendantId).pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((response: Room) => {
      this.roomData = response;
      this.connect(this.roomData);
    }, (err) => this.handleRoomError(err));
  }

  private handleRoomError(err) {
    const errMap = {
      410: VIDEOCONFERENCE_CONSTANTS.DISCONNECTED_STATUS.OVER,
      400: VIDEOCONFERENCE_CONSTANTS.DISCONNECTED_STATUS.NOT_STARTED
    };
    this.titlePage = 'WAITING_ROOM.TITLE';
    this.disconnected = errMap[err.status];
    if (errMap[err.status]) {
      this.roomSchedule = {
        delta: err.error.delta,
        startsAt: err.error.startsAt
      };
    }
  }

}
