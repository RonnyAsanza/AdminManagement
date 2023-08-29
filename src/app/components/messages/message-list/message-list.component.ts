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
        private mailService: PermitMessagesService,
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
        this.company = this.companyService.getLocalCompany();
        this.router.navigate(['/' + this.company.portalAlias + '/application/' + applicationKey]);
    }

    onRowSelect(mail: PermitMessageViewModel) {
        this.mailService.updateAndRefreshEmail(mail, MessageAction.IsReaded)
            .subscribe({
                next: (response) => {
                },
                error: (e) => {
                }
            });

        this.company = this.companyService.getLocalCompany();
        this.router.navigate(['/' + this.company.portalAlias + '/messages/detail/' + mail.permitMessageKey]);
    }

    onStar(event: Event, mail: PermitMessageViewModel) {

        this.mailService.updateAndRefreshEmail(mail, MessageAction.IsStarred)
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

        this.mailService.updateAndRefreshEmail(mail, MessageAction.IsArchived)
            .subscribe({
                next: (response) => {
                    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Mail archived', life: 3000 });
                },
                error: (e) => {
                }
            });

        event.stopPropagation();
    }

    onDelete(mail: PermitMessageViewModel) {

        this.mailService.updateAndRefreshEmail(mail, MessageAction.IsDeleted)
            .subscribe({
                next: (response) => {
                    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Mail deleted', life: 3000 });
                },
                error: (e) => {
                }
            });
    }

    onTrash(event: Event, mail: PermitMessageViewModel) {

        this.mailService.updateAndRefreshEmail(mail, MessageAction.IsDeleted)
            .subscribe({
                next: (response) => {
                    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Mail deleted', life: 3000 });
                },
                error: (e) => {
                }
            });

        event.stopPropagation();
    }

    onDeleteMultiple() {
        if (this.selectedMails && this.selectedMails.length > 0) {
            this.mailService.updateAndRefreshEmails(this.selectedMails, MessageAction.IsDeleted)
                .subscribe({
                    next: (response) => {
                        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Mails deleted', life: 3000 });
                    },
                    error: (e) => {
                    }
                });
        }
    }

    onArchiveMultiple() {

        if (this.selectedMails && this.selectedMails.length > 0) {
            this.mailService.updateAndRefreshEmails(this.selectedMails, MessageAction.IsArchived)
                .subscribe({
                    next: (response) => {
                        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Moved to archive', life: 3000 });
                    },
                    error: (e) => {
                    }
                });
        }
    }

    onReply(event: Event, mail: PermitMessageViewModel) {

        this.onRowSelect(mail);

        // event.stopPropagation();
        // this.mail = mail;
        // this.dialogVisible = true;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    onSpamMultiple() {
        /*   if (this.selectedMails && this.selectedMails.length > 0) {
               this.mailService.onSpamMultiple(this.selectedMails);
               this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Moved to spam', life: 3000 });
           }
         */
    }

    onBookmark(event: Event, id: number) {
        /* event.stopPropagation();
         this.mailService.onBookmark(id);*/
    }
}
