import { Injectable } from '@angular/core';

import * as OT from '@opentok/client';
import { EnvironmentService, ApiService, API_CALL_URL } from '../../../../shared/services';
import { RoomServiceModule } from './room.service.module';
import { Observable, of } from 'rxjs';
import { Room } from '../../models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: RoomServiceModule
})
export class RoomService {

  constructor(
    private apiService: ApiService,
    private environmentService: EnvironmentService,
    private httpClient: HttpClient
    ) {}

  private mockRoom: Room = {
    roomTitle: 'title',
    attendantName: 'Jaime',
    attendantNames: ['Peter'],
    providedId: '1_MX40NjYwMzE0Mn5-MTU4NzA0NTk4MzY2Mn44cnpqaTd5M0I4emNIQ1JEbC83c21Xa2p-UH4',
    token: 'T1==cGFydG5lcl9pZD00NjYwMzE0MiZzaWc9YmM3ZWU2ZmI2ZThjZjIxYWI3ZGVmZjE1NmU0YTI1NTM5ZGFkOWUzZjpzZXNzaW9uX2lkPTFfTVg0ME5qWXdNekUwTW41LU1UVTROekEwTlRrNE16WTJNbjQ0Y25wcWFUZDVNMEk0ZW1OSVExSkViQzgzYzIxWGEycC1VSDQmY3JlYXRlX3RpbWU9MTU4NzA0NjEyNCZub25jZT0yMDIxMjA3NTg1JnJvbGU9bW9kZXJhdG9yJmV4cGlyZV90aW1lPTE1ODk2MzgxMjQmY29ubmVjdGlvbl9kYXRhPXRoaXMraW5mbyt3aWxsK2JlK2Fzc29jaWF0ZWQrd2l0aCt0aGUrY2xpZW50K2Nvbm5lY3Rpb24='
  };

  public accessRoom(attendantId: string, mock?: boolean): Observable<Room> {
    if (mock) {
      return of(this.mockRoom);
    }
    const apiInstance = this.apiService.getApiInstance(API_CALL_URL.ROOM_ACCESS);
    apiInstance.params.attendantId.value = attendantId;
    const url = this.apiService.getApiUrl(this.environmentService.data.apiUrl, apiInstance);
    return this.httpClient.put<Room>(url, {});
  }
}
