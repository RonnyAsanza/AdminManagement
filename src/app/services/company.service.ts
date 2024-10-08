import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Company } from '../models/company.model';
import { PermitsResponse } from './permits-response.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {
  }

  getAllCompanies(): Observable<PermitsResponse<Company[]>>{
    var urlPath = environment.apiPermitsURL + 'Company';
    return this.http.get<PermitsResponse<Company[]>>(urlPath);
  }

  getCompanyConfigurations(companyAlias: string): Observable<PermitsResponse<Company>>{
    var urlPath = environment.apiPermitsURL + 'Company/alias/'+companyAlias+'/configurations';
    return this.http.get<PermitsResponse<Company>>(urlPath);
  }

  setLocalCompany(company: Company) {
    company.companyLogo = environment.permitsURL + company.companyLogo;
    let companyJsonString = JSON.stringify(company);
    this.localStorageService.setItem('company',companyJsonString);
  }

  async getLocalCompany(): Promise<Company> {
    return await this.localStorageService.getObject('company');
  }

}
