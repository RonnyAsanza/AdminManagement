import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { PortalUserViewModel } from 'src/app/models/auth/portal-user.model';
import { PermitMessageViewModel } from 'src/app/models/permit-messages.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PermitMessagesService } from 'src/app/services/permit-messages.service';

@Component({
  selector: 'app-message-home',
  templateUrl: './message-home.component.html',
  styleUrls: ['./message-home.component.scss'],
  providers: [MessageService]

})
export class MessageHomeComponent {
  mails: PermitMessageViewModel[] = [];
  user!: PortalUserViewModel;

  constructor(
    private userService: AuthService,
    private mailService: PermitMessagesService) {
    this.user = this.userService.getLocalUser();
    this.mailService.getAllMessages(this.user.portalUserKey!)
      .subscribe({
        next: (response) => {
          this.mails = response.data!;
          this.mailService.updateMails(this.mails);
        },
        error: (e) => {
        }
      });
  }
}
