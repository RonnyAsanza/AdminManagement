import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';

import { ApplyPermit } from 'src/app/models/apply-permit.model';
import { Company } from 'src/app/models/company.model';
import { ZoneViewModel } from 'src/app/models/zone.model';
import { CompanyService } from 'src/app/services/company.service';
import { PermitService } from 'src/app/services/permit.service';
import { ZoneService } from 'src/app/services/zone.service';

@Component({
  selector: 'app-select-zone',
  templateUrl: './select-zone.component.html',
  styleUrls: ['./select-zone.component.scss'],
  providers: [MessageService]
})
export class SelectZoneComponent {
  zones: ZoneViewModel[] = [];
  @Output() goNext = new EventEmitter();
  localCompany: Company = {};
  zoneControl = new FormControl('');

  constructor(private zone: ZoneService,
    private companyService: CompanyService,
    private permitService: PermitService) { 
      this.localCompany = this.companyService.getLocalCompany();
      this.zone.getZonesByCompany(this.localCompany.companyKey!)
      .subscribe({
          next: (response) => {
              if(response.succeeded )
              {
                this.zones = response.data??[];
              }
          },
          error: (e) => {
          }
      });
    }


    onClickNext(){
      var zone: any = this.zoneControl.value;
      if(zone && zone.name)
    {
        var permit = new ApplyPermit();
        permit.zoneName = zone.name;
        permit.zoneKey = zone.zoneKey;
        permit.zoneType = zone.zoneType;
        permit.zoneTypeKey = zone.zoneTypeKey;
        permit.companyKey  = this.localCompany.companyKey;
  
        this.permitService.setLocalApplyPermit(permit);
        this.goNext.emit();
      }
    }

}
