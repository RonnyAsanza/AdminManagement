import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { CompanyService } from '../services/company.service';
import { Company } from '../models/company.model';

@Component({
    selector: 'app-sidebar',
    templateUrl: './app.sidebar.component.html'
})
export class AppSidebarComponent implements OnInit {
    timeout: any = null;
    company!: Company;
    @ViewChild('menuContainer') menuContainer!: ElementRef;
    constructor(public layoutService: LayoutService, public el: ElementRef, private companyService: CompanyService) { }

    async ngOnInit(): Promise<void> {
        this.company = await this.companyService.getLocalCompany();
        console.log(this.company.companyLogo);
    }

    onMouseEnter() {
        if (!this.layoutService.state.anchored) {
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
            this.layoutService.state.sidebarActive = true;
        }
    }

    onMouseLeave() {
        if (!this.layoutService.state.anchored) {
            if (!this.timeout) {
                this.timeout = setTimeout(() => this.layoutService.state.sidebarActive = false, 300);
            }
        }
    }

    anchor() {
        this.layoutService.state.anchored = !this.layoutService.state.anchored;
    }
}