import { Component } from '@angular/core';
import { PortalUserViewModel } from 'src/app/models/auth/portal-user.model';
import { PermitMessageViewModel } from 'src/app/models/permit-messages.model';
import { AuthService } from 'src/app/services/auth/auth.service';
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
    private userService: AuthService, 
    private mailService: PermitMessagesService,) {
      this.subscription = this.mailService.mails$.subscribe(data => {
        this.mails = data.filter(d => !d.isArchived && !d.isDeleted && !d.hasOwnProperty('sent'));
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
