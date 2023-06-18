import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Permit } from '../models/permit.model';
import { PermitsResponse } from './permits-response.model';
import { ApplyPermit } from '../models/apply-permit.model';


@Injectable({
  providedIn: 'root'
})
export class PermitService {
  constructor(private http: HttpClient) { }

  private permitSource = new BehaviorSubject<ApplyPermit>(new ApplyPermit());
  permit = this.permitSource.asObservable()

  applyPermit(applyPermit: ApplyPermit): Observable<PermitsResponse<number>>{
    var urlPath = environment.apiPermitsURL + 'Permit/ApplyPermit';
    return this.http.post<PermitsResponse<number>>(urlPath, applyPermit);
  }

  getPermitbyId(permitId: string): Observable<PermitsResponse<Permit>>{
    var urlPath = environment.apiPermitsURL + 'Permit/GetPermitbyId/'+permitId;
    return this.http.get<PermitsResponse<Permit>>(urlPath);
  }

  getPermitsByUser(): Observable<PermitsResponse<Permit[]>>{
    var urlPath = environment.apiPermitsURL + 'Permit/GetPermitsByUser';
    return this.http.get<PermitsResponse<Permit[]>>(urlPath);
  }

  payPermit(permitKey: string): Observable<PermitsResponse<number>>{
    let payPermit = {
      PermitKey: permitKey
    };

    var urlPath = environment.apiPermitsURL + 'Permit/PayPermit';
    return this.http.post<PermitsResponse<number>>(urlPath, payPermit);
  }

  setLocalApplyPermit(applyPermit: ApplyPermit): void {
    let companyJsonString = JSON.stringify(applyPermit);
    localStorage.setItem('applyPermit',companyJsonString);
    this.permitSource.next(applyPermit);
  }

  getLocalApplyPermit(): ApplyPermit {
    let permitJsonString = localStorage.getItem('applyPermit');
    if (!permitJsonString)
          return {};
    return JSON.parse(permitJsonString);
  }
  
}
