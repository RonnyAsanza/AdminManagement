import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from 'src/app/models/company.model';
import { CompanyService } from 'src/app/services/company.service';
import { PermitService } from 'src/app/services/permit.service';
import { MessageService } from 'primeng/api';
import { Application } from 'src/app/models/application.model';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss'],
  providers: [MessageService]
})
export class ApplicationListComponent implements OnInit {
  company!: Company;
  applications!: Application[];

  itemEditing!: string | null;

  constructor(private companyService: CompanyService,
              private router: Router,
              private applicationService: ApplicationService,
              private messageService: MessageService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.company = this.companyService.getLocalCompany();
    if(this.company == null)
    {
      this.activatedRoute.params.subscribe(params => {
        let companyAlias = params['company'];
        this.router.navigate(['/'+companyAlias+'/auth']);
      });
    }

    this.applicationService.getApplicationsByUser()
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
