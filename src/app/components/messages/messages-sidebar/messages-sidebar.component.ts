import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { filter, Subscription } from 'rxjs';
import { Company } from 'src/app/models/company.model';
import { PermitMessageViewModel } from 'src/app/models/permit-messages.model';
import { CompanyService } from 'src/app/services/company.service';
import { PermitMessagesService } from 'src/app/services/permit-messages.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { from } from 'rxjs';

@Component({
    selector: 'app-messages-sidebar',
    templateUrl: './messages-sidebar.component.html',
    styleUrls: ['./messages-sidebar.component.scss'],
    providers: [TranslatePipe]

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
        private permitMessagesService: PermitMessagesService,
        private translate: TranslatePipe) {
        this.mailSubscription = this.permitMessagesService
            .mails$.subscribe(data => this.getBadgeValues(data));
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
            archived = [],
            trash = [],
            sent = []

        for (let i = 0; i < data.length; i++) {
            let mail = data[i];

            if (!mail.isArchived && !mail.isInTrash && !mail.isReaded && !mail.hasOwnProperty('sent') && mail.senderType != 'PortalUser') {
                inbox.push(mail);
            }
            if (mail.isStarred && !mail.isArchived && !mail.isInTrash) {
                starred.push(mail);
            }
            if (mail.isArchived && !mail.isInTrash) {
                archived.push(mail);
            }
            if (mail.isInTrash) {
                trash.push(mail);
            }
            if (mail.senderType == 'PortalUser' && !mail.isArchived && !mail.isInTrash && !mail.isStarred && !mail.isReaded) {
                sent.push(mail);
            }
        }

        archived = this.permitMessagesService.sortMessages(archived);
        starred = this.permitMessagesService.sortMessages(starred);
        inbox = this.permitMessagesService.sortMessages(inbox);
        sent = this.permitMessagesService.sortMessages(sent);
        trash = this.permitMessagesService.sortMessages(trash);

        this.badgeValues = {
            inbox: inbox.length,
            starred: starred.length,
            archived: archived.length,
            trash: trash.length,
            sent: 0
        };

        this.updateSidebar();
    }

    updateSidebar() {
	    from(this.companyService.getLocalCompany())
        .subscribe(value => {
            this.company = value;
            this.items = [
                { label: this.translate.transform('ClientPermit.Inbox'), icon: 'pi pi-inbox', badge: this.badgeValues.inbox, routerLink: this.company.portalAlias + '/messages/inbox' },
                { label: this.translate.transform('ClientPermit.Starred'), icon: 'pi pi-star', badge: this.badgeValues.starred, routerLink: this.company.portalAlias + '/messages/starred' },
                { label: this.translate.transform('ClientPermit.Sent'), icon: 'pi pi-send', badge: this.badgeValues.sent, routerLink: this.company.portalAlias + '/messages/sent' },
                { label: this.translate.transform('ClientPermit.Archived'), icon: 'pi pi-book', badge: this.badgeValues.archived, routerLink: this.company.portalAlias + '/messages/archived' },
                { label: this.translate.transform('ClientPermit.Trash'), icon: 'pi pi-trash', badge: this.badgeValues.trash, routerLink: this.company.portalAlias + '/messages/trash' },
            ];
        });
    }

    ngOnDestroy() {
        this.mailSubscription.unsubscribe();
        this.routeSubscription.unsubscribe();
    }
}
