import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { CompanyService } from '../services/company.service';
import { Company } from '../models/company.model';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    constructor(private companyService: CompanyService) { }
    company!: Company;
    model: any[] = [];

    ngOnInit() {
        this.company = this.companyService.getLocalCompany();
        this.model = [
            {
                label: 'Home',
                icon: 'pi pi-home',
                items: [
                    {
                        label: 'Precise',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/'+this.company.portalAlias+'/']
                    },
                    {
                        label: 'Activity',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/'+this.company.portalAlias+'/activity']
                    },
                    {
                        label: 'Account',
                        icon: 'pi pi-fw pi-user',
                        routerLink: ['/'+this.company.portalAlias+'/account']
                    }
                ]
            },
            {
                label: 'Resources',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'About',
                        icon: 'pi pi-fw pi-globe',
                        routerLink: ['/about']
                    },

                ]
            },
          
        ];
    }
}
