import { Component } from '@angular/core';
import { PermitMessageViewModel } from 'src/app/models/permit-messages.model';
import { PermitMessagesService } from 'src/app/services/permit-messages.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-message-starred',
  templateUrl: './message-starred.component.html',
  styleUrls: ['./message-starred.component.scss']
})
export class MessageStarredComponent {
  mails: PermitMessageViewModel[] = [];
  subscription: Subscription;

  constructor( private mailService: PermitMessagesService) {
      this.subscription = this.mailService.mails$.subscribe(data => {
        this.mails = data.filter(d => d.isStarred);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
