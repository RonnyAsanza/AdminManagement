import { Component, ElementRef, QueryList, ViewChildren, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApplyPermit } from 'src/app/models/apply-permit.model';
import { Company } from 'src/app/models/company.model';
import { TariffViewModel } from 'src/app/models/tariff.models';
import { CompanyService } from 'src/app/services/company.service';
import { PermitService } from 'src/app/services/permit.service';
import { DatePipe } from '@angular/common';
import { RateEngineService } from 'src/app/services/rate-engine.service';
import { RateEngineByEndDateBasedRequest, RateEngineByEndDateBasedRResponse } from '../../../../models/external-tariff'
import { TariffService } from 'src/app/services/tariff.service';
import { RequiredDocumentService } from 'src/app/services/required-document.service';
import { RequiredDocumentViewModel } from 'src/app/models/required-document.model';
import { PermitTypeViewModel } from 'src/app/models/permit-type.model';
import { PermitTypeService } from 'src/app/services/permitType.service';
import { from } from 'rxjs';
import { TranslateService } from 'src/app/services/translate.service';

@Component({
  selector: 'app-permit-options',
  templateUrl: './permit-options.component.html',
  styleUrls: ['./permit-options.component.scss'],
  providers: [MessageService, DatePipe],

})
export class PermitOptionsComponent {
  @Input() indexView: number = 0;
  @ViewChildren('buttonEl') buttonEl!: QueryList<ElementRef>;
  permitOptions = new FormControl();
  form: FormGroup | undefined;
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
  permitTypeControl = new FormControl();
  tariffs: TariffViewModel[] = [];
  requiredDocuments: RequiredDocumentViewModel[] = [];
  localRequiredDocuments: RequiredDocumentViewModel[] = [];
  permitTypes: PermitTypeViewModel[] = [];
  permitType!: PermitTypeViewModel;
  isCalendarDisabled: boolean = false;
  errorLog: string[] = [];
  localCompany: Company = {};

  constructor(private companyService: CompanyService,
    private datePipe: DatePipe,
    private router: Router,
    private fb: FormBuilder,
    private permitService: PermitService,
    private messageService: MessageService,
    private tariffService: TariffService,
    private rateEngineService: RateEngineService,
    private permitTypeService: PermitTypeService,
    private requiredDocumentService: RequiredDocumentService,
    private translate: TranslateService) {
      var endDate = new Date();
      endDate.setHours(this.endHour);
      endDate.setMinutes(0);
      this.minDate.setHours(this.startHour);
      this.minDate.setMinutes(0);
      this.minEndDate = this.minDate;
      this.permitTypeControl.setValue(this.permitType)

      from(this.permitService.getLocalApplyPermit())
      .subscribe(permit => {
        this.form = this.fb.group({
          zone: ['', [Validators.required]],
          permitType: [null, [Validators.required]],
          tariff: [null, [Validators.required]],
          startDate: [null, [Validators.required]],
          endDate: [{value: '', disabled: true}, [Validators.required]],
          licensePlate: [null, [Validators.required, Validators.minLength(3)]],
          price: [0, [Validators.required, Validators.min(1)]],
          quantity: [1, [Validators.required]],
          total: [0, [Validators.min(1)]],
          optional1: ['', permit?.permitTypeModel?.requireAdditionalInput1?[Validators.required]:[] ],
          optional2: ['', permit?.permitTypeModel?.requireAdditionalInput2?[Validators.required]:[] ],
          optional3: ['', permit?.permitTypeModel?.requireAdditionalInput3?[Validators.required]:[] ],
          optional4: ['', permit?.permitTypeModel?.requireAdditionalInput4?[Validators.required]:[] ],
          optional5: ['', permit?.permitTypeModel?.requireAdditionalInput5?[Validators.required]:[] ],
        });
      });
    }

