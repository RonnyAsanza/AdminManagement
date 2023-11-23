import { Component, EventEmitter, OnInit, Output} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ApplyPermit } from 'src/app/models/apply-permit.model';
import { Company } from 'src/app/models/company.model';
import { PermitCategoryViewModel } from 'src/app/models/permit-category.model';
import { CompanyService } from 'src/app/services/company.service';
import { PermitCategoryService } from 'src/app/services/permit-category.service';
import { PermitService } from 'src/app/services/permit.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ApiErrorViewModel } from 'src/app/models/api-error.model';
import { TranslateService } from 'src/app/services/translate.service';

@Component({
  selector: 'app-select-permittype',
  templateUrl: './select-permittype.component.html',
  styleUrls: ['./select-permittype.component.scss']
})
export class SelectPermittypeComponent implements OnInit{
  permitCategories: PermitCategoryViewModel[] = [];
  localCompany: Company = {};
  @Output() permitTypeSelected = new EventEmitter();
  @Output() setPermitType = new EventEmitter();

  constructor(private permitCategoryService: PermitCategoryService, private companyService: CompanyService,
    private permitService: PermitService, private sanitizer: DomSanitizer, private messageService: MessageService,
    private router: Router, private translate: TranslateService) { }

    ngOnInit(){
      this.localCompany = this.companyService.getLocalCompany();

      this.permitCategoryService.getPermitCategories(this.localCompany.companyKey!)
      .subscribe({
        next: (response) => {
          if(response.succeeded )
          {
            if(response.data == null || response.data == undefined)
            {
              this.permitService.displayError(this.translate.data.find(translation => translation.labelCode == 'ClientPermit.NoCategories')?.textValue || 'ClientPermit.NoCategories')
              this.router.navigate(['/'+this.localCompany.portalAlias+'/permit-home']);
            } 
            else 
            {
              this.permitCategories = response.data as PermitCategoryViewModel[];
              this.permitCategories.forEach(permit =>{
                if(permit.image)
                {
                  let imageUrlString = `data:png;base64,${permit.image}`;
                  permit.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrlString);
                }
              });
              
              if(this.permitCategories.length == 1)
              {
                this.setPermitType.emit()
                this.onSelectPermitCategory(this.permitCategories[0]);
              }
            }
          } 
          else 
          {
            var error = response.data as ApiErrorViewModel;
            this.showException(error);
          }
        }
      });
    }

    onSelectPermitCategory(permitCategory: PermitCategoryViewModel){
      var permit = this.permitService.getLocalApplyPermit();
      permit.permitCategory = permitCategory;
      permit.companyKey  = this.localCompany.companyKey;
      this.permitService.setLocalApplyPermit(permit);
      this.permitTypeSelected.emit();
    }

    showException(apiError: ApiErrorViewModel){
      var errorMessage = this.translate.data.find(translation => translation.labelCode == apiError.message)?.textValue || apiError.message
      this.messageService.add({
        key: 'msg',
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 10000
      });
    }
}