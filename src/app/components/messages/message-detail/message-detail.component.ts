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
import { from } from 'rxjs';

@Component({
  selector: 'app-message-detail',
  templateUrl: './message-detail.component.html',
  styleUrls: ['./message-detail.component.scss']
})
export class MessageDetailComponent implements OnDestroy {
  newMail: PermitMessageViewModel = {};
  subscription: Subscription;
  mail: PermitMessageViewModel = {};
  id: any;
  company!: Company;
  user!: PortalUserViewModel;
  messageId!: string;

  constructor(private route: ActivatedRoute,
    private mailService: PermitMessagesService,
    private location: Location,
    private router: Router,
    private messageService: MessageService,
    private companyService: CompanyService,
    private userService: AuthService) {
    this.route.paramMap.subscribe(params => {
      var id = params.get('id');
      this.messageId = id!;
    });

    this.subscription = this.route.params.pipe(
      switchMap(params => {
        this.id = params['id'];
        return this.mailService.mails$
      })
    ).subscribe(data => {
      this.mail = data.filter(d => d.permitMessageKey == this.id)[0];
    });
  }

  goBack() {
    this.location.back();
  }

  sendMail() {
    if (this.newMail.message) {
      from(this.companyService.getLocalCompany())
      .subscribe(value => {
        this.company = value;
      });
	    from(this.userService.getLocalUser())
      .subscribe(value => {
        this.user = value;
      });
      this.newMail.companyKey = this.user.companyKey;
      this.newMail.portalUserKey = this.user.portalUserKey!;
      this.newMail.userKey = this.user.portalUserStatusKey;

      this.mailService.replayMessage(this.newMail, this.messageId)
        .subscribe({
          next: (response) => {
            
            let id = response.data;
            this.newMail.senderType = SenderType[SenderType.PortalUser];
            this.newMail.permitMessageKey = id;
            this.mailService.addReplayEmail(this.newMail);

            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Mail sent' });
            this.router.navigate(['/' + this.company.portalAlias + '/messages/inbox']);
          },
          error: (e) => {
          }
        });

      // this.newMail.to = this.mail.from ? this.mail.from : this.mail.to;
      // this.newMail.image = this.mail.image;

      // this.mailService.onSend(this.newMail);
    }

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
