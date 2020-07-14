import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MultiLanguageService, ApiService } from '../../shared/services';

import { routes } from './videoconference.routes';
import { VideoconferenceMainComponent } from './components/videoconference-main/videoconference-main.component';
import { OpentokServiceModule } from './services/opentok/opentok.service.module';
import { SubscriberComponent } from './components/subscriber/subscriber.component';
import { PublisherComponent } from './components/publisher/publisher.component';
import { ChatComponent } from './components/chat/chat.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DisconnectedComponent } from './components/disconnected/disconnected.component';
import { RoomServiceModule } from './services/room/room.service.module';
import { ScreenShareComponent } from './components/screen-share/screen-share.component';

@NgModule({
  declarations: [
    VideoconferenceMainComponent,
    SubscriberComponent,
    PublisherComponent,
    ChatComponent,
    DisconnectedComponent,
    ScreenShareComponent
  ],
  imports: [
    CommonModule,
    OpentokServiceModule,
    RoomServiceModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    ApiService,
    MultiLanguageService
  ]
})
export class VideoConferenceModule { }
