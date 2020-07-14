import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EnvironmentService } from '../../../../shared/services/environment';
import { UtilsService } from '../../../../shared/services';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as OT from '@opentok/client';
import { VIDEOCONFERENCE_CONSTANTS } from '../../constants';
import { Message, FileData, FileError, MessageRawData } from '../../models';


@Component({
  selector: 'sas-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @Input() session: OT.Session;
  @Input() name: string;
  @Output() toggleChat: EventEmitter<any> = new EventEmitter();
  @ViewChild('msgHistory') msgHistory: ElementRef;
  public chatMessages: Array<Message> = [];
  public formChat: FormGroup;
  public completeFile = '';
  public typesFile = this.envConf.data.chat.typesFile;
  public maxMBSizeFile = this.envConf.data.chat.maxSizeFile / 1000000;
  public showAlertSizeFile = false;
  public showAlertTypeFile = false;
  public bubbleChat: boolean = true;
  public iconNotification: boolean =  false;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private signalEvents = VIDEOCONFERENCE_CONSTANTS.VIDEO_EVENTS.SIGNAL;
  private getMessageMap = {
    [this.signalEvents.MSG]: (message, data) => this.buildTextMessage(message, data),
    [this.signalEvents.FILE_PDF_END]: (message, data) => this.buildPDFMessage(message, data),
    [this.signalEvents.FILE_IMAGE_END]: (message, data) => this.buildImgMessage(message, data),
  };

  constructor(private formBuilder: FormBuilder, private envConf: EnvironmentService, private utils: UtilsService) {}

  ngOnInit() {
    this.formChat = this.formBuilder.group({
      textChat: ['', this.validChatMessage],
      file: '',
    });
    this.loadSignal();
  }

  addFiles($event): void {
    this.sendFile($event.target);
  }

  buildImgMessage(message: Message, data: any) {
    const file = this.completeFile;
    message.fileName = data;
    this.utils.datatoBlob(file, 'image/jpg').pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
      message.img = this.utils.blobToUrl(response, message.fileName, 'image/jpeg');
      this.chatMessages.push(message);
    });
  }

  buildMessage(event) {
    const message = new Message();
    const messageData = this.getMessageData(event.data);
    message.name = messageData.name;
    message.owner = event.from.connectionId === this.session.connection.connectionId ? VIDEOCONFERENCE_CONSTANTS.CHAT.OWNER_MINE : VIDEOCONFERENCE_CONSTANTS.CHAT.OWNER_THEIRS;
    if (event.from.connectionId !== this.session.connection.connectionId){
      console.log('Signal received from another client');
      this.iconNotification = true;
    }
    this.getMessageMap[event.type](message, messageData.data);
    this.completeFile = '';
  }

  buildPDFMessage(message: Message, data: any) {
    message.fileName = data;
    message.doc = this.completeFile;
    this.chatMessages.push(message);
  }

  buildTextMessage(message: Message, data: any) {
    message.text = data;
    this.chatMessages.push(message);
  }

  getMessageData(message: string): MessageRawData {
    const messages = message.split('::');
    return {
      name: messages[0],
      data: messages[1]
    };
  }

  getSmallChat() {
    this.iconNotification = false;
    this.bubbleChat = !this.bubbleChat;
    if (this.bubbleChat) {
      this.toggleChat.emit(true);
    } else {
      this.toggleChat.emit(false);
    }
  }

  loadSignal(){
    this.session.on(this.signalEvents.EMPTY, (event: any) => {
      const type: string = event.type;
      const chatAllowedSignals = Object.keys(this.getMessageMap);

      if (type === this.signalEvents.FILE) {
        this.completeFile += this.getMessageData(event.data).data;
      } else if (chatAllowedSignals.some(sign => sign === type)) {
        this.buildMessage(event);
      }
    });
  }

  onSubmit(e?: any) {
    if (this.formChat.controls.textChat.valid) {
      this.sendMessage(this.formChat.controls.textChat.value, VIDEOCONFERENCE_CONSTANTS.CHAT.MESSAGE_TYPES.MSG);
    }
  }

  orderMessages(index) {
    return index;
  }

  preventNewLine(event: KeyboardEvent) {
    event.preventDefault();
  }

  sendMessage(message: string, type: string, to?: any) {
    let signal = {};
    signal  = {
      type: type,
      data: this.name + '::' + message,
      ...(to && { to: to })
    };
    this.session.signal(
      signal,
      (error) => {
        if (error) {
          console.log('signal error (' + error.name + '): ' + error.message);
        } else {
          this.formChat.controls.textChat.setValue('');
          this.formChat.controls.file.setValue('');
        }
      }
    );
  }

  sendFile(file) {
    this.showAlertSizeFile = false;
    this.showAlertTypeFile = false;
    this.utils.readFile(file).pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((fileData: FileData) => {
      fileData.chunks.forEach((chunk) => {
        this.sendMessage(chunk, VIDEOCONFERENCE_CONSTANTS.CHAT.MESSAGE_TYPES.FILE);
      });
      switch (fileData.type) {
      case 'application/pdf':
        this.sendMessage(fileData.name, VIDEOCONFERENCE_CONSTANTS.CHAT.MESSAGE_TYPES.FILE_PDF_END);
        break;
      case 'image/jpg':
      case 'image/jpeg':
        this.sendMessage(fileData.name, VIDEOCONFERENCE_CONSTANTS.CHAT.MESSAGE_TYPES.FILE_IMAGE_END);
        break;
      default:
        break;
      }
    }, (err: FileError) => {
      this.showAlertTypeFile = err === VIDEOCONFERENCE_CONSTANTS.CHAT.ERROR_FILE_TYPE;
      this.showAlertSizeFile = err === VIDEOCONFERENCE_CONSTANTS.CHAT.ERROR_FILE_SIZE;
    });
  }

  showPDF(file, name) {
    this.utils.openPDF(file, name);
  }

  toggleAlertSizeFile() {
    this.showAlertSizeFile = !this.showAlertSizeFile;
  }

  toggleAlertTypeFile() {
    this.showAlertTypeFile = !this.showAlertTypeFile;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private validChatMessage(control) {
    const valueWithNoLines = control.value.replace('\n', '').trim();
    let error;
    if (!valueWithNoLines.length) {
      error = {noMessage: !valueWithNoLines.length};
    }
    return error;
  }
}
