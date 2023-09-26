import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
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
export class SelectZoneComponent implements OnInit{
  zones: ZoneViewModel[] = [];
  @Output() goNext = new EventEmitter();
  localCompany: Company = {};
  zoneControl = new FormControl('');
	form!: FormGroup;

  constructor(private zone: ZoneService,
    private companyService: CompanyService,
    private permitService: PermitService,
    private fb: FormBuilder) { 
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

    ngOnInit(): void {
      this.form = this.fb.group({
        zone: [null, [Validators.required]]
      });
      }

    onClickNext(form: FormGroup){
      var zone: any = form.value.zone;
      if(zone && zone.name)
      {
        var permit = this.permitService.getLocalApplyPermit();
          permit.zoneName = zone.name;
          permit.zoneKey = zone.zoneKey;
          permit.zoneType = zone.zoneType;
          permit.zoneTypeKey = zone.zoneTypeKey;
  
          this.permitService.setLocalApplyPermit(permit);
          this.goNext.emit();
        }
    }

}