  async ngOnInit(): Promise<void> {
    this.company = await this.companyService.getLocalCompany();

    var endDate = new Date();
    endDate.setHours(this.endHour);
    endDate.setMinutes(0);
    this.minDate.setHours(this.startHour);
    this.minDate.setMinutes(0);
    this.minEndDate = this.minDate;
    this.permitService.permit.subscribe(permit => {
      this.form?.patchValue({
        zone: permit.zoneName,
        permitType: permit.permitTypeModel,
        tariff: permit.tariffModel
      });
      this.permit = permit;

      this.setOptionalValidators('optional1', permit?.permitTypeModel?.requireAdditionalInput1!);
      this.setOptionalValidators('optional2', permit?.permitTypeModel?.requireAdditionalInput2!);
      this.setOptionalValidators('optional3', permit?.permitTypeModel?.requireAdditionalInput3!);
      this.setOptionalValidators('optional4', permit?.permitTypeModel?.requireAdditionalInput4!);
      this.setOptionalValidators('optional5', permit?.permitTypeModel?.requireAdditionalInput5!);

      this.permitTypeService.getPermitsTypeByPermitCategory(permit?.permitCategory?.permitCategoryKey??0)
      .subscribe({
        next: (response) => {
            if(response.data != undefined && response.data?.length !== 0){
              this.permitTypes = response.data!;
            }else{
              if(this.indexView === 2){
                this.indexView = 0;
                this.permitService.displayError(this.translate.data.find(translation => translation.labelCode == 'ClientPermit.NoPermitTypes')?.textValue || 'ClientPermit.NoPermitTypes')
                this.router.navigate(['/'+this.localCompany.portalAlias+'/permit-home']);
              }
            }
          }
        });

      this.requiredDocumentService.getRequiredDocuments(permit?.companyKey??0, 
        permit?.permitTypeModel?.permitTypeKey??0, 
        permit?.tariffKey??0, 
        permit?.zoneKey??0)
      .subscribe({
        next: (response) => {
            if (response.succeeded) {
              this.requiredDocuments = response.data!;
              
              this.requiredDocuments.forEach((document) => {
                const matchingDocument = this.localRequiredDocuments.find(
                  (requiredDocument) => requiredDocument.requiredDocumentKey === document.requiredDocumentKey
                );
                if (matchingDocument) {
                  document.documentFile = matchingDocument.documentFile;
                }
              });
            }
          }
        });    
    });
    
    this.rateEngineRequest = {
      TariffID:  0,
      StartTime: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm') ?? '',
      EndTime: this.datePipe.transform(this.form?.value.endDate, 'yyyy-MM-dd HH:mm') ?? '',
      Quantity: 1,
      TCP_Calculate_Add: true
    }
    var permit = this.permitService.getLocalApplyPermit();
    permit.permitTypeModel = this.permitType;
    this.permitService.setLocalApplyPermit(permit);
    this.setCompanyTariffs()
  }

  private setOptionalValidators(controlName: string, isRequired: boolean): void {
    const control = this.form?.get(controlName);
    if (control) {
      const validators = isRequired ? [Validators.required] : [];
      control.setValidators(validators);
      control.updateValueAndValidity();
    }
  }

  onUploadFiles(requiredDocument: RequiredDocumentViewModel, event: any) {
    for (let file of event.files) {
      this.requiredDocuments.forEach(item =>{
        if(item.requiredDocumentKey == requiredDocument.requiredDocumentKey){
            item.documentFile = file
        }
     });
    }
    this.localRequiredDocuments = this.requiredDocuments;
  }

  onRemoveFile(requiredDocument: RequiredDocumentViewModel) {
    this.requiredDocuments.forEach(item =>{
        if(item.requiredDocumentKey == requiredDocument.requiredDocumentKey){
            item.documentFile = undefined
        }
    });
    this.localRequiredDocuments = this.requiredDocuments;
  }

  onChangeEndDate() {
    this.onChangeDate(false);
  }

  onChangeStartDate(){
    this.minEndDate = this.form?.value.startDate;
    this.onChangeDate(true);
  }

  async onTariffChange(tariff: any) {
    this.permit = await this.permitService.getLocalApplyPermit();
    this.permit.tariffModel = this.form?.value.tariff;
    this.permitService.setLocalApplyPermit(this.permit);

    this.rateEngineRequest.TariffID = tariff.value.externalTariffId ?? 0;
    this.form.patchValue({tariff: tariff})
    this.tariff = tariff;
  }

