import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { PortalUserViewModel } from 'src/app/models/auth/portal-user.model';
import { Company } from 'src/app/models/company.model';
import { PermitMessageViewModel } from 'src/app/models/permit-messages.model';
import { CompanyService } from 'src/app/services/company.service';
import { MessageAction, PermitMessagesService } from 'src/app/services/permit-messages.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { from } from 'rxjs';

@Component({
    selector: 'app-message-list',
    templateUrl: './message-list.component.html',
    styleUrls: ['./message-list.component.scss'],
    providers: [MessageService, TranslatePipe]
})
export class MessageListComponent implements OnInit {
    @Input() mails!: PermitMessageViewModel[];
    company!: Company;
    user!: PortalUserViewModel;
    selectedMails: PermitMessageViewModel[] = [];
    mail: PermitMessageViewModel = {};
    dialogVisible: boolean = false;
    menuItems: MenuItem[] = [];

    constructor(private router: Router,
        private companyService: CompanyService,
        private permitMessagesService: PermitMessagesService,
        private messageService: MessageService,
        private translate: TranslatePipe) {
    }

    ngOnInit(): void {
        this.menuItems = [
            { label: this.translate.transform('ClientPermit.Archive'), icon: 'pi pi-fw pi-file', command: () => this.onArchiveMultiple() },
            { label: this.translate.transform('ClientPermit.Delete'), icon: 'pi pi-fw pi-trash', command: () => this.onDeleteMultiple() },
        ];
    }

    toggleOptions(event: Event, opt: HTMLElement, date: HTMLElement) {
        if (event.type === 'mouseenter') {
            opt.style.display = 'flex';
            date.style.display = 'none';
        } else {
            opt.style.display = 'none';
            date.style.display = 'flex';
        }
    }

    onGoToApplication(applicationKey: string) {
	    from(this.companyService.getLocalCompany())
        .subscribe(value => {
            this.company = value;
            this.router.navigate(['/' + this.company.portalAlias + '/application/' + applicationKey]);
        });
    }

    onRowSelect(mail: PermitMessageViewModel) {
        this.permitMessagesService.updateMessagesByApplication(mail, MessageAction.IsReaded)
            .subscribe();

        from(this.companyService.getLocalCompany())
        .subscribe(value => {
            this.company = value;
            this.router.navigate(['/' + this.company.portalAlias + '/messages/detail/' + mail.permitMessageKey]);
        });       
    }

    onStar(event: Event, mail: PermitMessageViewModel) {
        this.permitMessagesService.updateMessagesByApplication(mail, MessageAction.IsStarred)
            .subscribe({
                next: (response) => {
                    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Mail Star', life: 3000 });
                },
                error: (e) => {
                }
            });

        event.stopPropagation();
    }

    onArchive(event: Event, mail: PermitMessageViewModel) {
        this.permitMessagesService.updateMessagesByApplication(mail, MessageAction.IsArchived)
            .subscribe({
                next: (response) => {
                    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Mail archived', life: 3000 });
                },
            });

        event.stopPropagation();
    }

    onDelete(event: Event, mail: PermitMessageViewModel) {
        this.permitMessagesService.updateMessagesByApplication(mail, MessageAction.IsDeleted)
            .subscribe({
                next: (response) => {
                    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Mail deleted', life: 3000 });
                },
            });
        event.stopPropagation();
    }

    onTrash(event: Event, mail: PermitMessageViewModel) {
        this.permitMessagesService.updateMessagesByApplication(mail, mail.isInTrash? MessageAction.IsDeleted : MessageAction.isInTrash)
            .subscribe({
                next: (response) => {
                    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Mail deleted', life: 3000 });
                },
            });
        event.stopPropagation();
    }

    onUnTrash(event: Event, mail: PermitMessageViewModel) {
        console.log("onUnTrash", mail);
        this.permitMessagesService.updateMessagesByApplication(mail, MessageAction.UnTrash)
            .subscribe({
                next: (response) => {
                    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Mail deleted', life: 3000 });
                },
            });
        event.stopPropagation();
    }

    onDeleteMultiple() {
        if (this.selectedMails && this.selectedMails.length > 0) {
            const applicationskeys = new Set<string>();
            this.selectedMails.forEach(message => {
                applicationskeys.add(message.applicationKey!);
              });
            this.permitMessagesService.updateMessagesByApplications(Array.from(applicationskeys), this.selectedMails[0].isInTrash? MessageAction.IsDeleted: MessageAction.isInTrash)
                .subscribe({
                    next: (response) => {
                        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Mails deleted', life: 3000 });
                    },
                });
        }
    }

    onArchiveMultiple() {
        if (this.selectedMails && this.selectedMails.length > 0) {
            const applicationskeys = new Set<string>();
            this.selectedMails.forEach(message => {
                applicationskeys.add(message.applicationKey!);
              });
            this.permitMessagesService.updateMessagesByApplications(Array.from(applicationskeys), MessageAction.IsArchived)
                .subscribe({
                    next: (response) => {
                        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Messages Archived!', life: 3000 });
                    },
                });
        }
    }

    onReply(event: Event, mail: PermitMessageViewModel) {
        this.onRowSelect(mail);
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
