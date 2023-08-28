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

  replayMessage(permitMessage: PermitMessageViewModel, messageId: string): Observable<PermitsResponse<boolean>> {
    let email = this._mails.find(x => x.permitMessageKey === messageId);
    permitMessage.applicationKey = email?.applicationKey;
    permitMessage.senderType = "2";
    var urlPath = environment.apiPermitsURL + 'PermitMessages';
    return this.http.post<PermitsResponse<boolean>>(urlPath, permitMessage);
  }

  GetUnreadMessages(portalUserKey: number): Observable<PermitsResponse<UnreadMessageViewModel[]>> {
    var urlPath = environment.apiPermitsURL + 'PermitMessages/GetUnreadMessages/' + portalUserKey;
    return this.http.get<PermitsResponse<UnreadMessageViewModel[]>>(urlPath);
  }

  getAllMessages(portalUserKey: number): Observable<PermitsResponse<PermitMessageViewModel[]>> {
    var urlPath = environment.apiPermitsURL + 'PermitMessages/GetMessagesByUserkey/' + portalUserKey;
    return this.http.get<PermitsResponse<PermitMessageViewModel[]>>(urlPath);
  }

  updateMails(data: PermitMessageViewModel[]) {
    this._mails = data;
    this.mails.next(data);
  }

  addReplayEmail(data: PermitMessageViewModel) {
    this._mails.push(data);
    this.mails.next(this._mails);
  }

  updateEmail(updatedEmail: PermitMessageViewModel) {
    const index = this._mails.findIndex(mail => mail.permitMessageKey === updatedEmail.permitMessageKey);

    if (index !== -1) {
      this._mails[index] = updatedEmail;
      this.mails.next(this._mails);
    }
  }

  onRead(id: string) {
    return this.updateMessages([id], MessageAction.Readed);
  }

  onStar(id: string) {
    return this.updateMessages([id], MessageAction.IsStarred);
  }

  onArchive(id: string) {
    return this.updateMessages([id], MessageAction.IsArchived);
  }

  onDelete(id: string) {
    return this.updateMessages([id], MessageAction.IsDeleted);
  }

  onTrash(id: string) {
    return this.updateMessages([id], MessageAction.IsDeleted);
  }

  onDeleteMultiple(mails: PermitMessageViewModel[]) {
    const ids = mails.map(mail => mail.permitMessageKey).filter(Boolean) as string[];
    return this.updateMessages(ids, MessageAction.IsDeleted);
  }

  onArchiveMultiple(mails: PermitMessageViewModel[]) {
    const ids = mails.map(mail => mail.permitMessageKey).filter(Boolean) as string[];
    return this.updateMessages(ids, MessageAction.IsArchived);
  }

  updateMessages(ids: string[], action: MessageAction): Observable<PermitsResponse<boolean>> {
    let updatePermitMessageViewModels = ids.map(id => ({
      PermitMessageKey: id,
      Action: action
    }));

    var urlPath = environment.apiPermitsURL + 'PermitMessages/UpdateMessages';
    return this.http.post<PermitsResponse<boolean>>(urlPath, updatePermitMessageViewModels);
  }
}

export enum MessageAction {
  Readed = 101,
  IsStarred,
  IsArchived,
  IsDeleted,
}