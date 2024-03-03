import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from 'src/app/models/company.model';
import { Permit } from 'src/app/models/permit.model';
import { CompanyService } from 'src/app/services/company.service';
import { PermitService } from 'src/app/services/permit.service';
import { MessageService } from 'primeng/api';
import { Application } from 'src/app/models/application.model';
import { ApplicationService } from 'src/app/services/application.service';
import { from } from 'rxjs';
import { TaxAndFeeTypeEnum, TaxAndFeeValueTypeEnum } from '../../../models/tax-and-fee.model';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss'],
  providers: [MessageService]
})

export class ActivityListComponent implements OnInit {
  company!: Company;
  permits!: Permit[];
  applications!: Application[];

  itemEditing!: string | null;

  constructor(private companyService: CompanyService,
              private router: Router,
              private permitService: PermitService,
              private applicationService: ApplicationService,
              private messageService: MessageService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    //validate company-user
    from(this.companyService.getLocalCompany())
    .subscribe(value => {
      this.company = value;
      if(this.company == null)
      {
        this.activatedRoute.params.subscribe(params => {
          let companyAlias = params['company'];
          this.router.navigate(['/'+companyAlias+'/auth']);
        });
      }
    });

    this.permitService.GetLastPermits(5)
    .subscribe({
			next: (response) => {
        if(response.succeeded )
        {
          this.permits = response.data!;
          this.permits[0].total = 1930;
          this.permits[0].taxesAndFees = [
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
			}
    });

    this.applicationService.getLasApplications(3)
    .subscribe({
			next: (response) => {
        if(response.succeeded )
        {
          this.applications = response.data!;
        }
			}
    });
  }

  onViewPermit(permitId: any){
    this.router.navigate(['/' + this.company.portalAlias+'/permits/' + permitId]);
  }

  onViewApplication(applicationId: any){
    this.router.navigate(['/' + this.company.portalAlias+'/application/' + applicationId]);
  }

  onEditPermit(permit: Permit) {
    if(this.itemEditing)
    {
      this.permitService.updatePermitLicensePlate(permit.permitKey!, permit.licensePlate!)
      .subscribe({
        next: (response) => {
          if(response.succeeded )
          {
            this.itemEditing = null;
          }
        },
        error: (e) => {
          this.messageService.add({
            key: 'msg',
            severity: 'error',
            summary: 'Error',
            detail: e	
          });
        }
      });
    }
    else
      this.itemEditing = permit.permitGuid!;
  }

  onCancelEdit(){
    this.itemEditing = null;
  }

  onEditApplication(permitGuid: any) {
    if(this.itemEditing)
    {

      this.itemEditing = null;

    }
    else
      this.itemEditing = permitGuid;
  }
}
