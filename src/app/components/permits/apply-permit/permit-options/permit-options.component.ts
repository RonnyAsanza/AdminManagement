import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApplyPermit } from 'src/app/models/apply-permit.model';
import { Company } from 'src/app/models/company.model';
import { DayOfTheWeek, Tariff, TariffViewModel } from 'src/app/models/tariff.models';
import { CompanyService } from 'src/app/services/company.service';
import { PermitService } from 'src/app/services/permit.service';
import { DatePipe } from '@angular/common';
import { RateEngineService } from 'src/app/services/rate-engine.service';
import { RateEngineByEndDateBasedRequest, RateEngineByEndDateBasedRResponse } from '../../../../models/external-tariff'
import { TariffService } from 'src/app/services/tariff.service';
import { RequiredDocumentService } from 'src/app/services/required-document.service';
import { RequiredDocumentViewModel } from 'src/app/models/required-document.model';

@Component({
  selector: 'app-permit-options',
  templateUrl: './permit-options.component.html',
  styleUrls: ['./permit-options.component.scss'],
  providers: [MessageService, DatePipe],

})
export class PermitOptionsComponent {

  @ViewChildren('buttonEl') buttonEl!: QueryList<ElementRef>;
  permitOptions = new FormControl();
  form!: FormGroup;
  minDate = new Date();
  minEndDate = new Date();
  company!: Company;
  confirmationDialog: boolean = false;
  permit!: ApplyPermit;
  endHour: number = 22;
  startHour: number = 6;
  rateEngineRequest: RateEngineByEndDateBasedRequest = new RateEngineByEndDateBasedRequest();
  rateEngineResponse: RateEngineByEndDateBasedRResponse = new RateEngineByEndDateBasedRResponse();
  totalCharge: number = 0;
  cancelNewPermit: boolean = false;
  tariff!: TariffViewModel;
  licenseDriver!: File;
  proofReisdence!: File;
  tariffControl = new FormControl<any|null>(null);
  tariffs: TariffViewModel[] | undefined;




  requiredDocuments: RequiredDocumentViewModel[] = [];

  constructor(private companyService: CompanyService,
    private datePipe: DatePipe,
    private router: Router,
    private fb: FormBuilder,
    private permitService: PermitService,
    private messageService: MessageService,
    private tariffService: TariffService,
    private rateEngineService: RateEngineService,
    private requiredDocumentService: RequiredDocumentService) {
      var endDate = new Date();
      endDate.setHours(this.endHour);
      endDate.setMinutes(0);
      this.minDate.setHours(this.startHour);
      this.minDate.setMinutes(0);
      this.minEndDate = this.minDate;
      this.tariffControl.setValue(this.tariff)
      this.form = this.fb.group({
        zone: ['', [Validators.required]],
        permitType: ['', [Validators.required]],
        tariff: ['', [Validators.required]],
        startDate: [this.minDate, [Validators.required]],
        endDate: [endDate, [Validators.required]],
        licensePlate: [null, [Validators.required, Validators.minLength(3)]],
        price: [0, [Validators.required, Validators.min(1)]],
        quantity: [1, [Validators.required]],
        total: [0, [Validators.min(1)]],
        driversLicense: [''],
        proffOfResidence: [''],
        optional1: [''],
        optional2: [''],
        optional3: [''],
        optional4: [''],
        optional5: ['']
      });  

      this.permitService.permit.subscribe(permit => {
        if(this.confirmationDialog === false){
          this.form = this.fb.group({
            zone: ['', [Validators.required]],
            permitType: ['', [Validators.required]],
            tariff: ['', [Validators.required]],
            startDate: [this.minDate, [Validators.required]],
            endDate: [endDate, [Validators.required]],
            licensePlate: [null, [Validators.required, Validators.minLength(3)]],
            price: [0, [Validators.required, Validators.min(1)]],
            quantity: [1, [Validators.required]],
            total: [0, [Validators.min(1)]],
            optional1: ['', permit.permitTypeModel?.requireAdditionalInput1?[Validators.required]:[] ],
            optional2: ['', permit.permitTypeModel?.requireAdditionalInput2?[Validators.required]:[] ],
            optional3: ['', permit.permitTypeModel?.requireAdditionalInput3?[Validators.required]:[] ],
            optional4: ['', permit.permitTypeModel?.requireAdditionalInput4?[Validators.required]:[] ],
            optional5: ['', permit.permitTypeModel?.requireAdditionalInput5?[Validators.required]:[] ],
          });

        this.requiredDocumentService.getRequiredDocuments(permit?.companyKey??0, 
          permit?.permitTypeKey??0, 
          permit?.tariffKey??0, 
          permit?.zoneKey??0)
        .subscribe({
          next: (response) => {
              if (response.succeeded) {
                this.requiredDocuments = response.data!;
              }
            }
          });
        }
      });
    }

