import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from 'src/app/models/company.model';
import { Permit } from 'src/app/models/permit.model';
import { CompanyService } from 'src/app/services/company.service';
import { PermitService } from 'src/app/services/permit.service';
import { MessageService } from 'primeng/api';
import { Application } from 'src/app/models/application.model';
import { ApplicationService } from 'src/app/services/application.service';
@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss'],
  providers: [MessageService]
})

export class ActivityListComponent implements OnInit {
  company!: Company;
  permits!: Permit[];
  applications!: Application[];

  constructor(private companyService: CompanyService,
              private router: Router,
              private permitService: PermitService,
              private applicationService: ApplicationService,
              private messageService: MessageService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    //validate company-user
    this.company = this.companyService.getLocalCompany();
    if(this.company == null)
    {
      this.activatedRoute.params.subscribe(params => {
        let companyAlias = params['company'];
        this.router.navigate(['/'+companyAlias+'/auth']);
      });
    }

    this.permitService.GetLastPermits(5)
    .subscribe({
			next: (response) => {
        if(response.succeeded )
        {
          this.permits = response.data!;
        }
			},
			error: (e) => {
				this.messageService.add({
					key: 'msg',
					severity: 'error',
					summary: 'Error',
					detail: e	
				});
			}
    });

    this.applicationService.getLasApplications(3)
    .subscribe({
			next: (response) => {
        if(response.succeeded )
        {
          this.applications = response.data!;
        }
			},
			error: (e) => {
				this.messageService.add({
					key: 'msg',
					severity: 'error',
					summary: 'Error',
					detail: e	
				});
			}
    });
  }

  onViewPermit(permitId: any){
    this.router.navigate(['/' + this.company.portalAlias+'/permits/' + permitId]);
  }
  onViewApplication(applicationId: any){
    this.router.navigate(['/' + this.company.portalAlias+'/application/' + applicationId]);
  }
}
