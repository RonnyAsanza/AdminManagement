import { Component, EventEmitter, Output } from '@angular/core';
import { ApplyPermit } from 'src/app/models/apply-permit.model';
import { Company } from 'src/app/models/company.model';
import { PermitTypeViewModel } from 'src/app/models/permit-type.model';
import { CompanyService } from 'src/app/services/company.service';
import { PermitService } from 'src/app/services/permit.service';
import { PermitTypeService } from 'src/app/services/permitType.service';

@Component({
  selector: 'app-select-permittype',
  templateUrl: './select-permittype.component.html',
  styleUrls: ['./select-permittype.component.scss']
})
export class SelectPermittypeComponent {
  permitTypes: PermitTypeViewModel[] = [];
  localCompany: Company = {};
  @Output() permitTypeSelected = new EventEmitter();

  constructor(private permitTypeService: PermitTypeService,
    private companyService: CompanyService,
    private permitService: PermitService) { 
      this.localCompany = this.companyService.getLocalCompany();
      this.permitTypeService.getPermitsTypeByCompanyKey(this.localCompany.companyKey!)
      .subscribe({
          next: (response) => {
              if(response.succeeded )
              {
                this.permitTypes = response.data??[];
              }
          },
          error: (e) => {
          }
      });
    }

    onSlectPermitType(permitType: PermitTypeViewModel){
      var permit = new ApplyPermit();
      permit.permitTypeKey = permitType.permitTypeKey;
      permit.permitTypeModel = permitType;
      permit.companyKey  = this.localCompany.companyKey;
      this.permitService.setLocalApplyPermit(permit);
      this.permitTypeSelected.emit();
    }
}
