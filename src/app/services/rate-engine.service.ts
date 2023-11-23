import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EngineSiteTariffViewModel, RateEngineByEndDateBasedRequest, RateEngineByEndDateBasedRResponse } from '../models/external-tariff';
import { PermitsResponse } from './permits-response.model';
import { TariffViewModel } from '../models/tariff.models';

@Injectable({
  providedIn: 'root'
})
export class RateEngineService {

  private rateEngineRequest = new BehaviorSubject<RateEngineByEndDateBasedRequest>(new RateEngineByEndDateBasedRequest());
  rateEngine = this.rateEngineRequest.asObservable()

  constructor(private http: HttpClient) { }

  getRateEngineByEndDateBased(rateEngineRequest: RateEngineByEndDateBasedRequest): Observable<PermitsResponse<RateEngineByEndDateBasedRResponse>>{
    let params = new HttpParams()
      .set('TariffID', rateEngineRequest.TariffID)
      .set('StartTime', rateEngineRequest.StartTime?.toString()!)
      .set('EndTime', rateEngineRequest.EndTime?.toString()!)
      .set('TCP_Calculate_Add', rateEngineRequest.TCP_Calculate_Add);
  
    var urlPath = environment.apiPermitsURL + 'ExternalTariff/rate-engine/enddate-based';
    var response = this.http.get<PermitsResponse<RateEngineByEndDateBasedRResponse>>(urlPath, { params: params });
    return response;
  } 
  
  getCompanyTariffs(companyId: number, startDate: string): Observable<PermitsResponse<TariffViewModel[]>>{
    let params = new HttpParams()
      .set('siteId', companyId)
      .set('startDate', startDate)
    var urlPath = environment.apiPermitsURL + 'ExternalTariff/rate-engine/site-tariff';
    var response = this.http.get<PermitsResponse<TariffViewModel[]>>(urlPath, { params: params });
    return response;
  } 

  getRateEngineByQuantityBased(rateEngineRequest: RateEngineByEndDateBasedRequest): Observable<PermitsResponse<RateEngineByEndDateBasedRResponse>>{
    let params = new HttpParams()
      .set('TariffID', rateEngineRequest.TariffID)
      .set('StartTime', rateEngineRequest.StartTime?.toString()!)
      .set('Quantity', rateEngineRequest.Quantity)
      .set('TCP_Calculate_Add', rateEngineRequest.TCP_Calculate_Add);
  
    var urlPath = environment.apiPermitsURL + 'ExternalTariff/rate-engine/quantity-based';
    var response = this.http.get<PermitsResponse<RateEngineByEndDateBasedRResponse>>(urlPath, { params: params });
    return response;
  } 
}
