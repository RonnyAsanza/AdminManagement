import { Component, EventEmitter, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ApplyPermit } from 'src/app/models/apply-permit.model';
import { Company } from 'src/app/models/company.model';
import { PermitCategoryViewModel } from 'src/app/models/permit-category.model';
import { CompanyService } from 'src/app/services/company.service';
import { PermitCategoryService } from 'src/app/services/permit-category.service';
import { PermitService } from 'src/app/services/permit.service';

@Component({
  selector: 'app-select-permittype',
  templateUrl: './select-permittype.component.html',
  styleUrls: ['./select-permittype.component.scss']
})
export class SelectPermittypeComponent {
  permitCategories: PermitCategoryViewModel[] = [];
  localCompany: Company = {};
  @Output() permitTypeSelected = new EventEmitter();

  constructor(private permitCategoryService: PermitCategoryService,
    private companyService: CompanyService,
    private permitService: PermitService,
    private sanitizer: DomSanitizer) { 
      this.localCompany = this.companyService.getLocalCompany();
      this.permitCategoryService.getPermitCategories(this.localCompany.companyKey!)
      .subscribe({
          next: (response) => {
              if(response.succeeded )
              {
                this.permitCategories = response.data??[];
                this.permitCategories.forEach(permit =>{
                  if(permit.image)
                  {
                    let imageUrlString = `data:png;base64,${permit.image}`;
                    permit.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrlString);
                  }
                });
              }
          }
      });
    }

    onSelectPermitCategory(permitCategory: PermitCategoryViewModel){
      var permit = new ApplyPermit();
      permit.permitCategory = permitCategory;
      permit.companyKey  = this.localCompany.companyKey;
      this.permitService.setLocalApplyPermit(permit);
      this.permitTypeSelected.emit();
    }
}