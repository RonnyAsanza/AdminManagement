import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { CompanyService } from '../services/company.service';
import { Company } from '../models/company.model';
import { TranslatePipe } from '../components/shared/pipes/translate.pipe';
import { from } from 'rxjs';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    providers: [ TranslatePipe ]
})
export class AppMenuComponent implements OnInit {

    constructor(private companyService: CompanyService,
        private translate: TranslatePipe) { }
    company!: Company;
    model: any[] = [];

    ngOnInit() {
        var companyPromise = from(this.companyService.getLocalCompany());
        companyPromise.subscribe(value => {
          this.company = value;
            this.model = [
                {
                    label: this.translate.transform('ClientPermit.Home'),
                    icon: 'pi pi-home',
                    items: [
                        {
                            label: this.translate.transform('ClientPermit.Home'),
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/'+this.company.portalAlias+'/']
                        },
                        {
                            label: this.translate.transform('ClientPermit.Applications'),
                            icon: 'pi pi-fw pi-book',
                            routerLink: ['/'+this.company.portalAlias+'/1/activity']
                        },
                        {
                            label: this.translate.transform('ClientPermit.Permits'),
                            icon: 'pi pi-fw pi-book',
                            routerLink: ['/'+this.company.portalAlias+'/2/activity']
                        },
                        {
                            label: 'Messages',
                            icon: 'pi pi-fw pi-user',
                            routerLink: ['/'+this.company.portalAlias+'/messages']
                        },
                        {
                            label: 'Apply for new Permit',
                            icon: 'pi pi-plus-circle',
                            routerLink: ['/'+this.company.portalAlias+'/new-permit']
                        }
                    ]
                }
            ];
        });
       
    }
}
