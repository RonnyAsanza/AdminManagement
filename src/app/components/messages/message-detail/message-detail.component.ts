import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { PermitMessageViewModel } from 'src/app/models/permit-messages.model';
import { PermitMessagesService, SenderType } from 'src/app/services/permit-messages.service';
import { CompanyService } from 'src/app/services/company.service';
import { Company } from 'src/app/models/company.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PortalUserViewModel } from 'src/app/models/auth/portal-user.model';

@Component({
  selector: 'app-message-detail',
  templateUrl: './message-detail.component.html',
  styleUrls: ['./message-detail.component.scss']
})
export class MessageDetailComponent implements OnDestroy {
  newMessage: PermitMessageViewModel = {};
  subscription: Subscription;
  mail: PermitMessageViewModel = {};
  messages!: PermitMessageViewModel[];
  id: any;
  company!: Company;
  user!: PortalUserViewModel;
  messageId!: string;

  constructor(private route: ActivatedRoute,
    private permitMessagesService: PermitMessagesService,
    private location: Location,
    private router: Router,
    private messageService: MessageService,
    private companyService: CompanyService,
    private userService: AuthService) {
    this.newMessage.message = "";
    this.route.paramMap.subscribe(params => {
      var id = params.get('id');
      this.messageId = id!;
    });

    this.subscription = this.route.params.pipe(
      switchMap(params => {
        this.id = params['id'];
        return this.permitMessagesService.mails$
      })
    ).subscribe(data => {
      this.mail = data.filter(d => d.permitMessageKey == this.id)[0];

      this.messages = data
      .filter(d => d.applicationKey === this.mail.applicationKey);

      if(this.messages?.length > 1)
      { 
        this.messages.sort((a, b) => {
          let dateA = a['dateCreatedUtc'] ? new Date(a['dateCreatedUtc']) : new Date(8640000000000000)
          let dateB = b['dateCreatedUtc'] ? new Date(b['dateCreatedUtc']) : new Date(8640000000000000)
          return dateA.getTime() - dateB.getTime()
        })
      }
    });
  }

  goBack() {
    this.location.back();
  }

  async sendMail() {
    if (this.newMessage.message) {
      this.company = await this.companyService.getLocalCompany();
      this.user = await this.userService.getLocalUser();

      this.newMessage.companyKey = this.user.companyKey;
      this.newMessage.portalUserKey = this.user.portalUserKey!;
      this.newMessage.userKey = this.user.portalUserStatusKey;

      this.permitMessagesService.replayMessage(this.newMessage, this.messageId)
        .subscribe({
          next: (response) => {
            let id = response.data;
            this.newMessage.senderType = SenderType[SenderType.PortalUser];
            this.newMessage.permitMessageKey = id;
            this.permitMessagesService.addReplayEmail(this.newMessage);

            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message sent successfully!' });
            
            this.router.navigate(['/' + this.company.portalAlias + '/messages/detail/' + this.mail.permitMessageKey]);

            this.newMessage = {};
          },
        });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
