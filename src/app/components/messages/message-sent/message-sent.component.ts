import { Component } from '@angular/core';
import { PermitMessageViewModel } from 'src/app/models/permit-messages.model';
import { PermitMessagesService } from 'src/app/services/permit-messages.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-message-sent',
  templateUrl: './message-sent.component.html',
  styleUrls: ['./message-sent.component.scss']
})
export class MessageSentComponent {
  mails: PermitMessageViewModel[] = [];
  subscription: Subscription;

  constructor( private mailService: PermitMessagesService) {
      this.subscription = this.mailService.mails$.subscribe(data => {
        this.mails = data.filter(d => d.senderType == "PortalUser");
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
