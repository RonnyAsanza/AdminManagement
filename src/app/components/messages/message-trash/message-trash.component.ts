import { Component } from '@angular/core';
import { PermitMessageViewModel } from 'src/app/models/permit-messages.model';
import { PermitMessagesService } from 'src/app/services/permit-messages.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-message-trash',
  templateUrl: './message-trash.component.html',
  styleUrls: ['./message-trash.component.scss']
})
export class MessageTrashComponent {
  mails: PermitMessageViewModel[] = [];
  subscription: Subscription;

  constructor( private mailService: PermitMessagesService) {
      this.subscription = this.mailService.mails$.subscribe(data => {
        this.mails = data.filter(d => d.isDeleted);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}