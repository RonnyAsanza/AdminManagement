import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Company } from 'src/app/models/company.model';
import { CompanyService } from 'src/app/services/company.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
  providers: [MessageService]

})
export class CompanyListComponent implements OnInit {
  companies: Company[] = [];
  displayedColumns: string[] = [ 'externalCompanyId', 'name', 'portalAlias'];

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.companyService.getAllCompanies()
    .subscribe((response)=>{
      if(response.succeeded )
       {
          this.companies = response.data!;
       }
      }
    );
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onGoToCompany(company: Company) {
    this.localStorageService.clear();
    this.companyService.setLocalCompany(company);
    this.router.navigate(['/'+company.portalAlias+'/auth']);
   }
}
