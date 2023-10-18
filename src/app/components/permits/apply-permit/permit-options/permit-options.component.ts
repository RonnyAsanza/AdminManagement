import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApplyPermit } from 'src/app/models/apply-permit.model';
import { Company } from 'src/app/models/company.model';
import { Tariff } from 'src/app/models/tariff.models';
import { CompanyService } from 'src/app/services/company.service';
import { PermitService } from 'src/app/services/permit.service';
import { DatePipe } from '@angular/common';
import { RateEngineService } from 'src/app/services/rate-engine.service';
import { RateEngineByEndDateBasedRequest, RateEngineByEndDateBasedRResponse } from '../../../../models/external-tariff'

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

  licenseDriver!: File;
  proofReisdence!: File;

  tariffs: Tariff[] =
    [
      new Tariff(3197, 'Day'),
      new Tariff(3198, 'Week'),
      new Tariff(3199, 'Month'),
      new Tariff(3200, 'Year')
    ];
  constructor(private companyService: CompanyService,
    private datePipe: DatePipe,
    private router: Router,
    private fb: FormBuilder,
    private permitService: PermitService,
    private messageService: MessageService,
    private rateEngineService: RateEngineService) {
      var endDate = new Date();
      endDate.setHours(this.endHour);
      endDate.setMinutes(0);
      this.minDate.setHours(this.startHour);
      this.minDate.setMinutes(0);
      this.minEndDate = this.minDate;

      this.form = this.fb.group({
        zone: ['', [Validators.required]],
        permitType: ['', [Validators.required]],
        tariff: [this.tariffs[0], [Validators.required]],
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
        driversLicense: '',
        proffOfResidence: '',
        optional1: '',
        optional2: '',
        optional3: '',
        optional4: '',
        optional5: ''
      });
      this.permit = permit;
    });

    this.rateEngineRequest = {
      TariffID: this.form?.value.tariff.tariffId,
      StartTime: this.datePipe.transform(this.form?.value.startDate, 'yyyy-MM-dd HH:mm') ?? '',
      EndTime: this.datePipe.transform(this.form?.value.endDate, 'yyyy-MM-dd HH:mm') ?? '',
      TCP_Calculate_Add: true
    }
    this.getPriceRangeEngine();
  }

  async onUploadLicenseDriver(event: any) {
    for (let file of event.files) {
      this.licenseDriver = file;
    }
  }

  onUploadProofResidence(event: any) {
    for (let file of event.files) {
      this.proofReisdence = file;
    }
  }

  // onChangeStartDate() {
  //   var startDate = this.form?.value.startDate;
  //   var tariff = this.form?.value.tariff;
  //   this.setEndDate(startDate, tariff);
  // }

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
    this.rateEngineRequest.TariffID = this.form?.value.tariff.tariffId;
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
            var quantity = this.form?.value.quantity;
            let price = this.totalCharge;

            this.form?.patchValue({
              price: price,
              total: price * quantity,
              quantity: quantity,
              endDate: new Date(this.rateEngineResponse.endTime ?? "")
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

  // setEndDate(startDate: Date, tariff: Tariff) {

  //   this.rateEngineService.getRateEngineByEndDateBased(this.rateEngineRequest)
  //     .subscribe({
  //       next: (response) => {
  //         if (response.succeeded) {
  //           this.rateEngineResponse = response.data!;
  //           this.totalCharge = parseFloat(this.rateEngineResponse.totalCharge.replace("$", "").trim());

  //           var endDate = new Date();
  //           var quantity = this.form?.value.quantity;
  //           let price = this.totalCharge;  // Aquí usamos totalCharge
  //           if (tariff.tariffId == 1) {
  //             endDate.setDate(startDate.getDate());
  //           }
  //           else if (tariff.tariffId == 2) {
  //             endDate.setDate(startDate.getDate() + (7 * quantity));
  //           }
  //           else {
  //             endDate.setMonth(startDate.getMonth() + quantity);
  //           }
  //           price = price * quantity;

  //           endDate.setHours(this.endHour);
  //           endDate.setMinutes(0);

  //           this.form?.patchValue({
  //             price: price,
  //             total: price * quantity,
  //             endDate: this.datePipe.transform(endDate, 'dd/MMMM/YYYY HH:mm')
  //           });
  //         }
  //       },
  //       error: (e) => {
  //       }
  //     });
  // }

  onChangeQuantity() {
    // var tariff = this.form?.value.tariff;
    var quantity = this.form?.value.quantity;
    var priceTotal = this.totalCharge * quantity;
    // if (tariff.tariffId == 1) {
    //   priceTotal = this.totalCharge * quantity;
    // }
    // else if (tariff.tariffId == 2) {
    //   priceTotal = this.totalCharge * quantity;
    // }
    // else {
    //   priceTotal = this.totalCharge * quantity;
    // }

    this.form?.patchValue({
      total: priceTotal
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
    this.permitService.setLocalApplyPermit(permit);
    this.permit = { ...permit };
    this.confirmationDialog = true;
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

    permit.licenseDriver = this.licenseDriver;
    permit.proofReisdence = this.proofReisdence;
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

}
