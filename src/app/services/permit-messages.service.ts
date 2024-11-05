import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PermitsResponse } from './permits-response.model';
import { UnreadMessageViewModel } from '../models/unread-messages.model';
import { PermitMessageViewModel } from '../models/permit-messages.model';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { aC } from '@fullcalendar/core/internal-common';

@Injectable({
  providedIn: 'root'
})
export class PermitMessagesService {
  private _mails: PermitMessageViewModel[] = [];
  private mails = new BehaviorSubject<PermitMessageViewModel[]>(this._mails);
  mails$ = this.mails.asObservable();

  constructor(private http: HttpClient) { }

  replayMessage(permitMessage: PermitMessageViewModel, messageId: string): Observable<PermitsResponse<string>> {
    let email = this._mails.find(x => x.permitMessageKey === messageId);
    permitMessage.applicationKey = email?.applicationKey;
    permitMessage.senderType = SenderType.PortalUser.toString();
    var urlPath = environment.apiPermitsURL + 'PermitMessages';
    return this.http.post<PermitsResponse<string>>(urlPath, permitMessage);
  }

  GetUnreadMessages(portalUserKey: number): Observable<PermitsResponse<UnreadMessageViewModel[]>> {
    var urlPath = environment.apiPermitsURL + 'PermitMessages/unread/user/' + portalUserKey;
    return this.http.get<PermitsResponse<UnreadMessageViewModel[]>>(urlPath);
  }

  getAllMessages(portalUserKey: number): Observable<PermitsResponse<PermitMessageViewModel[]>> {
    var urlPath = environment.apiPermitsURL + 'PermitMessages/user/' + portalUserKey;
    return this.http.get<PermitsResponse<PermitMessageViewModel[]>>(urlPath);
  }

  updateMessages(permitMessageViewModels: PermitMessageViewModel[]): Observable<PermitsResponse<boolean>> {
    var urlPath = environment.apiPermitsURL + 'PermitMessages';
    return this.http.put<PermitsResponse<boolean>>(urlPath, permitMessageViewModels);
  }

  updateMails(data: PermitMessageViewModel[]) {
    this._mails = data;
    this.mails.next(data);
  }

  addReplayEmail(data: PermitMessageViewModel) {
    this._mails.push(data);
    this.mails.next(this._mails);
  }

  updateEmail(updatedEmail: PermitMessageViewModel, isDeleted: boolean) {
    const index = this._mails.findIndex(mail => mail.permitMessageKey === updatedEmail.permitMessageKey);
    if (index !== -1) {
      this._mails[index] = updatedEmail;
      if (isDeleted) {
        this._mails.splice(index, 1);
      } else {
        this._mails[index] = updatedEmail;
      }
      this.mails.next(this._mails);
    }
  }

  sendAndAddReplayMessage(newMail: PermitMessageViewModel, messageId: string): Observable<PermitsResponse<string>> {
    return this.replayMessage(newMail, messageId).pipe(
      tap((response: PermitsResponse<string>) => {
        if (response && response.data) {
          newMail.senderType = SenderType[SenderType.PortalUser];
          this.addReplayEmail(newMail);
        }
      })
    );
  }

  updateAndRefreshEmail(message: PermitMessageViewModel, action: MessageAction): Observable<PermitsResponse<boolean>> {
    return this.updateAndRefreshEmails([message], action);
  }

  updateMessagesByApplication(mail: PermitMessageViewModel, action: MessageAction): Observable<PermitsResponse<boolean>> {
    var messages = this._mails
      .filter(d => d.applicationKey === mail.applicationKey);
    return this.updateAndRefreshEmails(messages, action);
  }

  updateMessagesByApplications(applicationKeys: string[], action: MessageAction): Observable<PermitsResponse<boolean>> {
    var messages = this._mails
      .filter(d => applicationKeys.includes(d.applicationKey!));
    return this.updateAndRefreshEmails(messages, action);
  }

  updateAndRefreshEmails(messages: PermitMessageViewModel[], action: MessageAction): Observable<PermitsResponse<boolean>> {
    console.log("updateAndRefreshEmails", action);
    messages.forEach(mail => {
      switch (action) {
        case MessageAction.IsReaded:
          mail.isReaded = true;
          break;
        case MessageAction.UnTrash:
          mail.isInTrash = false;
          break;
        case MessageAction.IsStarred:
          mail.isStarred = !mail.isStarred;
          mail.isDeleted = false;
          mail.isArchived = false;
          break;
        case MessageAction.IsArchived:
          mail.isArchived = !mail.isArchived;
          mail.isStarred = false;
          mail.isDeleted = false;
          break;
        case MessageAction.isInTrash:
          mail.isInTrash = true;
          mail.isArchived = false;
          mail.isStarred = false;
          break;
        case MessageAction.isInTrash:
            mail.isInTrash = !mail.isInTrash;
            mail.isArchived = false;
            mail.isStarred = false;
            break;
        case MessageAction.IsDeleted:
            mail.isInTrash = true;
            mail.isDeleted = true;
            mail.isArchived = false;
            mail.isStarred = false;
            break;
      }
    });
    return this.updateMessages(messages).pipe(
      tap((response: PermitsResponse<boolean>) => {
        if (response && response.data) {
          messages.forEach(mail => {
                this.updateEmail(mail, (action === MessageAction.IsDeleted));
              });
        }
      })
    );
  }

  sortMessages(messages: PermitMessageViewModel[]){
    return messages.sort((a, b) => {
      const dateA = a.dateCreatedUtc ? new Date(a.dateCreatedUtc) : new Date(8640000000000000);
      const dateB = b.dateCreatedUtc ? new Date(b.dateCreatedUtc) : new Date(8640000000000000);
      return dateB.getTime() - dateA.getTime();
    })
    .reduce<PermitMessageViewModel[]>((result, message) => {
      if (!result.some(m => m.applicationKey === message.applicationKey)) {
        result.push(message);
      }
      return result;
    }, []);
  } 
}

export enum MessageAction {
  IsReaded = 101,
  IsStarred,
  IsArchived,
  IsDeleted,
  isInTrash,
  UnTrash
}

export enum SenderType {
  System = 1,
  PortalUser = 2
}
