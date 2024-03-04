import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { PermitsResponse } from './permits-response.model';
import { TariffTaxAndFeeViewModel } from '../models/tariff-tax-and-fee.model';

@Injectable({
  providedIn: 'root'
})
export class TariffTaxAndFeeService {

  constructor(private http: HttpClient) { }

  getTaxAndFeeByTariff(tariffKey: number): Observable<PermitsResponse<TariffTaxAndFeeViewModel[]>>{
    var urlPath = environment.apiPermitsURL + 'TaxAndFee/tariff/'+tariffKey;
    return this.http.get<PermitsResponse<TariffTaxAndFeeViewModel[]>>(urlPath);
  }
}
