import { Component, EventEmitter, Output, OnInit, Input, ViewChild, ElementRef, NgZone, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Company } from 'src/app/models/company.model';
import { ZoneLookupTypeEnum, ZoneViewModel } from 'src/app/models/zone.model';
import { CompanyService } from 'src/app/services/company.service';
import { PermitService } from 'src/app/services/permit.service';
import { ZoneService } from 'src/app/services/zone.service';
import { Router } from '@angular/router';
import { TranslateService } from 'src/app/services/translate.service';
import { ApiErrorViewModel } from 'src/app/models/api-error.model';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { from } from 'rxjs';
declare var google: any;


@Component({
  selector: 'app-select-zone',
  templateUrl: './select-zone.component.html',
  styleUrls: ['./select-zone.component.scss'],
  providers: [MessageService]
})
export class SelectZoneComponent implements OnInit, AfterViewInit{
  @ViewChild('autocomplete')
  public searchElementRef!: ElementRef;
  @Output() goNext = new EventEmitter();
  @Output() setZone = new EventEmitter();

  zones: ZoneViewModel[] = [];
  localCompany: Company = {};
  zoneControl = new FormControl('');
	form!: FormGroup;
  permitTypeFlag: Boolean = false;
  zoneLookupType = ZoneLookupTypeEnum;
  currentLookupType: ZoneLookupTypeEnum | undefined;

  map: any;

  constructor(private zone: ZoneService,
    private companyService: CompanyService,
    private permitService: PermitService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private translate: TranslateService,
    private ngZone: NgZone,
    private localStorageService: LocalStorageService
    ) {}
    ngAfterViewInit(): void {
      this.initMaps();
    }

    async ngOnInit(): Promise<void> {
        const applyPermit = await this.localStorageService.getObject('applyPermit');
        this.currentLookupType = applyPermit?.permitCategory?.zoneLookupTypeKey;

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
    drawMap(){
        const domObj = document.getElementById('map');
        if (domObj)
        {
            this.map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: -33.8688, lng: 151.2195 },
                zoom: 13
            });
        }
    }

    getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
        const R = 6371; // Radius of the earth in km
        const dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
        const dLon = this.deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c; // Distance in km
        return distance;
    }

    deg2rad(deg: number) {
        return deg * (Math.PI/180)
    }

    initAutocomplete() {
        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);

        autocomplete.addListener('place_changed', () => {
            this.ngZone.run(() => {
            let place: any = autocomplete.getPlace();

            if (!place.geometry) {
                window.alert("No details available for input: '" + place.name + "'");
                return;
            }

            // Centra el mapa en la dirección seleccionada por el usuario y pinta un marcador.
            if (this.map)
            {
                this.map.setCenter(place.geometry.location);
            }
            let closestZone: ZoneViewModel | undefined;
                let closestDistance = 20;
                const closestZones: ZoneViewModel[] = [];
                this.zones.forEach(zone => {
                let distance = this.getDistanceFromLatLonInKm(place.geometry.location.lat(), place.geometry.location.lng(), zone.latitude!, zone.longitude!);
                if (distance < closestDistance)
                {
                    if (this.currentLookupType === ZoneLookupTypeEnum.zoneSelection)
                    {
                        closestDistance = distance;
                        closestZone = zone;
                    }
                    else
                    {
                        closestZones.push(zone);
                    }
                }
                });
                if (closestZone)
                {
                this.form.controls['zone'].setValue(closestZone);
                this.setLocalZone(closestZone);
                }
                else {
                    //Put closest zones as markers in map
                    closestZones.forEach(zone => {
                        let marker = new google.maps.Marker({
                            position: { lat: zone.latitude!, lng: zone.longitude! },
                            map: this.map,
                            title: zone.name,
                            label: zone.name
                        });
                        marker.addListener('click', () => {
                            this.form.controls['zone'].setValue(zone);
                            this.setLocalZone(zone);
                        });
                    });
                }
            });
        });
    }

    initMaps(){
        this.drawMap();
        this.initAutocomplete();
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
}
