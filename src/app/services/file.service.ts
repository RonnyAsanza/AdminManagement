import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

  fileToBytes(file: File): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const arrayBuffer: ArrayBuffer = reader.result as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuffer);
        resolve(bytes);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  }
}