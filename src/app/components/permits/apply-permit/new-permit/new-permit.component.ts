import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Company } from 'src/app/models/company.model';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-new-permit',
  templateUrl: './new-permit.component.html',
  styleUrls: ['./new-permit.component.scss'],
  providers: [MessageService]
})
export class NewPermitComponent  {
  selectedIndex: number = 0;
  disablePagination: boolean = true;
  company!: Company;

  constructor(
    private router: Router,
    private companyService: CompanyService) { }

  onGoBack(){
    if(this.selectedIndex === 0)
    {
      this.company = this.companyService.getLocalCompany();
      this.router.navigate(['/'+this.company.portalAlias+'/']);
    }
     this.selectedIndex--;
  }

  onGoNext(){
    this.selectedIndex++;
  }

  onSelectPermitType(value: any) {
    this.selectedIndex = 1;
  }
}
