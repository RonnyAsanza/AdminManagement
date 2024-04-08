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
//import { GoogleMapsService } from '../../../../services/google-maps.service';
import { ZoneLookUpTypeEnum } from '../../../../models/zone.model';
import {
  GoogleMap,
  MapDirectionsService,
} from '@angular/google-maps';
import { PlaceSearchResult } from '../address-autocomplete/address-autocomplete.component';
import { GoogleMapsService, MapInformation } from 'src/app/services/google-maps.service';

@Component({
  selector: 'app-select-zone',
  templateUrl: './select-zone.component.html',
  styleUrls: ['./select-zone.component.scss'],
  providers: [MessageService]
})
export class SelectZoneComponent implements OnInit {
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
  markers: any[] = [];
  searchGoogleMapsSubscription!: Subscription;
  mapInformation!: MapInformation;
  polygons: any[] = [];

  constructor(private zone: ZoneService,
    private companyService: CompanyService,
    private permitService: PermitService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private translate: TranslateService,
    private googleMapsService: GoogleMapsService,
  ) {}

    loadInitialData(): void {
      from(this.companyService.getLocalCompany())
      .subscribe(value => {
        this.localCompany = value;
        this.zone.getZonesByCompany(this.localCompany.companyKey!)
        .subscribe({
          next: async (response) => {
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
                this.allZones = response.data as ZoneViewModel[];
                var permit = await this.permitService.getLocalApplyPermit();
                this.filterZonesByZoneLookUpType(permit?.permitCategory?.zoneLookupTypeKey!);
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
    }
    
    onPlaceChanged(event: PlaceSearchResult) {
      from(this.permitService.getLocalApplyPermit())
      .subscribe(permit => {
        this.filterZonesByZoneLookUpType(permit.permitCategory?.zoneLookupTypeKey!);
        this.mapInformation = {
          placeSearchResult : event,
          markers : this.markers,
          polygons: this.polygons
        }
        
/*       this.subscriptionAddressChange = this.googleMapsService.address$.subscribe(async address => {
          this.filterByContainingLocation({
            lat: address?.lat || 0,
            lng: address?.long || 0
          },
          permit.permitCategory?.zoneLookupTypeKey!
          );
        });
*/
      });


    }

    getFilterZonesByAddress(address: string): ZoneViewModel[] {
      return this.allZones.filter(zone => zone.address?.toLowerCase().includes(address?.toLowerCase()));
    }

    getMarkersFromZones(zones: ZoneViewModel[]){
      this.clearMarkers();
      zones.forEach(zone => {
        if (this.isValidLocation(zone.latitude, zone.longitude)) {
          const marker = this.googleMapsService.addMarker(zone.name!, zone.latitude!, zone.longitude!, zone.address!, "Monthly Permit", 200.00);
          if (marker) {
            this.markers.push(marker);
          }
        }
      });
    }

    getPolygonsFromZones(zones: ZoneViewModel[]){
      this.clearPolygons();
      zones.forEach(zone => {
        console.log(zone);
        if (zone.coordinates != null && zone.coordinates.trim() !== '') {
          const polygon = this.googleMapsService.addPolygon(zone.name!, zone.latitude!, zone.longitude!, zone.address!, "Monthly Permit", 200.00, zone.coordinates!);
          if (polygon) {
            this.polygons.push(polygon);
          }
        }
      });
    }

    isValidLocation(latitude: number | null | undefined, longitude: number | null | undefined): boolean {
      return latitude != null && longitude != null && !isNaN(latitude) && !isNaN(longitude) && latitude !== 0 && longitude !== 0;
    }
    

    clearMarkers() {
      this.markers = [];
    }

    clearPolygons() {
      this.polygons = [];
    }

    filterZonesByZoneLookUpType(zoneLookUpType :ZoneLookUpTypeEnum): void{
      //this.zones = this.allZones;
      this.zones = this.allZones.filter(zone => zone.zoneLookupTypeKey === zoneLookUpType);

      if(zoneLookUpType === ZoneLookUpTypeEnum.ZONE_SELECTION)
      {
        this.getPolygonsFromZones(this.zones);
      }
      else
      {
        this.getMarkersFromZones(this.zones);
      }
    }

    filterByContainingLocation(location: {lat: number, lng: number}, zoneLookupTypeKey: number): void{
      if(zoneLookupTypeKey === ZoneLookUpTypeEnum.ZONE_SELECTION_NO_ADDRESS)
      {
        return;
      }

     /* this.zones = this.googleMapsService.getZonesContainingLocation(this.zones, location);
      const zonesWithSameAddress = this.getFilterZonesByAddress(this.googleMapsService.address);
      this.zones = [...new Set([...this.zones, ...zonesWithSameAddress])];*/
    }

    getLastSearchElement() {
      return this.searchElementRefs.last;
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
    /*  const permit = await this.permitService.getLocalApplyPermit();
      if (zone.coordinates && permit.permitCategory?.zoneLookupTypeKey === ZoneLookUpTypeEnum.ZONE_SELECTION_GEOFENCING) {
        this.googleMapsService.setPolygonCoordinates(zone.coordinates);
      }
      */
    }

    ngOnDestroy(): void {
     /* this.subscriptionAddressChange?.unsubscribe();
      this.googleMapsService.cleanAddressAndPolygon();*/
    }
}
