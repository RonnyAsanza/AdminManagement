import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from 'src/app/models/company.model';
import { CreditCard } from 'src/app/models/credit-card.models';
import { PaymentType } from 'src/app/models/payment-type.models';
import { Permit } from 'src/app/models/permit.model';
import { CompanyService } from 'src/app/services/company.service';
import { PermitService } from 'src/app/services/permit.service';
import { Table } from 'primeng/table';


@Component({
  selector: 'app-permit-information',
  templateUrl: './permit-information.component.html',
  styleUrls: ['./permit-information.component.scss'],
  providers: [DatePipe]
})
export class PermitInformationComponent {
  permitId: string = "";
  permit!: Permit;
  company!: Company;
  startDateUtc : string = "";
  expirationDateUtc : string = "";
  creditCards: CreditCard[] =
  [
    new CreditCard(1, 'Mario Asanza', 'American Express', '3730****2324', '01/29'),
    new CreditCard(1, 'Mario Asanza', 'Mastercard', '5555****4444', '05/24'),
    new CreditCard(1, 'Mario Asanza', 'Visa', '4111****1111', '06/23'),
  ];
  paymentTypes: PaymentType[] =
  [
    new PaymentType(1, 'Credit Card')
  ];
  paymentType!: PaymentType;
  constructor(private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private router: Router,
    private permitService: PermitService,
    private companyService: CompanyService) { }

    ngOnInit(): void {
      this.paymentType = this.paymentTypes[0];
      this.company = this.companyService.getLocalCompany();
      this.activatedRoute.params.subscribe(params => {
        this.permitId = params['permitId'];
        this.permitService.getPermitbyId(this.permitId)
          .subscribe((response)=>{
            if(response.succeeded )
            {
              this.permit = response.data!;
              this.startDateUtc = this.datePipe.transform(this.permit.startDateUtc, 'dd/MMMM/YYYY HH:mm')!;
              this.expirationDateUtc = this.datePipe.transform(this.permit.expirationDateUtc, 'dd/MMMM/YYYY HH:mm')!;
            }
            else
            {
              this.router.navigate(['/'+this.company.portalAlias+'/']);
            }
          });
      });
    }
    onClickPayment(){
      this.permitService.payPermit(this.permitId)
      .subscribe({
        next: (response) => {
          if(response.succeeded )
          {
            this.router.navigate(['/'+this.company.portalAlias+'/permits']);
          }
        },
        error: (e) => {
        }
      });
    }
    onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
