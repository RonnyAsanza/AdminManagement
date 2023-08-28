import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { PortalUserViewModel } from 'src/app/models/auth/portal-user.model';
import { Company } from 'src/app/models/company.model';
import { PermitMessageViewModel } from 'src/app/models/permit-messages.model';
import { CompanyService } from 'src/app/services/company.service';
import { PermitMessagesService } from 'src/app/services/permit-messages.service';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss']
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
        private messageService: MessageService) {
        }

    ngOnInit(): void {

          this.menuItems = [
              { label: 'Archive', icon: 'pi pi-fw pi-file', command: () => this.onArchiveMultiple() },
              { label: 'Delete', icon: 'pi pi-fw pi-trash', command: () => this.onDeleteMultiple() },
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


    onGoToApplication(applicationKey: string){
        this.company = this.companyService.getLocalCompany();
        this.router.navigate(['/'+this.company.portalAlias+'/application/'+applicationKey]);
    }

    onRowSelect(id: string) {
        console.log(id);
        this.company = this.companyService.getLocalCompany();
        this.router.navigate(['/'+this.company.portalAlias+'/messages/detail/' + id]);

    }

    onStar(event: Event, id: string) {
        event.stopPropagation();
        this.mailService.onStar(id);
    }

    onArchive(event: Event, id: string) {
        event.stopPropagation();
        this.mailService.onArchive(id);
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Mail archived', life: 3000 });
    }

    onBookmark(event: Event, id: number) {
       /* event.stopPropagation();
        this.mailService.onBookmark(id);*/
    }

    onDelete(permitMessageKey: string) {
        this.mailService.onDelete(permitMessageKey);
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Mail deleted', life: 3000 });
    }

    onDeleteMultiple() {
        if (this.selectedMails && this.selectedMails.length > 0) {
            this.mailService.onDeleteMultiple(this.selectedMails);
            this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Mails deleted', life: 3000 });
        }
    }

    onSpamMultiple() {
     /*   if (this.selectedMails && this.selectedMails.length > 0) {
            this.mailService.onSpamMultiple(this.selectedMails);
            this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Moved to spam', life: 3000 });
        }
      */
    }

    onArchiveMultiple() {
        if (this.selectedMails && this.selectedMails.length > 0) {
            this.mailService.onArchiveMultiple(this.selectedMails);
            this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Moved to archive', life: 3000 });
        }
    }

    onTrash(event: Event, mail: PermitMessageViewModel) {
        event.stopPropagation();
        if (mail.isDeleted) {
            this.onDelete(mail.permitMessageKey!)
        }
     //   this.mailService.onTrash(mail);
    }

    onReply(event: Event, mail: PermitMessageViewModel) {
        event.stopPropagation();
        this.mail = mail;
        this.dialogVisible = true;
    }
    
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }


}
