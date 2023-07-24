import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';
import { CompanyService } from 'src/app/services/company.service';
import { Company } from 'src/app/models/company.model';
import { Application } from 'src/app/models/application.model';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ReSubmitApplication } from 'src/app/models/resubmit-application.model';


@Component({
  selector: 'app-application-information',
  templateUrl: './application-information.component.html',
  styleUrls: ['./application-information.component.scss'],
  providers: [DatePipe]
})
export class ApplicationInformationComponent implements OnInit {
  applicationId: string = "";
  company!: Company;
  application!: Application;
  startDateUtc: string = "";
  expirationDateUtc: string = "";

  licenseDriver!: File;
  proofResidence!: File;
  imageUrlLicenseDriver: SafeUrl | undefined;  // Cambio de tipo a SafeUrl
  imageUrlProofResidence: SafeUrl | undefined;  // Cambio de tipo a SafeUrl
  updateFiles: boolean = true;

  constructor(private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private router: Router,
    private applicationService: ApplicationService,
    private companyService: CompanyService,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.company = this.companyService.getLocalCompany();
    this.activatedRoute.params.subscribe(params => {
      this.applicationId = params['applicationId'];
      this.applicationService.getApplicationbyId(this.applicationId)
        .subscribe((response) => {
          if (response.succeeded) {
            this.application = response.data!;
            this.startDateUtc = this.datePipe.transform(this.application.startDateUtc, 'dd/MMMM/YYYY HH:mm')!;
            this.expirationDateUtc = this.datePipe.transform(this.application.expirationDateUtc, 'dd/MMMM/YYYY HH:mm')!;
          }
          else {
            this.router.navigate(['/' + this.company.portalAlias + '/']);
          }

          if (this.application.documents && this.application.documents.length > 0) {
            let licenseDriverDocument = this.application.documents.find(doc => doc.documentType === 'LicenseDriver');
            let proofOfResidenceDocument = this.application.documents.find(doc => doc.documentType === 'ProofOfResidence');

            if (licenseDriverDocument) {
              this.imageUrlLicenseDriver = `data:${licenseDriverDocument.contentType};base64,${licenseDriverDocument.fileData}`;
            }
            if (proofOfResidenceDocument) {
              this.imageUrlProofResidence = `data:${proofOfResidenceDocument.contentType};base64,${proofOfResidenceDocument.fileData}`;
            }
          }

        });
    });
  }

  onClickSubmit() {
    if (this.application.applicationStatusKey === 1) {
      this.submitApplication();
    } else if (this.application.applicationStatusKey === 3 || this.application.applicationStatusKey === 6) {
      this.resubmitApplication();
    }
  }
  
  submitApplication() {
    this.applicationService.submitApplication(this.applicationId)
      .subscribe({
        next: (response) => {
          if (response.succeeded) {
            this.router.navigate(['/' + this.company.portalAlias]);
          }
        },
        error: (e) => {
        }
      });
  }
  
  resubmitApplication() {
   var resubmit = new ReSubmitApplication();
   resubmit.applicationKey = this.application.applicationKey;
   resubmit.startDateUtc = this.application.startDateUtc;
   resubmit.expirationDateUtc = this.application.expirationDateUtc;
   resubmit.tariffKey = this.application.tariffKey;
   resubmit.licensePlate = this.application.licensePlate;
   resubmit.additionalInput1 = this.application.additionalInput1;
   resubmit.additionalInput2 = this.application.additionalInput2;
   resubmit.licenseDriver = this.licenseDriver;
   resubmit.proofReisdence = this.proofResidence;
   this.applicationService.reSubmitApplication(resubmit)
   .subscribe({
     next: (response) => {
       if (response.succeeded) {
         this.router.navigate(['/' + this.company.portalAlias]);
       }
     },
     error: (e) => {
     }
   });
  }
  
  onClickCancelApplication() {
    this.applicationService.cancelApplication(this.applicationId)
      .subscribe({
        next: (response) => {
          if (response.succeeded) {
            this.router.navigate(['/' + this.company.portalAlias]);
          }
        },
        error: (e) => {
        }
      });
  }

  async onUploadLicenseDriver(event: any) {
    for (let file of event.files) {
      this.licenseDriver = file;
      this.imageUrlLicenseDriver = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
    }
  }

  async onUploadProofResidence(event: any) {
    for (let file of event.files) {
      this.proofResidence = file;
      this.imageUrlProofResidence = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
    }
  }

  onRemoveLicenseDriver(event: any) {
    this.imageUrlLicenseDriver = undefined;
  }

  onRemoveProofResidence(event: any) {
    this.imageUrlProofResidence = undefined;
  }

}
