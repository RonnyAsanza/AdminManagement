import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../services/company.service';
import { AuthService } from '../services/auth/auth.service';
import { PortalUserViewModel } from '../models/auth/portal-user.model';
import { UnreadMessageViewModel } from '../models/unread-messages.model';
import { MessageAction, PermitMessagesService } from '../services/permit-messages.service';
import { Company } from 'src/app/models/company.model';
import { PermitMessageViewModel } from '../models/permit-messages.model';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-profilemenu',
  templateUrl: './app.profilesidebar.component.html'
})
export class AppProfileSidebarComponent {
  user!: PortalUserViewModel;
  messages: UnreadMessageViewModel[] = new Array<UnreadMessageViewModel>();
  company!: Company;

  constructor(public layoutService: LayoutService,
    private companyService: CompanyService,
    private router: Router,
    private userService: AuthService,
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private permitMessagesService: PermitMessagesService) {
    this.user = this.userService.getLocalUser();
    this.company = this.companyService.getLocalCompany();
    this.permitMessagesService.GetUnreadMessages(this.user.portalUserKey!)
      .subscribe({
        next: (response) => {
          if (response.succeeded) {
            this.messages = response.data!;
          }
        },
        error: (e) => {
        }
      });
  }

  get visible(): boolean {
    return this.layoutService.state.profileSidebarVisible;
  }

  set visible(_val: boolean) {
    this.layoutService.state.profileSidebarVisible = _val;
  }

  onSignOut() {
    var company = this.companyService.getLocalCompany();
    this.localStorageService.clear();
    this.router.navigate(['/' + company?.portalAlias + '/auth'], { relativeTo: this.activatedRoute });
  }

  getIconClass(messageType: string): string {
    switch (messageType) {
      case 'Warning':
        return 'pi pi-exclamation-triangle text-warning';
      case 'Error   ':
        return 'pi pi-times-circle text-red-400';
      case 'Success':
        return 'pi pi-comment text-xl text-primary';
      default:
        return 'pi pi-exclamation-triangle text-xl text-red-400';
    }
  }

  redirectToMessageDetail(mail: PermitMessageViewModel) {
    if (mail && this.company && this.company.portalAlias) {
      this.visible = false;

      this.permitMessagesService.updateAndRefreshEmail(mail, MessageAction.IsReaded)
        .subscribe({
          next: (response) => {
            const index = this.messages.findIndex(x => x.permitMessageKey === mail.permitMessageKey);
            if (index !== -1) {
              this.messages.splice(index, 1);
            }
          },
          error: (e) => {
          }
        });

      this.router.navigate(['/' + this.company.portalAlias + '/messages/detail/' + mail.permitMessageKey!]);
    }
  }
}