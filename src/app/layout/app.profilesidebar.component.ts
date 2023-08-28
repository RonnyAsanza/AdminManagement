import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../services/company.service';
import { AuthService } from '../services/auth/auth.service';
import { PortalUserViewModel } from '../models/auth/portal-user.model';
import { UnreadMessageViewModel } from '../models/unread-messages.model';
import { PermitMessagesService } from '../services/permit-messages.service';

@Component({
    selector: 'app-profilemenu',
    templateUrl: './app.profilesidebar.component.html'
})
export class AppProfileSidebarComponent {
    user!: PortalUserViewModel;
    messages: UnreadMessageViewModel[] = new Array<UnreadMessageViewModel>();

    constructor(public layoutService: LayoutService,
		private companyService: CompanyService,
		private router: Router,
        private userService: AuthService, 
        private activatedRoute: ActivatedRoute,
        private permitMessagesService: PermitMessagesService) {
            this.user = this.userService.getLocalUser();
            this.permitMessagesService.GetUnreadMessages(this.user.portalUserKey!)
            .subscribe({
                next: (response) => {
                if(response.succeeded )
                {
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

    onSignOut(){
        var company = this.companyService.getLocalCompany();
        localStorage.clear();
        this.router.navigate(['/'+company?.portalAlias+'/auth'], { relativeTo: this.activatedRoute });
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
}