import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from 'src/app/models/company.model';
import { CompanyService } from 'src/app/services/company.service';
import { MessageService } from 'primeng/api';
import { Application } from 'src/app/models/application.model';
import { ApplicationService } from 'src/app/services/application.service';
import { ApplicationStatusViewModel, ApplicationStatusEnum } from '../../../models/application-status.model';

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss'],
  providers: [MessageService]
})

export class ApplicationListComponent implements OnInit {
  company!: Company;
  applications!: Application[];
  allApplications!: Application[];

  itemEditing!: string | null;

  selectedStatus!: ApplicationStatusViewModel[];
  status: ApplicationStatusViewModel[] = [];
  constructor(private companyService: CompanyService,
              private router: Router,
              private applicationService: ApplicationService,
              private messageService: MessageService,
              private activatedRoute: ActivatedRoute) { 
                
              }

  async ngOnInit(): Promise<void> {
    this.company = await this.companyService.getLocalCompany();
    if(this.company == null)
    {
      this.activatedRoute.params.subscribe(params => {
        let companyAlias = params['company'];
        this.router.navigate(['/'+companyAlias+'/auth']);
      });
    }

    this.getApplicationStatus();
    await this.getApplicationsByUser();
  }

  async getApplicationsByUser(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.applicationService.getApplicationsByUser()
      .subscribe({
        next: (response) => {
          if(response.succeeded )
          {
            this.allApplications = response.data!;
            this.filterApplicationStatus();
            resolve();
          }
        },
        error: (e) => {
          this.messageService.add({
            key: 'msg',
            severity: 'error',
            summary: 'Error',
            detail: e	
          });
          reject(e);
        }
      });
    });
  }

  setDefaultFilters(): void {
    this.selectedStatus = this.status.filter(status => status.code === ApplicationStatusEnum.approved 
      || status.code === ApplicationStatusEnum.requestReady
      || status.code === ApplicationStatusEnum.incomplete
      || status.code === ApplicationStatusEnum.resubmission);
  }

  filterApplicationStatus(): void {
    this.applications = this.selectedStatus && this.selectedStatus.length > 0 ? this.allApplications.filter(application => 
      this.selectedStatus.some(status => 
        application.applicationStatusCode === status.code
      )
    ) : this.allApplications;
  }

  getApplicationStatus(): void {
    this.applicationService.getApplicationStatus()
    .subscribe({
      next: (response) => {
        if(response.succeeded )
        {
          this.status = response.data??[];
          //this.deleteNoAllowStatus();
          this.setDefaultFilters();
        }
      },
      error: (e) => {
        console.log(e)
      }
    });
  }

  deleteNoAllowStatus(){
    this.status = this.status.map((item, index) => {
      return {
        ...item,
        disabled: item.code == ApplicationStatusEnum.requestReady || item.code == ApplicationStatusEnum.cancelled || item.code == ApplicationStatusEnum.new || item.code == ApplicationStatusEnum.deleted || item.code == ApplicationStatusEnum.complete || item.code == ApplicationStatusEnum.resubmission ? true : false
      }
    }).filter(
      item => !item.disabled
    );
  }

  onViewApplication(applicationId: any){
    this.router.navigate(['/' + this.company.portalAlias+'/application/' + applicationId]);
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