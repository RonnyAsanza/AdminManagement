import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { filter, Subscription } from 'rxjs';
import { Company } from 'src/app/models/company.model';
import { PermitMessageViewModel } from 'src/app/models/permit-messages.model';
import { CompanyService } from 'src/app/services/company.service';
import { PermitMessagesService } from 'src/app/services/permit-messages.service';

@Component({
  selector: 'app-messages-sidebar',
  templateUrl: './messages-sidebar.component.html',
  styleUrls: ['./messages-sidebar.component.scss']
})
export class MessagesSidebarComponent {
  items: MenuItem[] = [];
  badgeValues: any;
  mailSubscription: Subscription;
  routeSubscription: Subscription;
  company!: Company;

  url: string = '';
  constructor(private router: Router, 
    private companyService: CompanyService,
    private mailService: PermitMessagesService) {
    this.mailSubscription = this.mailService.mails$.subscribe(data => this.getBadgeValues(data));

    this.routeSubscription = this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((params: any) => {
        this.url = params.url;
    });
  }

  navigate(item: MenuItem) {
      if (item.routerLink) {
          this.router.navigate([item.routerLink]);
      }
  }

  getBadgeValues(data: PermitMessageViewModel[]) {
      let inbox = [],
          starred = [],
          spam = [],
          important = [],
          archived = [],
          trash = [],
          sent = []

      for (let i = 0; i < data.length; i++) {
          let mail = data[i];

          if (!mail.isArchived && !mail.isDeleted && !mail.hasOwnProperty('sent')) {
              inbox.push(mail);
          }
          if (mail.isStarred && !mail.isArchived && !mail.isDeleted) {
              starred.push(mail);
          }
          if (mail.isArchived && !mail.isDeleted ) {
              archived.push(mail);
          }
          if (mail.isDeleted) {
              trash.push(mail);
          }
          if (mail.senderType == '' && !mail.isArchived && !mail.isDeleted) {
              sent.push(mail);
          }
      }

      this.badgeValues = {
          inbox: inbox.length,
          starred: starred.length,
          spam: spam.length,
          important: important.length,
          archived: archived.length,
          trash: trash.length,
          sent: sent.length
      };

      this.updateSidebar();
  }

  updateSidebar() {
    this.company = this.companyService.getLocalCompany();
      this.items = [
          { label: 'Inbox', icon: 'pi pi-inbox', badge: this.badgeValues.inbox, routerLink: this.company.portalAlias+'/messages/inbox' },
          { label: 'Starred', icon: 'pi pi-star', badge: this.badgeValues.starred, routerLink: this.company.portalAlias+'/messages/starred' },
          { label: 'Sent', icon: 'pi pi-send', badge: this.badgeValues.sent, routerLink: this.company.portalAlias+'/messages/sent' },
          { label: 'Archived', icon: 'pi pi-book', badge: this.badgeValues.archived, routerLink: this.company.portalAlias+'/messages/archived' },
          { label: 'Trash', icon: 'pi pi-trash', badge: this.badgeValues.trash, routerLink: this.company.portalAlias+'/messages/trash' },
      ];
  }

  ngOnDestroy() {
      this.mailSubscription.unsubscribe();
      this.routeSubscription.unsubscribe();
  }
}
