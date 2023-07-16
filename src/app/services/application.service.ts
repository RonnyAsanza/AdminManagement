import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PermitsResponse } from './permits-response.model';
import { Application } from '../models/application.model';


@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  constructor(private http: HttpClient) { }

  getApplicationbyId(applicationKey: string): Observable<PermitsResponse<Application>>{
    var urlPath = environment.apiPermitsURL + 'Application/GetApplicationById/'+applicationKey;
    return this.http.get<PermitsResponse<Application>>(urlPath);
  }

  getApplicationsByUser(): Observable<PermitsResponse<Application[]>>{
    var urlPath = environment.apiPermitsURL + 'Application/GetApplicationsByUser';
    return this.http.get<PermitsResponse<Application[]>>(urlPath);
  }

  submitApplication(applicationKey: string): Observable<PermitsResponse<number>>{
    var urlPath = environment.apiPermitsURL + 'Application/SubmitApplication/'+ applicationKey;
    return this.http.put<PermitsResponse<number>>(urlPath, null);
  }
  
  cancelApplication(applicationKey: string): Observable<PermitsResponse<number>>{
    var urlPath = environment.apiPermitsURL + 'Application/submitApplication'+ applicationKey;
    return this.http.delete<PermitsResponse<number>>(urlPath);
  }

}
