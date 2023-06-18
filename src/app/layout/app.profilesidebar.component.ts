import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../services/company.service';

@Component({
    selector: 'app-profilemenu',
    templateUrl: './app.profilesidebar.component.html'
})
export class AppProfileSidebarComponent {

    constructor(public layoutService: LayoutService,
		private companyService: CompanyService,
		private router: Router,
        private activatedRoute: ActivatedRoute) { }

    get visible(): boolean {
        return this.layoutService.state.profileSidebarVisible;
    }

    set visible(_val: boolean) {
        this.layoutService.state.profileSidebarVisible = _val;
    }

    onSignOut(){
        var company = this.companyService.getLocalCompany();
        localStorage.clear();
        this.router.navigate(['/'+company?.externalCompanyId+'/auth'], { relativeTo: this.activatedRoute });
    }

}