import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApplyPermit } from 'src/app/models/apply-permit.model';
import { Company } from 'src/app/models/company.model';
import { PermitType } from 'src/app/models/permit-type.models';
import { Tariff } from 'src/app/models/tariff.models';
import { CompanyService } from 'src/app/services/company.service';
import { PermitService } from 'src/app/services/permit.service';

@Component({
  selector: 'app-permit-options',
  templateUrl: './permit-options.component.html',
  styleUrls: ['./permit-options.component.scss'],
  providers: [MessageService]
})
export class PermitOptionsComponent {
  permitOptions = new FormControl();
  form!: FormGroup;
  minDate = new Date();
  company!: Company;
  confirmationDialog: boolean = false;
  permit!: ApplyPermit;
  permitTypes: PermitType[] =
  [
    new PermitType(1, 'Visitor'),
    new PermitType(2, 'Standard'),
    new PermitType(3, 'Bulk'),
    new PermitType(4, 'Banked')
  ];

  tariffs: Tariff[] =
  [
    new Tariff(1, 'Standard Day'),
    new Tariff(2, 'Standard Week'),
    new Tariff(3, 'Standard Month'),
    new Tariff(4, 'Absolute Month'),
    new Tariff(5, 'Relative Month')
  ];
  constructor(private companyService: CompanyService,
    private router: Router,
    private fb: FormBuilder,
    private permitService: PermitService){
 }

 uploadedFiles: any[] = [];


  ngOnInit(): void {
    this.company = this.companyService.getLocalCompany();
    var endDate = new Date();
    endDate.setDate(this.minDate.getDate() + 1);
    this.permitService.permit.subscribe(permit =>{
      this.form = this.fb.group({
        zone: [permit.zoneName, [Validators.required]],
        permitType: [this.permitTypes[1], [Validators.required]],
        tariff: [this.tariffs[0], [Validators.required]],
        startDate: [this.minDate, [Validators.required]],
        endDate: [endDate.toLocaleDateString("en-US"), [Validators.required]],
        licensePlate: [permit.licensePlate, [Validators.required, Validators.minLength(3)]],
        price: [10],
        quantity: [1, [Validators.required]],
        total: [10],
        driversLicense: [''],
        proffOfResidence: [''],
        optional1: [''],
        optional2: [''],
      });
    });
  }

  uploadfun(event: any) {
    for (const file of event.files) {
        this.uploadedFiles.push(file);
    }

  }

  onChangeStartDate(){
    var startDate = this.form?.value.startDate;
    var tariff = this.form?.value.tariff;
    this.setEndDate(startDate, tariff);
  }

  onTariffChange(tariff: any)
  {
    var startDate = this.form?.value.startDate;
    this.setEndDate(startDate, tariff.value);
  }

  setEndDate(startDate: Date, tariff: Tariff){
    var endDate = new Date();
    var quantity = this.form?.value.quantity;
    var price = 10;
    if(tariff.tariffId == 1)
    {
      endDate.setDate(startDate.getDate() + quantity);
    }
    else if(tariff.tariffId == 2)
    {
      price = 50;
      endDate.setDate(startDate.getDate() + (7 * quantity));
    }
    else
    {
      price = 150;
      endDate.setMonth(startDate.getMonth() + quantity);
    }
    price = price * quantity;

    this.form?.patchValue({
      total: price,
      endDate: endDate.toLocaleDateString("en-US")
    });

  }

  onChangeQuantity(){
    var tariff = this.form?.value.tariff;
    var quantity = this.form?.value.quantity;
    var price = 10;
    if(tariff.tariffId == 1)
    {
      price = 10 * quantity;
    }
    else if(tariff.tariffId == 2)
    {
      price = 50 * quantity;
    }
    else
    {
      price = 150 * quantity;
    }

    this.form?.patchValue({
      total: price
    });

  }

  onSubmitPermit(): void {
    var permit = this.permitService.getLocalApplyPermit();
    permit.permitType = this.form?.value.permitType;
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

    /*

      */
  }

  onCancel(){
    console.log('cancel');
  }


  hideDialog() {
    this.confirmationDialog = false;
    this.permit = { };
  }

  savePermit(){
    this.permitService.applyPermit(this.permit)
    .subscribe({
      next: (response) => {
        if(response.succeeded )
        {
         // this.permitService.setLocalApplyPermit(new ApplyPermit());
          this.hideDialog();
          this.router.navigate(['/' + this.company.externalCompanyId+'/permits/' + response.data]);
        }
      },
      error: (e) => {
      }
  });
  }
}