  ngOnInit(): void {
    this.company = this.companyService.getLocalCompany();
    var endDate = new Date();
    endDate.setHours(this.endHour);
    endDate.setMinutes(0);
    this.minDate.setHours(this.startHour);
    this.minDate.setMinutes(0);
    this.minEndDate = this.minDate;
    this.permitService.permit.subscribe(permit => {
      this.form?.patchValue({
        zone: permit.zoneName,
        permitType: permit.permitTypeModel?.permitTypeEnumValue,
        licensePlate: permit.licensePlate,
        optional1: permit.additionalInput1,
        optional2: permit.additionalInput2,
        optional3: permit.additionalInput3,
        optional4: permit.additionalInput4,
        optional5: permit.additionalInput5
      });
      this.permit = permit;
    });
    
    this.rateEngineRequest = {
      TariffID:  0,
      StartTime: this.datePipe.transform(this.form?.value.startDate, 'yyyy-MM-dd HH:mm') ?? '',
      EndTime: this.datePipe.transform(this.form?.value.endDate, 'yyyy-MM-dd HH:mm') ?? '',
      TCP_Calculate_Add: true
    }
    
    this.setCompanyTariffs()
  }

  onUploadFiles(requiredDocument: RequiredDocumentViewModel, event: any) {
    for (let file of event.files) {
      this.requiredDocuments.forEach(item =>{
        if(item.requiredDocumentKey == requiredDocument.requiredDocumentKey){
            item.documentFile = file
        }
    });
    }
  }


  onChangeEndDate() {
    this.onChangeDate(false);
  }

  onChangeStartDate(){

    this.minEndDate = this.form?.value.startDate;
    this.onChangeDate(true);
  }

  onTariffChange(tariff: any) {
    // var startDate = this.form?.value.tariff;
    // this.setEndDate(startDate, tariff.value);
    this.rateEngineRequest.TariffID = tariff.value.externalTariffId ?? 0;
    this.getPriceRangeEngine()
  }

  getPriceRangeEngine() {
    this.rateEngineService.getRateEngineByEndDateBased(this.rateEngineRequest)
      .subscribe({
        next: (response) => {
          if (response.succeeded) {
            this.rateEngineResponse = response.data!;
            const cleanedTotalCharge = this.rateEngineResponse.totalCharge.replace("$", "").trim();
            if (cleanedTotalCharge) {
              this.totalCharge = parseFloat(cleanedTotalCharge);
            } else {
              this.totalCharge = 0;
              this.showTariffErrorMessage();
            }

            var q = this.getHoursFromRateEngine(this.rateEngineResponse.totalDuration);
            var quantity = this.form?.value.quantity ?? 1;
            let price = this.totalCharge;

            this.form?.patchValue({
              price: price,
              total: price * quantity,
              quantity: quantity,
              endDate: new Date(this.rateEngineResponse.endTime ?? "")
            });
          }
          else{
            this.form?.patchValue({
              price: null,
              total: "",
              quantity: quantity,
              endDate: ""
            });
          }
        },
        error: (e) => {
          this.showTariffErrorMessage();
        }
      });
  }

  showTariffErrorMessage(){
    this.messageService.add({
      key: 'msg',
      severity: 'error',
      summary: 'Error',
      detail: 'Service not available at this time, try later in a few minutes.',
      life: 10000
    });
  }


  onChangeQuantity() {
    // var tariff = this.form?.value.tariff;
    var quantity = this.form?.value.quantity;
    var priceTotal = this.totalCharge * quantity;

    this.form?.patchValue({
      total: priceTotal
    });

  }

