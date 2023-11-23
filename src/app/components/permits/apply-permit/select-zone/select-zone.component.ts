import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Company } from 'src/app/models/company.model';
import { ZoneViewModel } from 'src/app/models/zone.model';
import { CompanyService } from 'src/app/services/company.service';
import { PermitService } from 'src/app/services/permit.service';
import { ZoneService } from 'src/app/services/zone.service';
import { Router } from '@angular/router';
import { TranslateService } from 'src/app/services/translate.service';
import { ApiErrorViewModel } from 'src/app/models/api-error.model';
import { from } from 'rxjs';

@Component({
  selector: 'app-select-zone',
  templateUrl: './select-zone.component.html',
  styleUrls: ['./select-zone.component.scss'],
  providers: [MessageService]
})
export class SelectZoneComponent implements OnInit{
  @Output() goNext = new EventEmitter();
  @Output() setZone = new EventEmitter();
  
  zones: ZoneViewModel[] = [];
  localCompany: Company = {};
  zoneControl = new FormControl('');
	form!: FormGroup;
  permitTypeFlag: Boolean = false;

  constructor(private zone: ZoneService,
    private companyService: CompanyService,
    private permitService: PermitService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private translate: TranslateService) {}

    ngOnInit(): void {
      this.form = this.fb.group({
        zone: [null, [Validators.required]]
      });

      from(this.companyService.getLocalCompany())
      .subscribe(value => {
        this.localCompany = value;
        this.zone.getZonesByCompany(this.localCompany.companyKey!)
        .subscribe({
          next: (response) => {
            if(response.succeeded )
            {
              if(response.data == null || response.data == undefined){
                this.permitService.displayError(this.translate.data.find(translation => translation.labelCode == 'ClientPermit.NoZones')?.textValue || 'ClientPermit.NoZones')
                this.router.navigate(['/'+this.localCompany.portalAlias+'/permit-home']);
              } else {
                var data = response.data as ZoneViewModel[];
                this.zones = response.data as ZoneViewModel[];
                if(data.length == 1 && this.permitTypeFlag){
                  this.goNext.emit();
                  this.setLocalZone(this.zones[0]);
                }

                if(data?.length == 1){
                  this.setZone.emit();
                  this.setLocalZone(this.zones[0]);
                }
              }
            }
            else{
              var error = response.data as ApiErrorViewModel;
              this.showException(error);
            }
          }
        });
      });
      
    }

    async onClickNext(form: FormGroup){
      var zone: any = form.value.zone;
      if(zone && zone.name)
      {
        this.setLocalZone(zone);
        this.goNext.emit();
      }
    }

    setPermitType(){
      this.permitTypeFlag = true;
    }

    async setLocalZone(zone: ZoneViewModel){
      var permit = await this.permitService.getLocalApplyPermit();
      permit.zoneName = zone.name;
      permit.zoneKey = zone.zoneKey;
      permit.zoneType = zone.zoneTypeName;
      permit.zoneTypeKey = zone.zoneTypeKey;
      this.permitService.setLocalApplyPermit(permit);
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
