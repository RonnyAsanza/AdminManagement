import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { PermitsResponse } from './permits-response.model';
import { Application } from '../models/application.model';
import { ReSubmitApplication } from '../models/resubmit-application.model';
import { ApplicationStatusViewModel } from '../models/application-status.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  constructor(private http: HttpClient) { }

  getApplicationStatus(): Observable<PermitsResponse<ApplicationStatusViewModel[]>>{
		var urlPath = environment.apiPermitsURL + 'ApplicationStatus';
		return this.http.get<PermitsResponse<ApplicationStatusViewModel[]>>(urlPath);
	}


  getApplicationbyId(applicationKey: string): Observable<PermitsResponse<Application>>{
    var urlPath = environment.apiPermitsURL + 'Application/'+applicationKey;
    return this.http.get<PermitsResponse<Application>>(urlPath);
  }

  getApplicationsByUser(): Observable<PermitsResponse<Application[]>>{
    var urlPath = environment.apiPermitsURL + 'Application';
    return this.http.get<PermitsResponse<Application[]>>(urlPath);
  }

  getLasApplications(applicationsNumber: number): Observable<PermitsResponse<Application[]>>{
    var urlPath = environment.apiPermitsURL + 'Application/last/'+applicationsNumber;
    return this.http.get<PermitsResponse<Application[]>>(urlPath);
  }

  submitApplication(applicationKey: string): Observable<PermitsResponse<number>>{
    var urlPath = environment.apiPermitsURL + 'Application/submit/'+ applicationKey;
    return this.http.put<PermitsResponse<number>>(urlPath, null);
  }
  
  cancelApplication(applicationKey: string): Observable<PermitsResponse<number>>{
    var urlPath = environment.apiPermitsURL + 'Application/cancel/'+ applicationKey;
    return this.http.put<PermitsResponse<number>>(urlPath, null);
  }

  reSubmitApplication(reSubmitApplication: ReSubmitApplication): Observable<PermitsResponse<number>>{
    const formData: FormData = new FormData();
    formData.append('applicationKey', reSubmitApplication.applicationKey?.toString() || '');

    //formData.append('zoneTypeKey', reSubmitApplication.zoneTypeKey?.toString() || '');
    //formData.append('zoneType', reSubmitApplication.zoneType || '');
    formData.append('tariffKey', reSubmitApplication.tariffKey?.toString() || '');
    // Append other properties to formData as needed

    formData.append('startDateUtc', reSubmitApplication.startDateUtc?.toString() || '');
    formData.append('expirationDateUtc', reSubmitApplication.expirationDateUtc?.toString() || '');
    formData.append('licensePlate', reSubmitApplication.licensePlate || '');

    reSubmitApplication?.documents?.forEach((document, index) => {
      formData.append(`RequiredDocuments[${index}].applicationRequiredDocumentationKey`, document.applicationRequiredDocumentationKey?.toString()??"");

      if (document.documentFile) {
        formData.append(`RequiredDocuments[${index}].documentFile`, document.documentFile, document.documentFile.name);
      }
    });

    var urlPath = environment.apiPermitsURL + 'Application/resubmit/'+reSubmitApplication.applicationKey;
    return this.http.put<PermitsResponse<number>>(urlPath, formData);
  }
}