import { Component } from '@angular/core';
import { PermitMessageViewModel } from 'src/app/models/permit-messages.model';
import { PermitMessagesService } from 'src/app/services/permit-messages.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-message-inbox',
  templateUrl: './message-inbox.component.html',
  styleUrls: ['./message-inbox.component.scss']
})
export class MessageInboxComponent {
  mails: PermitMessageViewModel[] = [];
  subscription: Subscription;

  constructor(
    private mailService: PermitMessagesService,) {
      this.subscription = this.mailService.mails$.subscribe(data => {
        this.mails = data.filter(d => !d.isArchived && !d.isInTrash && !d.hasOwnProperty('sent') && d.senderType != "PortalUser");
        this.mails = this.mailService.sortMessages(this.mails);   
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
