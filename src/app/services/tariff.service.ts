import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { PermitsResponse } from './permits-response.model';
import { TariffViewModel } from '../models/tariff.models';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TariffService {

  constructor(private http: HttpClient) { }

  getTariffByCompany(companykey: number): Observable<PermitsResponse<TariffViewModel[]>>{
    var urlPath = environment.apiPermitsURL + 'Tariff/company/'+companykey;
    return this.http.get<PermitsResponse<TariffViewModel[]>>(urlPath);
  }

  getAvailableTariff(companyKey: number, permitTypeKey: number, zoneKey: number): Observable<PermitsResponse<TariffViewModel[]>>{
    if ( companyKey === 0 || permitTypeKey === 0 || zoneKey === 0) {
      var response = new PermitsResponse<TariffViewModel[]>(false, 'ClientPermit.NoTariffs', []);
      return of(response);
    }

    var request = {
      companyKey : companyKey,
      permitTypeKey: permitTypeKey,
      zoneKey: zoneKey
    }
    var urlPath = environment.apiPermitsURL + 'Tariff/available-tariffs';
    return this.http.post<PermitsResponse<TariffViewModel[]>>(urlPath, request);
  }
}
