import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from 'src/app/models/company.model';
import { CreditCard } from 'src/app/models/credit-card.models';
import { PaymentType } from 'src/app/models/payment-type.models';
import { Permit } from 'src/app/models/permit.model';
import { CompanyService } from 'src/app/services/company.service';
import { PermitService } from 'src/app/services/permit.service';
import { Table } from 'primeng/table';
import { environment } from 'src/environments/environment';
import { MonerisService } from 'src/app/services/moneris.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MonerisReceiptRequest } from 'src/app/models/moneris/moneris-receipt-request.model';
import { ContactDetails, MonerisPreloadRequest } from 'src/app/models/moneris/moneris-preload-request.model';
import { PdfService } from 'src/app/services/pdf.service';
import { MenuItem } from 'primeng/api';
import { from } from 'rxjs';
import { PortalUserViewModel } from 'src/app/models/auth/portal-user.model';
import { TaxAndFeeValueTypeEnum, TaxAndFeeTypeEnum } from '../../../models/tax-and-fee.model';

declare var monerisCheckout: any;

@Component({
  selector: 'app-permit-information',
  templateUrl: './permit-information.component.html',
  styleUrls: ['./permit-information.component.scss'],
  providers: [DatePipe]
})
export class PermitInformationComponent implements OnInit {
  permitId: string = "";
  permit: Permit = new Permit();
  company!: Company;
  ticket: string = "";
  startDateUtc: string = "";
  expirationDateUtc: string = "";
  paymentTC: boolean = false;
  imp: number = 15;

  creditCards: CreditCard[] =
    [
      new CreditCard(1, 'Mario Asanza', 'American Express', '3730****2324', '01/29'),
      new CreditCard(1, 'Mario Asanza', 'Mastercard', '5555****4444', '05/24'),
      new CreditCard(1, 'Mario Asanza', 'Visa', '4111****1111', '06/23'),
    ];
  paymentTypes: PaymentType[] =
    [
      new PaymentType(1, 'Credit Card', 'Payment will be reflected right away'),
      new PaymentType(2, 'Cash', 'Payment will be reflected in a few hours')
    ];
  paymentType!: PaymentType;
  items: MenuItem[] = [];

  
  constructor(private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private router: Router,
    private permitService: PermitService,
    private monerisService: MonerisService,
    private authService: AuthService,
    private pdfService: PdfService,
    private companyService: CompanyService) { }

  ngOnInit(): void {
    this.paymentType = this.paymentTypes[0];
    var companyPromise = from(this.companyService.getLocalCompany());
    companyPromise.subscribe(value => {
      this.company = value;
    });
    this.activatedRoute.params.subscribe(params => {
      this.permitId = params['permitId'];
      this.OnLoadPermit();
    });

    this.items = [
      { label: 'Export PDF', icon: 'pi pi-refresh' },
      { separator: true },
      { label: 'Open Receipt', icon: 'pi pi-cog' }
  ];
  }

  OnLoadPermit(){
    this.permitService.getPermitbyId(this.permitId)
    .subscribe((response) => {
      if (response.succeeded) {
        this.permit = response.data!;
        this.startDateUtc = this.datePipe.transform(this.permit.startDateUtc, 'yyyy-MM-dd HH:mm')!;
        this.expirationDateUtc = this.datePipe.transform(this.permit.expirationDateUtc, 'yyyy-MM-dd HH:mm')!;
        this.permit.total = 1930;
          this.permit.taxesAndFees = [
            {
              permitTariffTaxAndFeeKey: 1,
              permitTariffTaxAndFeeGuid: 'guid-1',
              tariffTaxAndFeeKey: 101,
              baseValue: 100.00,
              appliedValue: 10.00,
              calculatedValue: 110.00,
              taxAndFeeValueType: TaxAndFeeValueTypeEnum.Fixed,
              permitKey: 1001,
              tariffTaxAndFee: {
                tariffTaxAndFeeKey: 101,
                tariffTaxAndFeeGuid: 'guid-101',
                tariffKey: 1,
                value: 10.00,
                startDate: new Date(),
                endDate: new Date(),
                enabled: true,
                taxAndFeeKey: 1,
                taxAndFee: {
                  name: 'Impuesto 1',
                  description: 'Impuesto 1',
                  taxAndFeeValueType: TaxAndFeeValueTypeEnum.Fixed,
                  companyKey: 1,
                  taxAndFeeKey: 1,
                  enabled: true,
                  TaxAndFeeGuid:'',
                  taxAndFeeType: TaxAndFeeTypeEnum.Tax
                  
                }
              }
            },
            {
              permitTariffTaxAndFeeKey: 2,
              permitTariffTaxAndFeeGuid: 'guid-2',
              tariffTaxAndFeeKey: 102,
              baseValue: 200.00,
              appliedValue: 20.00,
              calculatedValue: 220.00,
              taxAndFeeValueType: TaxAndFeeValueTypeEnum.Percentage,
              permitKey: 1002,
              tariffTaxAndFee: {
                tariffTaxAndFeeKey: 101,
                tariffTaxAndFeeGuid: 'guid-101',
                tariffKey: 1,
                value: 10.00,
                startDate: new Date(),
                endDate: new Date(),
                enabled: true,
                taxAndFeeKey: 1,
                taxAndFee: {
                  name: 'Impuesto 2',
                  description: 'Impuesto 2',
                  taxAndFeeValueType: TaxAndFeeValueTypeEnum.Fixed,
                  companyKey: 1,
                  taxAndFeeKey: 1,
                  enabled: true,
                  TaxAndFeeGuid:'',
                  taxAndFeeType: TaxAndFeeTypeEnum.Tax
                  
                }
              }
            }
          ];
      }
      else {
        this.router.navigate(['/' + this.company.portalAlias + '/']);
      }
    });
  }

