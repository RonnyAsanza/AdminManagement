import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { PermitMessageViewModel } from 'src/app/models/permit-messages.model';
import { PermitMessagesService } from 'src/app/services/permit-messages.service';


@Component({
  selector: 'app-message-detail',
  templateUrl: './message-detail.component.html',
  styleUrls: ['./message-detail.component.scss']
})
export class MessageDetailComponent implements OnDestroy {
  newMail: PermitMessageViewModel = { };
  subscription: Subscription;
  mail: PermitMessageViewModel = {};
  id: any;
  constructor(private route: ActivatedRoute, 
    private mailService: PermitMessagesService, 
    private location: Location, 
    private router: Router, 
    private messageService: MessageService) {

      this.route.paramMap.subscribe(params => {
        var id = params.get('id');
        console.log(id);
      });

    this.subscription = this.route.params.pipe(
        switchMap(params => {
            this.id = params['id'];
            console.log(this.id);
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
 /*   if (this.newMail.message) {
        this.newMail.to = this.mail.from ? this.mail.from : this.mail.to;
        this.newMail.image = this.mail.image;
        
        this.mailService.onSend(this.newMail);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Mail sent' });
        this.router.navigate(['apps/mail/inbox']);
    }
  */
}

ngOnDestroy() {
    this.subscription.unsubscribe();
}

}
