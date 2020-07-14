import { Component, ElementRef, AfterViewInit, ViewChild, Input, Output, EventEmitter, Renderer2, OnInit } from '@angular/core';
import { OpentokService } from '../../services/opentok';
import { Room } from '../../models';
import { VIDEOCONFERENCE_CONSTANTS } from '../../constants';
import { PublisherProperties } from '@opentok/client';

@Component({
  selector: 'sas-publisher',
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.scss']
})

export class PublisherComponent implements OnInit, AfterViewInit {
  @ViewChild('publisherDiv') publisherDiv: ElementRef;
  @Input() session: OT.Session;
  @Input() roomData: Room;
  @Output() toggleSubscriberAudio:  EventEmitter<any> = new EventEmitter();
  @Output() toggleFullScreen:  EventEmitter<any> = new EventEmitter();
  @Output() toggleFullScreenMiniature:  EventEmitter<any> = new EventEmitter();
  @Output() hangUp:  EventEmitter<any> = new EventEmitter();
  @Output() toggleShareFrame:  EventEmitter<any> = new EventEmitter();
  publisher: OT.Publisher;
  publishing: Boolean;
  fullScreenEnabled = false;
  videoEnabled = false;
  audioEnabled = true;
  subscriberAudioEnabled = true;
  screenShareFrame = false;
  iconButtons = VIDEOCONFERENCE_CONSTANTS.ICON_BUTTONS;
  public settingsList = [
    { icon: this.iconButtons.SPEAKER, fn: () => {
      this.subscriberAudioEnabled = !this.subscriberAudioEnabled;
      this.toggleSubscriberAudio.emit(this.subscriberAudioEnabled);
      this.settingsList[0].icon = this.subscriberAudioEnabled ? this.iconButtons.SPEAKER : this.iconButtons.SPEAKER_OFF;
    }},
    { icon: this.iconButtons.MIC, fn: () => {
      this.audioEnabled = !this.audioEnabled;
      this.publisher.publishAudio(this.audioEnabled);
      this.settingsList[1].icon = this.audioEnabled ? this.iconButtons.MIC : this.iconButtons.MIC_OFF;
    }},
    { icon: this.iconButtons.CAMERA_OFF, fn: () => {
      this.videoEnabled = !this.videoEnabled;
      this.publisher.publishVideo(this.videoEnabled);
      this.settingsList[2].icon = this.videoEnabled ? this.iconButtons.CAMERA : this.iconButtons.CAMERA_OFF;
    }},
    { icon: this.iconButtons.MINIATURE, fn: () => {
      this.fullScreenEnabled = !this.fullScreenEnabled;
      this.toggleFullScreen.emit(this.fullScreenEnabled);
    }},
    { icon: this.iconButtons.SHARE_SCREEN, fn: () => {
      this.screenShare();
    }},
    { icon: this.iconButtons.PHONE_OFF, fn: () => {
      this.hangUp.emit();
    }}
  ];
  private videoConstants = VIDEOCONFERENCE_CONSTANTS;



  constructor(private opentokService: OpentokService, private renderer: Renderer2) {}

  ngOnInit() {
    this.publishing = false;
  }

  ngAfterViewInit() {
    const OT = this.opentokService.getOT();
    this.publisher = OT.initPublisher(this.publisherDiv.nativeElement, {
      width: '',
      height: '',
      insertMode: 'append',
      name: this.roomData.attendantName,
      style: {
        buttonDisplayMode: 'off',
        nameDisplayMode: 'on'
      },
      showControls: false,
      publishAudio: this.audioEnabled, publishVideo: this.videoEnabled
    });
    if (this.session) {
      if (this.session['isConnected']()) {
        this.publish();
      }
      this.session.on('sessionConnected', () => this.publish());
    }
  }

  orderButtons(index) {
    return index;
  }

  publish() {
    this.session.publish(this.publisher, (err) => {
      if (err) {
        console.log(err.message);
      } else {
        this.publishing = true;
      }
    });
  }

  toggleFullScreenPublisher() {
    this.toggleFullScreenMiniature.emit();
  }

  screenShare(){
    OT.checkScreenSharingCapability(response => {
      if (!response.supported || response.extensionRegistered === false) {
        // This browser does not support screen sharing.
        console.log('This browser does not support screen sharing');
      } else if (response.extensionInstalled === false) {
        // Prompt to install the extension.
        console.log('Prompt to install the extension');
      } else {
        const publishOptions: PublisherProperties = {
          maxResolution: {
            width: this.videoConstants.SCREEN_SHARING.MAXRESOLUTION.WIDTH,
            height: this.videoConstants.SCREEN_SHARING.MAXRESOLUTION.HEIGHT,
          },
          videoSource: this.videoConstants.SCREEN_SHARING.SCREEN,
        };
        const screenPublisherElement = this.renderer.createElement('div');

        // Screen sharing is available. Publish the screen.
        const publisher = OT.initPublisher(screenPublisherElement, publishOptions,
          (error) => {
            if (error) {
              console.log('ERROR OT.initPublisher screen sharing:', error.message);
              // Look at error.message to see what went wrong.
            } else {
              this.session.publish(publisher, (err) => {
                if (err) {
                  console.log('ERROR session.publish screen sharing:', err.message);
                  // Look error.message to see what went wrong.
                } else {
                  this.screenShareFrame = !this.screenShareFrame;
                  this.toggleShareFrame.emit(this.fullScreenEnabled);
                }
              });
            }
          }
        );
        publisher.on(this.videoConstants.VIDEO_EVENTS.MEDIA_STOPPED, (event) => {
          console.log('The user clicked stop');
          this.screenShareFrame = !this.screenShareFrame;
          this.toggleShareFrame.emit(this.fullScreenEnabled);
        });
      }
    });
  }
}
