import { SafeUrl } from '@angular/platform-browser';

export type FileError = 'errorType' | 'errorSize';


export class Message {
  owner: string;
  name?: string;
  text?: string;
  img?: SafeUrl;
  fileName?: string;
  doc?: string;
}

export class MessageRawData {
  name: string;
  data: string;
}
export class FileData {
  chunks: Array<string>;
  type: string;
  name: string;
}
