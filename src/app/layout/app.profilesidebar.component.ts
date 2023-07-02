import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../services/company.service';
import { AuthService } from '../services/auth/auth.service';
import { PortalUserViewModel } from '../models/auth/portal-user.model';

@Component({
    selector: 'app-profilemenu',
    templateUrl: './app.profilesidebar.component.html'
})
export class AppProfileSidebarComponent {
    user!: PortalUserViewModel;
    constructor(public layoutService: LayoutService,
		private companyService: CompanyService,
		private router: Router,
        private userService: AuthService, 
        private activatedRoute: ActivatedRoute) {
            this.user = this.userService.getLocalUser()
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

}