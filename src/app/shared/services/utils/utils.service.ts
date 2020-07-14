import { Injectable } from '@angular/core';
import { Observable, Observer, throwError } from 'rxjs';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { EnvironmentService } from '../environment';
import { FileError, FileData } from '../../../modules/+videoconference/models';
declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private sanitizer: DomSanitizer, private envConf: EnvironmentService) {}

  copyDeepObject(originalObj: any): any {
    const constructedObj = Object.create(originalObj);
    for (const i in originalObj) {
      if (typeof originalObj[i] === 'object') {
        constructedObj[i] = this.deepClone(originalObj[i]);
      } else {
        constructedObj[i] = originalObj[i];
      }
    }
    return constructedObj;
  }


  chunkString(str, length): Array<string> {
    return str.match(new RegExp('.{1,' + length + '}', 'g'));
  }

  openPDF(data: string, fileName: string): void {
    const byteCharacters = atob(data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    if (window.navigator.msSaveOrOpenBlob) {
      // IE 11+
      window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else if (navigator.userAgent.match('FxiOS')) {
      // FF iOS
      console.log('Cannot display on FF iOS');
    } else if (navigator.userAgent.match('CriOS')) {
      // Chrome iOS
      const reader = new FileReader();
      reader.onloadend = function () {
        // window.open(reader.result);
      };
      reader.readAsDataURL(blob);
    } else if (
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPhone/i)
    ) {
      // Safari & Opera iOS
      const url = window.URL.createObjectURL(blob);
      window.location.href = url;
    } else {
      const url = URL.createObjectURL(blob);
      setTimeout(function () {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(url);
      }, 100);
      window.open(url, '_blank');
    }
  }

  datatoBlob(data: string, type: string): Observable<Blob> {
    return Observable.create((observer: Observer<Blob>) => {
      const byteString = atob(data);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([int8Array], { type: type });
      observer.next(blob);
      observer.complete();
    });
  }

  blobToUrl(data: Blob, name: string, type: string): SafeUrl {
    const file = new File([data], name, {
      type: type,
    });
    return this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
  }

  readFile(file): Observable<FileData> {
    const reader = new FileReader();
    let pattern = this.envConf.data.chat.typesFile.split(',');
    file = file.files[0];
    pattern = pattern.filter((patt) => file.type.match(patt));
    const typeFile = pattern[0];
    if (!pattern.length) {
      return throwError('errorType');
    }
    if (file.size > this.envConf.data.chat.maxSizeFile ) {
      return throwError('errorSize');
    }
    reader.readAsDataURL(file);

    return Observable.create(observer => {
      reader.onload = () => {
        const result = reader.result.toString().split(',')[1];
        const fileData = {
          type: typeFile,
          name: file.name,
          chunks: this.chunkString(result, this.envConf.data.chat.chunkFile)
        };
        observer.next(fileData);
        observer.complete();
      };
    });
  }

  private deepClone(oldObj) {
    let newObj;
    // Handle the 3 simple types, and null or undefined
    if (null == oldObj || 'object' !== typeof oldObj) {
      return oldObj;
    }
    // Handle Date
    if (oldObj instanceof Date) {
      newObj = new Date();
      newObj.setTime(oldObj.getTime());
      return newObj;
    }
    // Handle Array
    if (oldObj instanceof Array) {
      newObj = [];
      for (let i = 0; i < oldObj.length; i++) {
        newObj[i] = this.deepClone(oldObj[i]);
      }
      return newObj;
    }
    // Handle Map
    if (oldObj instanceof Map) {
      newObj = new Map(oldObj);
      return newObj;
    }
    // Handle Object
    newObj = Object.create(oldObj);
    for (const attr in oldObj) {
      if (oldObj.hasOwnProperty(attr)) {
        newObj[attr] = this.deepClone(oldObj[attr]);
      } else {
        newObj[attr] = oldObj[attr];
      }
    }
    return newObj;
  }

}
