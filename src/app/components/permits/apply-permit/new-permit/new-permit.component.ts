import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApplyPermit } from 'src/app/models/apply-permit.model';
import { Company } from 'src/app/models/company.model';
import { CompanyService } from 'src/app/services/company.service';
import { PermitService } from 'src/app/services/permit.service';
import { SelectZoneComponent } from '../select-zone/select-zone.component';
import { SelectPermittypeComponent } from '../select-permittype/select-permittype.component';
import { PermitOptionsComponent } from '../permit-options/permit-options.component';
import { from } from 'rxjs';
import { GoogleMapsService } from '../../../../services/google-maps.service';

@Component({
  selector: 'app-new-permit',
  templateUrl: './new-permit.component.html',
  styleUrls: ['./new-permit.component.scss'],
  providers: [MessageService]
})
export class NewPermitComponent {
  @ViewChild(SelectZoneComponent) selectZoneComponent: SelectZoneComponent | undefined;
  @ViewChild(SelectPermittypeComponent) permitCategory: SelectPermittypeComponent | undefined;
  @ViewChild(PermitOptionsComponent) permitOptions: PermitOptionsComponent | undefined;

  selectedIndex: number = 0;
  disablePagination: boolean = true;
  company!: Company;
  permit!: ApplyPermit;
  zoneFlag: Boolean = false;
  isZoneView: Boolean = false;

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private googleMapsService: GoogleMapsService
  ) {
  }

  onGoBack() : void{
    var categoryFlag = this.selectZoneComponent?.permitTypeFlag

    if(this.selectedIndex === 0 || categoryFlag && this.zoneFlag){
      from(this.companyService.getLocalCompany())
      .subscribe(value => {
        this.company = value;
        this.router.navigate(['/'+this.company.portalAlias+'/']);
      });
      return;
    }

    if(this.zoneFlag && this.selectedIndex == 2){
      this.selectedIndex = 0;
      return;
    }

    if(categoryFlag && this.selectedIndex == 1){
	    from(this.companyService.getLocalCompany())
      .subscribe(value => {
        this.company = value;
        this.router.navigate(['/'+this.company.portalAlias+'/']);
      });
      return;
    }

    this.selectedIndex--;
    this.googleMapsService.cleanAddressAndPolygon();
  }

  onGoNext(){
    this.selectedIndex++;
  }

  onSelectPermitType() {
    this.selectedIndex++;
    if(this.zoneFlag){
      this.selectedIndex++;
    }
  }

  setPermitType() {
    this.selectZoneComponent?.setPermitType();
  }

  setZone(){
    this.zoneFlag = true;
  }

  onTabChange(event: any): void {
    if (event.index === 2) {
      //this.permitOptions?.showErrors('');
    }
  }
}
