import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { PermitsResponse } from './permits-response.model';
import { TariffViewModel } from '../models/tariff.models';

@Injectable({
  providedIn: 'root'
})
export class TariffService {

  constructor(private http: HttpClient) { }

  getTariffByCompany(companykey: number): Observable<PermitsResponse<TariffViewModel[]>>{
    var urlPath = environment.apiPermitsURL + 'Tariff/company/'+companykey;
    return this.http.get<PermitsResponse<TariffViewModel[]>>(urlPath);
  }
}
