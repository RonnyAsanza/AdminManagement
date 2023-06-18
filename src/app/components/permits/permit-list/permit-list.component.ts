import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from 'src/app/models/company.model';
import { Permit } from 'src/app/models/permit.model';
import { CompanyService } from 'src/app/services/company.service';
import { PermitService } from 'src/app/services/permit.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-permit-list',
  templateUrl: './permit-list.component.html',
  styleUrls: ['./permit-list.component.scss'],
  providers: [MessageService]
})
export class PermitListComponent implements OnInit {
  company!: Company;
  permits!: Permit[];

  constructor(private companyService: CompanyService,
              private router: Router,
              private permitService: PermitService,
              private messageService: MessageService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    //validate company-user
    this.company = this.companyService.getLocalCompany();
    if(this.company == null)
    {
      this.activatedRoute.params.subscribe(params => {
        let companyGuid = params['company'];
        this.router.navigate(['/'+companyGuid+'/auth']);
      });
    }

    this.permitService.getPermitsByUser()
    .subscribe({
			next: (response) => {
        if(response.succeeded )
        {
          this.permits = response.data!;
        }
			},
			error: (e) => {
				console.log("errorr");
				this.messageService.add({
					key: 'msg',
					severity: 'error',
					summary: 'Error',
					detail: e	
				});
			}
    });
  }

  onClickNewPermit(){
    this.router.navigate(['/'+this.company.externalCompanyId+'/new-permit']);
  }
  onViewPermit(permitId: any){
    this.router.navigate(['/' + this.company.externalCompanyId+'/permits/' + permitId]);
  }

}
