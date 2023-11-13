import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from 'src/app/models/company.model';
import { Permit } from 'src/app/models/permit.model';
import { CompanyService } from 'src/app/services/company.service';
import { PermitService } from 'src/app/services/permit.service';
import { MessageService } from 'primeng/api';
import { from } from 'rxjs';

@Component({
  selector: 'app-permit-list',
  templateUrl: './permit-list.component.html',
  styleUrls: ['./permit-list.component.scss'],
  providers: [MessageService]
})
export class PermitListComponent implements OnInit {
  company!: Company;
  permits!: Permit[];
  itemEditing!: string | null;
  constructor(private companyService: CompanyService,
              private router: Router,
              private permitService: PermitService,
              private messageService: MessageService,
              private activatedRoute: ActivatedRoute) { }

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

    this.permitService.getPermitsByUser()
    .subscribe({
			next: (response) => {
        if(response.succeeded )
        {
          this.permits = response.data!;
        }
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
