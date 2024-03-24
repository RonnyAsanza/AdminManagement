import { Component, EventEmitter, Output, OnInit, Input, ElementRef, QueryList, ViewChildren, AfterViewInit, OnDestroy } from '@angular/core';
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
import { Subscription, from } from 'rxjs';
import { GoogleMapsService } from '../../../../services/google-maps.service';
import { ZoneLookUpTypeEnum } from '../../../../models/zone.model';

@Component({
  selector: 'app-select-zone',
  templateUrl: './select-zone.component.html',
  styleUrls: ['./select-zone.component.scss'],
  providers: [MessageService]
})
export class SelectZoneComponent implements OnInit,  AfterViewInit {
  @Output() goNext = new EventEmitter();
  @Output() setZone = new EventEmitter();

  zones: ZoneViewModel[] = [];
  allZones: ZoneViewModel[] = [];
  localCompany: Company = {};
  zoneControl = new FormControl('');
	form!: FormGroup;
  permitTypeFlag: Boolean = false;
  @ViewChildren('autocomplete') searchElementRefs!: QueryList<ElementRef>;
  zoneLookUpTypeEnum = ZoneLookUpTypeEnum;
  subscriptionAddressChange!: Subscription;
  canShowMap = false;
  canShowAddressContainer = false;


  constructor(private zone: ZoneService,
    private companyService: CompanyService,
    private permitService: PermitService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private translate: TranslateService,
    public googleMapsService: GoogleMapsService
  ) {}

    loadInitialData(): void {
      from(this.companyService.getLocalCompany())
      .subscribe(value => {
        this.localCompany = value;
        this.zone.getZonesByCompany(this.localCompany.companyKey!)
        .subscribe({
          next: (response) => {
            if(response.succeeded )
            {
              if(response.data == null || response.data == undefined){
                var message = (this.translate.data.find(translation => translation.labelCode == 'ClientPermit.NoZones')?.textValue || 'ClientPermit.NoZones')
                this.messageService.add({
                  key: 'msg',
                  severity: 'error',
                  summary: 'Error',
                  detail: message,
                  life: 5000
                });
                this.router.navigate(['/'+this.localCompany.portalAlias+'/permit-home']);
              } else {
                var data = response.data as ZoneViewModel[];
                this.zones = response.data as ZoneViewModel[];
                this.allZones = response.data as ZoneViewModel[];
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

    ngOnInit(): void {
      this.form = this.fb.group({
        zone: [null, [Validators.required]]
      });
      this.loadInitialData();
      this.validateShowMap();
      this.validateAddressContainer();
  
      this.subscriptionAddressChange = this.googleMapsService.address$.subscribe(async address => {
        const permit = await this.permitService.getLocalApplyPermit();
        this.filterZonesByZoneLookUpType(permit.permitCategory?.zoneLookupTypeKey!);
        this.filterByContainingLocation({
          lat: address?.lat || 0,
          lng: address?.long || 0
        });
      });
      
    }

    filterZonesByZoneLookUpType(zoneLookUpType :ZoneLookUpTypeEnum): void{
      this.zones = this.allZones.filter(zone => zone.zoneLookupTypeKey === zoneLookUpType);
    }

    filterByContainingLocation(location: {lat: number, lng: number}): void{
      this.zones = this.googleMapsService.getZonesContainingLocation(this.allZones, location);
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
          if(this.canShowAddressContainer) {
            this.subscribeToSearchElementChanges();
          }
        }, 1500);
    }

    subscribeToSearchElementChanges() {
      this.initializeAutocompleteForLastSearchElement();
      this.googleMapsService.initMap(document.getElementById('map')!, 8);
    }
    getLastSearchElement() {
      return this.searchElementRefs.last;
    }
    
    initializeAutocompleteForLastSearchElement() {
      const searchElementRef = this.getLastSearchElement();
      this.googleMapsService.initAutocomplete(searchElementRef);
    }

    async onClickNext(form: FormGroup){
      var zone: any = form.value.zone;
      if(zone && zone.name)
      {
        console.log(zone, 'Zone!');
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

    async onZoneChange(zone: ZoneViewModel){
      const permit = await this.permitService.getLocalApplyPermit();
      if (zone.coordinates && permit.permitCategory?.zoneLookupTypeKey === ZoneLookUpTypeEnum.ZONE_SELECTION_GEOFENCING) {
        this.googleMapsService.setPolygonCoordinates(zone.coordinates);
      }
      
    }

    async validateShowMap(): Promise<void> {
      const permit = await this.permitService.getLocalApplyPermit();
      const condition = permit.permitCategory?.zoneLookupTypeKey === ZoneLookUpTypeEnum.ZONE_SELECTION_GEOFENCING;
      this.canShowMap = condition;
    }

    async validateAddressContainer(): Promise<void> {
      const permit = await this.permitService.getLocalApplyPermit();
      const condition = permit.permitCategory?.zoneLookupTypeKey !== ZoneLookUpTypeEnum.ZONE_SELECTION_NO_ADDRESS;
      this.canShowAddressContainer = condition;
    }

    ngOnDestroy(): void {
      this.subscriptionAddressChange?.unsubscribe();
      this.googleMapsService.cleanAddressAndPolygon();
    }
}
