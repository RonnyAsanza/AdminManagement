import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MonerisReceiptResponse } from '../models/moneris/moneris-receipt-response.model';
import { MonerisReceiptRequest } from '../models/moneris/moneris-receipt-request.model';
import { MonerisPreloadResponse } from '../models/moneris/moneris-preload-response.model';
import { MonerisPreloadRequest } from '../models/moneris/moneris-preload-request.model';
import { PermitsResponse } from './permits-response.model';

@Injectable({
  providedIn: 'root'
})
export class MonerisService {
  constructor(private http: HttpClient) { }
  private monerisResponseObj = { } as MonerisReceiptResponse ;
  private monerisResponseSource = new BehaviorSubject<MonerisReceiptResponse>(this.monerisResponseObj);
  monerisResponse = this.monerisResponseSource.asObservable();

  setMonerisResponse(monerisResponse: MonerisReceiptResponse) {
    this.monerisResponseSource.next(monerisResponse);
  }

  MonerisPreloadRequest(request: MonerisPreloadRequest): Observable<PermitsResponse<MonerisPreloadResponse>>{
    let data = {
      MonerisRequestViewModel: request
      };
    var urlPath = environment.apiPermitsURL + 'Moneris/preload-request';
    return this.http.post<PermitsResponse<MonerisPreloadResponse>>(urlPath, request);
  }

  MonerisReceiptRequest(request: MonerisReceiptRequest): Observable<PermitsResponse<MonerisReceiptResponse>>{
    let data = {
        MonerisReceiptRequestViewModel: request
      };
    var urlPath = environment.apiPermitsURL + 'Moneris/receipt-request';
    return this.http.post<PermitsResponse<MonerisReceiptResponse>>(urlPath, request);
  }

}
