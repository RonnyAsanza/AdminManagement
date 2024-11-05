import { Component } from '@angular/core';
import { PermitMessageViewModel } from 'src/app/models/permit-messages.model';
import { PermitMessagesService } from 'src/app/services/permit-messages.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-message-archived',
  templateUrl: './message-archived.component.html',
  styleUrls: ['./message-archived.component.scss']
})
export class MessageArchivedComponent {
  mails: PermitMessageViewModel[] = [];
  subscription: Subscription;

  constructor(private mailService: PermitMessagesService) {
    this.subscription = this.mailService.mails$.subscribe(data => {
      this.mails = data.filter(d => d.isArchived);
      this.mails = this.mailService.sortMessages(this.mails);   
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
