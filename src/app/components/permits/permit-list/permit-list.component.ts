import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from 'src/app/models/company.model';
import { Permit } from 'src/app/models/permit.model';
import { CompanyService } from 'src/app/services/company.service';
import { PermitService } from 'src/app/services/permit.service';
import { MessageService } from 'primeng/api';
import { PermitStatusEnum, PermitStatusViewModel } from '../../../models/permit-status.model';

@Component({
  selector: 'app-permit-list',
  templateUrl: './permit-list.component.html',
  styleUrls: ['./permit-list.component.scss'],
  providers: [MessageService]
})
export class PermitListComponent implements OnInit {
  company!: Company;
  permits!: Permit[];
  allPermits!: Permit[];
  itemEditing!: string | null;
  
  selectedStatus!: PermitStatusViewModel[];
  status: PermitStatusViewModel[] = [];
  constructor(
    private companyService: CompanyService,
    private router: Router,
    private permitService: PermitService,
    private activatedRoute: ActivatedRoute
  ) { }

  async ngOnInit(): Promise<void> {
    //validate company-user
    this.company = await this.companyService.getLocalCompany();
    if(this.company == null)
    {
      this.activatedRoute.params.subscribe(params => {
        let companyAlias = params['company'];
        this.router.navigate(['/'+companyAlias+'/auth']);
      });
    }
    await this.getPermitsByUser();
    this.getPermitsStatus();

  }

  async getPermitsByUser(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.permitService.getPermitsByUser()
      .subscribe({
        next: (response) => {
          if(response.succeeded )
          {
            this.permits = response.data!;
            this.allPermits = response.data!;
            resolve();
          }
        },
        error: (e) => {
          reject(e);
        }
      });
    });
  }

  setDefaultFilters(): void {
    this.selectedStatus = this.status.filter(status => status.code === PermitStatusEnum.active);
  }
  

  filterPermitStatus(): void {
    this.permits = this.selectedStatus && this.selectedStatus.length > 0 ? this.allPermits.filter(permit => 
      this.selectedStatus.some(status => 
        permit.permitStatusCode === status.code
      )
    ) : this.allPermits;
  }

  getPermitsStatus(): void {
    this.permitService.getPermitStatus()
    .subscribe({
      next: (response) => {
        if(response.succeeded )
        {
          this.status = response.data??[];
          this.setDefaultFilters();
          this.filterPermitStatus();
        }
      },
      error: (e) => {
        console.log(e)
      }
    });
  }

  onViewPermit(permitId: any){
    this.router.navigate(['/' + this.company.portalAlias+'/permits/' + permitId]);
  }

  onEditPermit(permitGuid: any) {
    if(this.itemEditing)
    {

      this.itemEditing = null;

    }
    else
      this.itemEditing = permitGuid;
  }

  onCancelEdit(){
    this.itemEditing = null;
  }
}