  async onPermitTypeChange(value: any){
    this.permit = await this.permitService.getLocalApplyPermit();
    this.permit.permitTypeModel = this.form?.value.permitType;
    this.permitService.setLocalApplyPermit(this.permit);
    this.setCompanyTariffs()
  }

  getPriceRangeEngine() {
    this.rateEngineService.getRateEngineByQuantityBased(this.rateEngineRequest)
      .subscribe({
        next: (response) => {
          if (response.succeeded) {
            this.rateEngineResponse = response.data!;
            const cleanedTotalCharge = this.rateEngineResponse.totalCharge?.replace("$", "")?.trim();
            if (cleanedTotalCharge) {
              this.totalCharge = parseFloat(cleanedTotalCharge);
            } else {
              this.totalCharge = 0;
              this.showTariffErrorMessage();
            }
            var q = this.getHoursFromRateEngine(this.rateEngineResponse.totalDuration);
            var quantity = this.form?.value.quantity ?? 1;
            let total = this.totalCharge;

            this.form?.patchValue({
              price: total/quantity,
              total: total,
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
    this.rateEngineRequest.Quantity = this.form?.value.quantity;
    this.getPriceRangeEngine();
  }

  setCompanyTariffs(){
    this.tariffService.getAvailableTariff(this.permit?.companyKey??0, this.permit?.permitTypeModel?.permitTypeKey??0, this.permit?.zoneKey??0)
    .subscribe({
      next: (response) => {
        if (response.succeeded) {
          this.tariffs = response.data;
          this.tariffControl.patchValue(this.tariffs![0]);
          this.rateEngineRequest.TariffID = this.tariffs![0].externalTariffId ?? 0;
          this.getPriceRangeEngine()
        }
        else {
          if(this.indexView === 2){
            this.tariffs = undefined;
            this.indexView = 0;
            this.permitService.displayError(this.translate.data.find(translation => translation.labelCode == 'ClientPermit.NoTariffs')?.textValue || 'ClientPermit.NoTariffs')
            this.router.navigate(['/'+this.localCompany.portalAlias+'/permit-home']);
          }
        }
      }
    });
  }

  showErrors(error: string){
    this.messageService.add({
      key: 'msg',
      severity: 'error',
      summary: 'Error',
      detail: error,
      life: 10000
    });
  }

  async onSubmitPermit(): Promise<void> {
    var validDocuments = true;
    this.requiredDocuments.some(document =>{
      if(document.required === true && (document.documentFile === undefined ))
      {
        validDocuments = false;
        this.messageService.add({ key: 'msg', severity: 'error', summary: 'Error', detail: 'The document - '+document.documentName+' is required.', life: 10000 });
        return;
      }
    });

    console.log(this.requiredDocuments)

    if(validDocuments)
    {
      var permit = await this.permitService.getLocalApplyPermit();
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
    var permit = await this.permitService.getLocalApplyPermit();
    this.hideDialog();

    permit.requiredDocuments = this.requiredDocuments;

    permit.startDateUtc = this.datePipe.transform(this.form?.value.startDate, 'yyyy-MM-dd HH:mm') ?? '';
    permit.expirationDateUtc = this.datePipe.transform(this.form?.value.endDate, 'yyyy-MM-dd HH:mm') ?? '';

    permit.permitTypeKey = permit.permitTypeModel?.permitTypeKey;
    this.permitService.setLocalApplyPermit(permit);

    this.permitService.applyPermit(permit)
      .subscribe({
        next: (response) => {
          if (response.succeeded) {
            this.hideDialog();
            var path = (permit.permitTypeModel?.requireApproval === true) ? 'application' : 'permits';
            this.router.navigate(['/' + this.company.portalAlias + '/' + path + '/' + response.data]);
          }
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
      return this.form!.controls;
  }

hasRequiredDocuments(): boolean {
  return this.requiredDocuments.length > 0;
}

}