  OnSelectPaymentType(paymentType: PaymentType) {
    if (paymentType.paymentTypeKey === 1) {
      this.paymentTC = true;
      this.MonerisPreloadRequest();
    }
    else {
      this.paymentTC = false;
    }
  }

  onClickPayment() {
    this.permitService.payPermit(this.permitId)
      .subscribe({
        next: (response) => {
          if (response.succeeded) {
            this.router.navigate(['/' + this.company.portalAlias]);
          }
        }
      });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  public MonerisPreloadRequest() {
    var companyPromise = from(this.companyService.getLocalCompany());
    companyPromise.subscribe(value => {
      this.company = value;
    });

    setTimeout(() => {
      var myCheckout = new monerisCheckout();
      myCheckout.setMode(environment.setMode);
      myCheckout.setCheckoutDiv("monerisCheckout");
      //myCheckout.startCheckout('1654707308Bvz0ErV8dOTLdpajRkGgijeJoaLBiT');

      var localUser : PortalUserViewModel = {};
      var userPromise = from(this.authService.getLocalUser());
      userPromise.subscribe(value => {
        this.company = value;
      });

      var contactDetails = {
        first_name: localUser.firstName,
        last_name: localUser.lastName,
        email: localUser.emailAddress,
        phone: localUser.smsPhoneNumber
      } as ContactDetails;

      var monerisRequest = {
        txn_total: (Math.round(this.permit.price! * 100) / 100).toFixed(2),
        permitKey: this.permit.permitKey,
        contact_details: contactDetails
      } as MonerisPreloadRequest;

      this.monerisService.MonerisPreloadRequest(monerisRequest)
        .subscribe(res => {
          if (res.succeeded) {
            myCheckout.setCallback("page_loaded", this.myPageLoad);
            myCheckout.setCallback("cancel_transaction", this.myCancelTransaction);
            myCheckout.setCallback("error_event", this.myErrorEvent);
            // myCheckout.setCallback("payment_receipt", this.myPaymentReceipt);
            myCheckout.setCallback("payment_receipt", (response: any) => {
              this.myPaymentReceipt(response);
            });
            myCheckout.setCallback("payment_complete", (response: any) => {
              this.myPaymentComplete(response);
            });
            this.ticket = res.data?.response?.ticket!;
            myCheckout.startCheckout(this.ticket);
          }
          else {
            console.log("ERRORRRRRRR - MonerisPreloadRequest");
          }

        }
        );
    }, 1000);
  }

  public myPaymentComplete(response: any) {
    this.PaymentComplete();
  }

  public myPageLoad(response: any) {
    console.log("myPageLoad");
  }

  private myCancelTransaction(response: any) {
    console.log("myCancelTransaction");
  }

  private myErrorEvent(response: any) {
    console.log("myErrorEvent");
  }

  private myPaymentReceipt(response: any) {
    console.log("myPaymentReceipt");
    this.PaymentComplete();
  }

  private PaymentComplete() {
    var myCheckout = new monerisCheckout();

    var monerisReciptRequest = {
      ticket: this.ticket,
      permitKey: this.permit.permitKey,
    } as MonerisReceiptRequest;

    this.monerisService.MonerisReceiptRequest(monerisReciptRequest)
      .subscribe({
        next: (response) => {
          this.monerisService.setMonerisResponse(response.data!);
          if (response.succeeded) {
            myCheckout.setMode(environment.setMode);
          }
          else {
            this.MonerisPreloadRequest();
          }
        },
        error: (err) => {
          console.log(err);
        }
      });

      setTimeout(() => {
        myCheckout.closeCheckout(this.ticket);
        this.OnLoadPermit();
      }, 5000);
  }

  generatePDF(action: string) {
    this.pdfService.generaReceiptPDF(action, this.permit);
  }

  onViewApplication(applicationId: any){
    this.router.navigate(['/' + this.company.portalAlias+'/application/' + applicationId]);
  }

}
