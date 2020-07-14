export class Room {
  roomTitle: string;
  attendantName: string;
  providedId: string;
  attendantNames: Array<string>;
  token: string;
}

export class RoomSchedule {
  delta: number;
  startsAt: Date;
}
