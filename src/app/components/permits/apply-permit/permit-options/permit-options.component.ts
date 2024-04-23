import { Component } from '@angular/core';
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
import { PermitTypeViewModel, PermitTypesEnum, TypeEnum } from 'src/app/models/permit-type.model';
import { PermitTypeService } from 'src/app/services/permitType.service';
import { from } from 'rxjs';
import { TranslateService } from 'src/app/services/translate.service';
import { TariffTaxAndFeeViewModel } from '../../../../models/tariff-tax-and-fee.model';
import { TariffTaxAndFeeService } from '../../../../services/tariff-tax-and-fee.service';
import { PermitTariffTaxAndFee } from '../../../../models/permit-tariff-tax-and-fee.model';
import {  TaxAndFeeTypeEnum, TaxAndFeeValueTypeEnum } from '../../../../models/tax-and-fee.model';

@Component({
  selector: 'app-permit-options',
  templateUrl: './permit-options.component.html',
  styleUrls: ['./permit-options.component.scss'],
  providers: [MessageService, DatePipe],
})

export class PermitOptionsComponent {
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
  tariffs: TariffViewModel[] = [];
  requiredDocuments: RequiredDocumentViewModel[] = [];
  localRequiredDocuments: RequiredDocumentViewModel[] = [];
  permitTypes: PermitTypeViewModel[] = [];
  appliedTariffTaxAndFee: TariffTaxAndFeeViewModel[] = [];
  permitTariffTaxAndFee: PermitTariffTaxAndFee[] = [];
  bankedLegend: string= "";
  PermitTypesEnum!: PermitTypesEnum;

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
    private tariffTaxAndFeeService: TariffTaxAndFeeService,
    private translate: TranslateService) {
      this.initializeForm();
    }
  
  private initializeForm(): void {
    var endDate = new Date();
    endDate.setHours(this.endHour);
    endDate.setMinutes(0);
    this.minDate.setHours(this.startHour);
    this.minDate.setMinutes(0);
    this.minEndDate = this.minDate;

    from(this.permitService.getLocalApplyPermit())
    .subscribe(permit => {
      this.form = this.fb.group({
        zone: ['', [Validators.required]],
        permitType: [null, [Validators.required]],
        tariff: [null, [Validators.required]],
        startDate: [this.minDate, [Validators.required]],
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

      if(permit?.zoneKey)
      {
        this.permitTypeService.getPermitsTypeByPermitCategory(permit?.permitCategory?.permitCategoryKey??0)
        .subscribe({
          next: (response) => {
              if (response.succeeded) {
                this.permitTypes = response.data!;
              }
            }
          });
      }
      
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
      StartTime: this.datePipe.transform(this.form?.value.startDate, 'yyyy-MM-dd HH:mm') ?? '',
      EndTime: this.datePipe.transform(this.form?.value.endDate, 'yyyy-MM-dd HH:mm') ?? '',
      Quantity: 1,
      TCP_Calculate_Add: true
    }
  }

  private setOptionalValidators(controlName: string, isRequired: boolean): void {
    const control = this.form?.get(controlName);
    if (control) {
      const validators = isRequired ? [Validators.required] : [];
      control.setValidators(validators);
      control.updateValueAndValidity();
    }
  }

  getTaxAndFeeByTariff(tariffKey: number): void {
    this.tariffTaxAndFeeService.getTaxAndFeeByTariff(tariffKey)
    .subscribe({
      next: (response) => {
        if (response.succeeded) {
          this.appliedTariffTaxAndFee = response.data!;
          this.appliedTariffTaxAndFee.forEach((fee) => {
            fee.taxAndFeeType = TaxAndFeeTypeEnum[fee.taxAndFeeType! as unknown as keyof typeof TaxAndFeeTypeEnum];
            fee.taxAndFeeValueType = TaxAndFeeValueTypeEnum[fee.taxAndFeeValueType! as unknown as keyof typeof TaxAndFeeValueTypeEnum];
        });
        }
      }
    });
  }

  manageCalculateTotalWithTaxAndFee(permit: ApplyPermit): void {
    const total = permit.subTotal ?? 0;
    this.permitTariffTaxAndFee = [];
    this.appliedTariffTaxAndFee.forEach((tariffTaxAndFee) => {
      let calculatedValue: number;
      switch (tariffTaxAndFee?.taxAndFeeValueType) {
          case TaxAndFeeValueTypeEnum.Fixed:
              calculatedValue = tariffTaxAndFee.value;
              break;
          case TaxAndFeeValueTypeEnum.Percentage:
              calculatedValue = (total * (tariffTaxAndFee.value / 100));
              break;
          default:
              calculatedValue = 0;
              break;
      }
      
      this.permitTariffTaxAndFee.push({
        baseValue: total,
        appliedValue: tariffTaxAndFee.value,
        calculatedValue: calculatedValue ?? 0,
        permitTariffTaxAndFeeKey: tariffTaxAndFee.taxAndFeeKey,
        taxAndFeeValueType: tariffTaxAndFee?.taxAndFeeValueType,
        tariffTaxAndFeeKey: tariffTaxAndFee.tariffTaxAndFeeKey,
      });
    });
    permit.total = this.permitTariffTaxAndFee.reduce((acc, curr) => acc + (curr.calculatedValue ?? 0), total);
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
    this.permit.tariffModel = tariff.value;
    this.permit.tariffKey = tariff.value.tariffId;
    this.permitService.setLocalApplyPermit(this.permit);
    this.rateEngineRequest.TariffID = tariff.value.externalTariffId ?? 0;
    this.getPriceRangeEngine();
    if(this.permit.tariffKey){
      this.getTaxAndFeeByTariff(this.permit.tariffKey);
    }
  }

  async onPermitTypeChange(value: any){
    this.permit = await this.permitService.getLocalApplyPermit();
    this.permit.permitTypeModel = value.value;
    if(this.permit.permitTypeModel?.permitTypeEnum === PermitTypesEnum.Banked){
      this.bankedLegend = `Container information: Max Count ${this.permit.permitTypeModel?.maxCount ?? 'N/A'} and Min allowed: ${this.permit.permitTypeModel?.minAllowed ?? 'N/A'}.`;
      this.form?.patchValue({
        quantity: this.permit.permitTypeModel?.minAllowed,
      });
    }
    this.permitService.setLocalApplyPermit(this.permit);
    this.form?.controls['permitType'].markAsPristine();
    this.getCompanyTariffs()
  }

  getPriceRangeEngine() {
    this.rateEngineRequest.Quantity = this.form?.value.quantity? this.form?.value.quantity : 1;

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

            let total = this.totalCharge;
            this.form?.patchValue({
              price: total / this.rateEngineRequest.Quantity,
              total: total,
              //quantity: quantity,
              endDate: new Date(this.rateEngineResponse.endTime ?? "")
            });
          }
          else{
            this.form?.patchValue({
              price: null,
              total: "",
              //quantity: this.form?.value.quantity ?? 1,
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
      life: 5000
    });
  }

  onChangeQuantity(val: any) {
    if(val){
      this.rateEngineRequest.Quantity = val;
      this.getPriceRangeEngine();
    } 
  }

  getCompanyTariffs(){
    this.tariffService.getAvailableTariff(this.permit?.companyKey??0, this.permit?.permitTypeModel?.permitTypeKey??0, this.permit?.zoneKey??0)
    .subscribe({
      next: async (response) => {
        if (response.succeeded && response.data !== undefined && response.data.length > 0) {
          this.tariffs = response.data;
          this.rateEngineRequest.TariffID = this.tariffs![0].externalTariffId ?? 0;

          this.permit = await this.permitService.getLocalApplyPermit();
          this.permit.tariffModel = this.tariffs![0];
          this.permit.tariffKey = this.tariffs![0].tariffId;
          this.permitService.setLocalApplyPermit(this.permit);
          this.getPriceRangeEngine();
        }
        else {
          this.messageService.add({
            key: 'msg',
            severity: 'warn',
            summary: 'Error',
            detail: 'No tariffs Found! select a different permit type or zone',
            life: 5000
          });
          this.tariffs = [];
          this.permit = await this.permitService.getLocalApplyPermit();
          this.permit.permitTypeModel = undefined;
          this.permitService.setLocalApplyPermit(this.permit);
        }
      },
      error: (e) => {
        this.showTariffErrorMessage();
      }
    });
  }

  async onSubmitPermit(): Promise<void> {
    var validDocuments = true;
    this.requiredDocuments.some(document =>{
      if(document.required === true && (document.documentFile === undefined ))
      {
        validDocuments = false;
        this.messageService.add({ key: 'msg', severity: 'error', summary: 'Error', detail: 'The document - '+document.documentName+' is required.', life: 5000 });
        return;
      }
    });

    if(validDocuments)
    { 
      var permit = await this.permitService.getLocalApplyPermit();
      
      permit.tariffKey = this.form?.value.tariff.tariffId;
      permit.startDateUtc = this.form?.value.startDate;
      permit.expirationDateUtc = this.form?.getRawValue().endDate;
      permit.licensePlate = this.form?.value.licensePlate;
      permit.price = this.form?.value.price;
      permit.subTotal = this.form?.value.price * this.form?.value.quantity;
      permit.quantity = this.form?.value.quantity;
      permit.additionalInput1 = this.form?.value.optional1;
      permit.additionalInput2 = this.form?.value.optional2;
      permit.additionalInput3 = this.form?.value.optional3;
      permit.additionalInput4 = this.form?.value.optional4;
      permit.additionalInput5 = this.form?.value.optional5;
      this.manageCalculateTotalWithTaxAndFee(permit);
      permit.taxesAndFees = this.permitTariffTaxAndFee;

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
    permit.expirationDateUtc = this.datePipe.transform(this.form?.getRawValue().endDate, 'yyyy-MM-dd HH:mm') ?? '';
    permit.permitTypeKey = permit.permitTypeModel?.permitTypeKey;
    permit.typeEnum = permit.permitTypeModel?.permitTypeEnum === PermitTypesEnum.Banked ? TypeEnum.Container : TypeEnum.Standard;

    this.permitService.setLocalApplyPermit(permit);
    this.permitService.applyPermit(permit)
      .subscribe({
        next: (response) => {
          if (response.succeeded) {
            this.hideDialog();
            var path = (permit.permitTypeModel?.requireApproval === true) ? 'application' : 'permits';
            this.permitService.setLocalApplyPermit({});
            this.router.navigate(['/' + this.company.portalAlias + '/' + path + '/' + response.data]);
          }
          else{
            var message = (this.translate.data.find(translation => translation.labelCode == 'PermitRules.RuleExceeded')?.textValue || 'PermitRules.RuleExceeded');
            this.messageService.add({
              key: 'msg',
              severity: 'error',
              summary: 'Error',
              detail: message,
              life: 10000
            });
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