  setCompanyTariffs(){
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    this.tariffService.getTariffByCompany(this.company.companyKey ?? 0)
    .subscribe({
      next: (response) => {
        if (response.succeeded) {
          this.tariffs = response.data;
          this.tariffControl.patchValue(this.tariffs![0]);
          this.rateEngineRequest.TariffID = this.tariffs![0].externalTariffId ?? 0;
          this.getPriceRangeEngine()
        }
        else {
          this.messageService.add({
            key: 'msg',
            severity: 'error',
            summary: 'Error',
            detail: response.message,
            life: 10000
          });
        }
      },
      error: (e) => {
        this.showTariffErrorMessage();
      }
    });
  }

  onSubmitPermit(): void {
    var permit = this.permitService.getLocalApplyPermit();
    permit.tariffKey = this.form?.value.tariff.tariffId;
    permit.startDateUtc = this.form?.value.startDate;
    permit.expirationDateUtc = this.form?.value.endDate;
    permit.licensePlate = this.form?.value.licensePlate;
    permit.price = this.form?.value.price;
    permit.total = this.form?.value.price * this.form?.value.quantity;
    permit.quantity = this.form?.value.quantity;
    permit.additionalInput1 = this.form?.value.optional1;
    permit.additionalInput2 = this.form?.value.optional2;
    permit.additionalInput3 = this.form?.value.optional3;
    permit.additionalInput4 = this.form?.value.optional4;
    permit.additionalInput5 = this.form?.value.optional5;

    this.confirmationDialog = true;
    this.permitService.setLocalApplyPermit(permit);
    this.permit = { ...permit };
  }

  onCancel() {
    console.log('cancel');
  }

  confirmCancel(){
    this.cancelNewPermit = false;
    this.router.navigate(['/' + this.company.portalAlias]);
  }

  hideDialog() {
    this.confirmationDialog = false;
    this.permit = {};
  }

  async savePermit() {
    var permit = this.permitService.getLocalApplyPermit();
    this.hideDialog();

    permit.requiredDocuments = this.requiredDocuments;

    permit.startDateUtc = this.datePipe.transform(this.form?.value.startDate, 'yyyy-MM-dd HH:mm') ?? '';
    permit.expirationDateUtc = this.datePipe.transform(this.form?.value.endDate, 'yyyy-MM-dd HH:mm') ?? '';

    this.permitService.setLocalApplyPermit(permit);

    this.permitService.applyPermit(permit)
      .subscribe({
        next: (response) => {
          if (response.succeeded) {
            this.hideDialog();
            var path = (permit.permitTypeModel?.requireApproval === true) ? 'application' : 'permits';
            this.router.navigate(['/' + this.company.portalAlias + '/' + path + '/' + response.data]);
          }
        },
        error: (e) => {
        }
      });
  }

  onChangeDate(isStartDate: boolean) {
    this.rateEngineRequest.StartTime = this.datePipe.transform(this.form?.value.startDate, 'yyyy-MM-dd HH:mm') ?? '';
    this.rateEngineRequest.EndTime = this.datePipe.transform(this.form?.value.endDate, 'yyyy-MM-dd HH:mm') ?? '';
    let startDate = new Date(this.form?.value.startDate);
    let endDate = new Date(this.form?.value.endDate);

    if (startDate > endDate) {
      let input = isStartDate ? 'endDate' : 'startDate';
      let data = isStartDate ? startDate : endDate;

      let newDate = new Date();
      newDate.setDate(data.getDate());
      newDate.setMonth(data.getMonth());
      isStartDate ? this.rateEngineRequest.EndTime = this.rateEngineRequest.StartTime : this.rateEngineRequest.StartTime = this.rateEngineRequest.EndTime;
      this.form?.patchValue({
        [input]: this.datePipe.transform(newDate, 'yyyy-MM-dd HH:mm')
      });
    }

    this.getPriceRangeEngine();
  }

  getHoursFromRateEngine(hoursDays: string | null | undefined): number{
    if(!hoursDays)
      return 0;

    let totalHours: number = 0;

    const parts: string[] = hoursDays.split(' ');
    for (let i = 0; i < parts.length; i += 2) {
      const value: number = parseInt(parts[i], 10);
      const unit: string = parts[i + 1];
      if(unit){
        if (unit.includes('hour')) {
          totalHours += value;
        } else if (unit.includes('day')) {
          totalHours += value * 24; // Convert days to hours
        }
      }
    }
    return totalHours;
  }

  get f(): {
    [key: string]: AbstractControl
  } {
      return this.form.controls;
  }

hasRequiredDocuments(): boolean {
  return this.requiredDocuments.length > 0;
}

}
