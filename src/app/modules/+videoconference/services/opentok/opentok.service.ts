import { Injectable } from '@angular/core';

import * as OT from '@opentok/client';
import { OpentokServiceModule } from './opentok.service.module';
import { EnvironmentService } from '../../../../shared/services';
import { Room } from '../../models';

@Injectable({
  providedIn: OpentokServiceModule
})
export class OpentokService {

  constructor(private environmentService: EnvironmentService) { }

  session: OT.Session;
  token: string;

  getOT() {
    return OT;
  }

  initSession(roomData: Room): Promise<OT.Session> {
    const config = this.environmentService.data.tokbox;
    this.session = this.getOT().initSession(config.API_KEY, roomData.providedId, {
      iceConfig: {
        includeServers: 'all',
        transportPolicy: 'relay',
        customServers: []
      },
    });
    this.token = roomData.token;
    return Promise.resolve(this.session);
  }

  connect(): Promise<OT.Session> {
    return new Promise((resolve, reject) => {
      this.session.connect(this.token, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(this.session);
        }
      });
    });
  }
}
