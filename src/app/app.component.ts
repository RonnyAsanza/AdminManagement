import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { ThemeService } from './services/theme.service';
import { CompanyService } from './services/company.service';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    constructor(
        private primengConfig: PrimeNGConfig,
        private themeService: ThemeService,
        private companyService: CompanyService,
        private router: Router,
    ) { }

    async ngOnInit(): Promise<void> {
        this.primengConfig.ripple = true;
        const storedTheme = await this.themeService.getStoredTheme();
        if (storedTheme) {
            this.themeService.changeTheme(storedTheme);
        }
        this.subscribeToRouterStartNavigationEvent();
    }


    subscribeToRouterStartNavigationEvent(): void {
        this.router.events.pipe(
            filter(event => event instanceof NavigationStart)
        ).subscribe(async () => {
            await this.setCompanyConfigurations();
        });
    }

    async setCompanyConfigurations(): Promise<void> {
        const loadedCompany = await this.companyService.getLocalCompany();
        const companyAlias = loadedCompany?.portalAlias;
        if (companyAlias) {
            this.companyService.getCompanyConfigurations(companyAlias)
            .subscribe({
                next: (response) => {
                    if(response.succeeded ){            
                        const company = response.data!;
                        this.companyService.setLocalCompany(company);
                    }
                }
            });
        }
    }

}