import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Company } from '../models/company.model';
import { PermitsResponse } from './permits-response.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(private http: HttpClient) {
  }

  getAllCompanies(): Observable<PermitsResponse<Company[]>>{
    var urlPath = environment.apiPermitsURL + 'Company/GetAllCompanies';
    return this.http.get<PermitsResponse<Company[]>>(urlPath);
  }

  getCompanyConfigurations(externalCompanyId: string): Observable<PermitsResponse<Company>>{
    var urlPath = environment.apiPermitsURL + 'Company/GetCompanyConfigurations/'+externalCompanyId;
    return this.http.get<PermitsResponse<Company>>(urlPath);
  }

  setLocalCompany(company: Company) {
    let companyJsonString = JSON.stringify(company);
    localStorage.setItem('company',companyJsonString);
  }

  getLocalCompany(): Company {
    let companyJsonString = localStorage.getItem('company');
   if (companyJsonString == 'undefined')
         return {};
    return JSON.parse(companyJsonString!);
  }

}
