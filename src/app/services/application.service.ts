import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { PermitsResponse } from './permits-response.model';
import { Application } from '../models/application.model';
import { ReSubmitApplication } from '../models/resubmit-application.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  constructor(private http: HttpClient) { }

  getApplicationbyId(applicationKey: string): Observable<PermitsResponse<Application>>{
    var urlPath = environment.apiPermitsURL + 'Application/'+applicationKey;
    return this.http.get<PermitsResponse<Application>>(urlPath);
  }

  getApplicationsByUser(): Observable<PermitsResponse<Application[]>>{
    var urlPath = environment.apiPermitsURL + 'Application';
    return this.http.get<PermitsResponse<Application[]>>(urlPath);
  }

  submitApplication(applicationKey: string): Observable<PermitsResponse<number>>{
    var urlPath = environment.apiPermitsURL + 'Application/submit/'+ applicationKey;
    return this.http.put<PermitsResponse<number>>(urlPath, null);
  }
  
  cancelApplication(applicationKey: string): Observable<PermitsResponse<number>>{
    var urlPath = environment.apiPermitsURL + 'Application/cancel/'+ applicationKey;
    return this.http.delete<PermitsResponse<number>>(urlPath);
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
    //formData.append('quantity', reSubmitApplication.quantity?.toString() || '');
    // Append other properties to formData as needed

    //formData.append('price', reSubmitApplication.price?.toString() || '');
    //formData.append('total', reSubmitApplication.total?.toString() || '');
    //formData.append('additionalInput1', reSubmitApplication.additionalInput1 || '');
    //formData.append('additionalInput2', reSubmitApplication.additionalInput2 || '');

    // Append the licenseDriver file to formData
    if (reSubmitApplication.licenseDriver) {
      formData.append('licenseDriver', reSubmitApplication.licenseDriver, reSubmitApplication.licenseDriver.name);
    }

    // Append the proofReisdence file to formData
    if (reSubmitApplication.proofReisdence) {
      formData.append('proofReisdence', reSubmitApplication.proofReisdence, reSubmitApplication.proofReisdence.name);
    }

    var urlPath = environment.apiPermitsURL + 'Application/resubmit';
    return this.http.patch<PermitsResponse<number>>(urlPath, formData);
  }

}
