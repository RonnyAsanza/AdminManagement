import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';
import { CompanyService } from 'src/app/services/company.service';
import { Company } from 'src/app/models/company.model';
import { Application, DocumentViewModel } from 'src/app/models/application.model';
import { DomSanitizer } from '@angular/platform-browser';
import { ReSubmitApplication } from 'src/app/models/resubmit-application.model';
import { FileService } from 'src/app/services/file.service';
import { Message, MessageService } from 'primeng/api';
import { TranslateService } from 'src/app/services/translate.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-application-information',
  templateUrl: './application-information.component.html',
  styleUrls: ['./application-information.component.scss'],
  providers: [MessageService, DatePipe],
})
export class ApplicationInformationComponent implements OnInit {
  applicationId: string = "";
  company!: Company;
  application!: Application;
  startDateUtc: string = "";
  expirationDateUtc: string = "";
  updateFiles: boolean = true;
  msgs: Message[] = [];
  applicationSubmitted: boolean = false;

  constructor(private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private router: Router,
    private applicationService: ApplicationService,
    private companyService: CompanyService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService,
    private fileService: FileService,
    private localStorageService: LocalStorageService,
    private translateService: TranslateService) {
    }

  async ngOnInit(): Promise<void> {
    await this.initForm();
  }

  async initForm(){
    await this.displaySubmitMessage();

    this.company = await this.companyService.getLocalCompany();   
    this.activatedRoute.params.subscribe(params => {
      this.applicationId = params['applicationId'];
      this.applicationService.getApplicationbyId(this.applicationId)
        .subscribe((response) => {
          if (response.succeeded) {
            this.application = response.data!;
            this.startDateUtc = this.datePipe.transform(this.application.startDateUtc, 'yyyy-MM-dd HH:mm')!;
            this.expirationDateUtc = this.datePipe.transform(this.application.expirationDateUtc, 'yyyy-MM-dd HH:mm')!;
          }
          else {
            this.router.navigate(['/' + this.company.portalAlias + '/']);
          }

          if(this.application?.applicationStatusCode?.toLowerCase() ==='in-queue'){
            this.msgs = [];
            this.msgs.push({ severity: 'warn', summary: 'Queued', detail: "We've reached our capacity for processing applications. Your application is in queue. We'll notify you once a spot becomes available. Thank you for your patience."});
          }

          if (this.application?.documents && this.application?.documents?.length > 0) {
            this.application?.documents.forEach(document =>{
              if(document.fileData)
              {
                let imageUrlString = `data:${document.contentType};base64,${document.fileData}`;
                document.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrlString);
                document.documentFile= this.fileService.dataURLtoFile(imageUrlString, document.documentType+'.pdf');
              }
            });
          }
        });
    });
  }

  async displaySubmitMessage(){
    var submittedFlag = await this.localStorageService.getString('applicationSubmitted');
    if (submittedFlag) {
      this.localStorageService.removeItem('applicationSubmitted');
      var message = (this.translateService.data.find(translation => translation.labelCode == 'ClientPermit.RequiredAccess')?.textValue || 'ClientPermit.RequiredAccess')
      this.messageService.add({
        key: 'msg',
        severity: 'success',
        summary: (this.translateService.data.find(translation => translation.labelCode == 'ClientPermit.SuccessfullySubmitted')?.textValue || 'ClientPermit.SuccessfullySubmitted'),
        life: 3000,
        detail: message
      });
    }
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
        next: async (response) => {
          if (response.succeeded) {
            this.localStorageService.setItem('applicationSubmitted', 'true');
            await this.initForm();
          }
        },
      });
  }

  resubmitApplication() {
    var resubmit = new ReSubmitApplication();
    resubmit.applicationKey = this.application.applicationKey;
    resubmit.startDateUtc = this.application.startDateUtc;
    resubmit.expirationDateUtc = this.application.expirationDateUtc;
    resubmit.tariffKey = this.application.tariffKey;
    resubmit.licensePlate = this.application.licensePlate;
    resubmit.documents = this.application.documents;

    this.applicationService.reSubmitApplication(resubmit)
      .subscribe({
        next: (response) => {
          if (response.succeeded) {
            this.router.navigate(['/' + this.company.portalAlias]);
          }
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
        }
      });
  }
   
  isPdf(file: File): boolean {
    return this.fileService.isPdf(file);
  }

  hasRequiredDocuments(): boolean {
    return this.application?.documents?.length! > 0;
  }
  
  async onUploadFiles(requiredDocument: DocumentViewModel, event: any) {
    this.application.documents?.forEach(async document =>{
      if(document.applicationRequiredDocumentationKey === requiredDocument.applicationRequiredDocumentationKey){
        const result = await this.fileService.onUploadFile(event, this.sanitizer);
        document.documentFile = result.file;
        document.imageUrl = result.imageUrl
      }
    });
  }

  onRemoveFiles(requiredDocument: DocumentViewModel) {
    this.application.documents?.forEach(async document =>{
      if(document.applicationRequiredDocumentationKey === requiredDocument.applicationRequiredDocumentationKey){
        document.imageUrl = this.fileService.onRemoveFile();
      }
    });

  }
}