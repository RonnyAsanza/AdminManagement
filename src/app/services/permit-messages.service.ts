import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PermitsResponse } from './permits-response.model';
import { UnreadMessageViewModel } from '../models/unread-messages.model';
import { PermitMessageViewModel } from '../models/permit-messages.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermitMessagesService {
  private _mails: PermitMessageViewModel[] = [];
  private mails = new BehaviorSubject<PermitMessageViewModel[]>(this._mails);
  mails$ = this.mails.asObservable();

  constructor(private http: HttpClient) { }

  
  GetUnreadMessages(portalUserKey: number): Observable<PermitsResponse<UnreadMessageViewModel[]>>{
    var urlPath = environment.apiPermitsURL + 'PermitMessages/GetUnreadMessages/'+ portalUserKey;
    return this.http.get<PermitsResponse<UnreadMessageViewModel[]>>(urlPath);
  }

  getAllMessages(portalUserKey: number): Observable<PermitsResponse<PermitMessageViewModel[]>>{
    var urlPath = environment.apiPermitsURL + 'PermitMessages/GetMessagesByUserkey/'+ portalUserKey;
    return this.http.get<PermitsResponse<PermitMessageViewModel[]>>(urlPath);
  }

  updateMails(data: PermitMessageViewModel[]) {
    this._mails = data;
    this.mails.next(data);
}

  onStar(id: string) {
    //someloginc
  }

  onArchive(id: string) {
     //someloginc

  }

  onDelete(id: string) {
        //someloginc

  }

  onTrash(id: string) {
        //someloginc
 }


  onDeleteMultiple(mails: PermitMessageViewModel[]) {

  }

  onArchiveMultiple(mails: PermitMessageViewModel[]) {

  }


  
}
