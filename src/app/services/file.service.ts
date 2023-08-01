import { Injectable } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() {}

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
  
  dataURLtoFile(dataurl: string, filename: string) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/);
    if (!mime) {
      throw new Error('Invalid data URL');
    }
    var bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime[1]});
  }

  async onUploadFile(event: any, sanitizer: DomSanitizer): Promise<{ file: File, imageUrl: SafeUrl | undefined }> {
    let uploadedFile!: File;
    let imageUrl: SafeUrl | undefined;
    
    for (let file of event.files) {
      uploadedFile = file;
      if (file.type === 'application/pdf') {
        imageUrl = sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));
      } else if (file.type.startsWith('image/')) {
        imageUrl = sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
      }
    }
    
    return { file: uploadedFile, imageUrl };
  }

  onRemoveFile(): SafeUrl | undefined {
    return undefined;
  }

  isPdf(file: File): boolean {
    return file && file.type === 'application/pdf';
  }
}
