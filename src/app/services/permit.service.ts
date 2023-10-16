import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Permit } from '../models/permit.model';
import { PermitsResponse } from './permits-response.model';
import { ApplyPermit } from '../models/apply-permit.model';
import { LocalStorageService } from './local-storage.service';


@Injectable({
  providedIn: 'root'
})
export class PermitService {
  constructor(private http: HttpClient, private localStorageService: LocalStorageService) { }

  private permitSource = new BehaviorSubject<ApplyPermit>(new ApplyPermit());
  permit = this.permitSource.asObservable()

  applyPermit(applyPermit: ApplyPermit): Observable<PermitsResponse<number>>{

    const formData: FormData = new FormData();
    formData.append('companyKey', applyPermit.companyKey?.toString() || '');
    formData.append('zoneName', applyPermit.zoneName || '');
    formData.append('zoneKey', applyPermit.zoneKey?.toString() || '');
    formData.append('permitTypeKey', applyPermit.permitTypeKey?.toString() || '');
    // Append other properties to formData as needed

    formData.append('name', applyPermit.name || '');
    formData.append('zoneTypeKey', applyPermit.zoneTypeKey?.toString() || '');
    formData.append('zoneType', applyPermit.zoneType || '');
    formData.append('tariffKey', applyPermit.tariffKey?.toString() || '');
    // Append other properties to formData as needed

    formData.append('startDateUtc', applyPermit.startDateUtc?.toString() || '');
    formData.append('expirationDateUtc', applyPermit.expirationDateUtc || '');
    formData.append('licensePlate', applyPermit.licensePlate || '');
    formData.append('quantity', applyPermit.quantity?.toString() || '');
    // Append other properties to formData as needed

    formData.append('price', applyPermit.price?.toString() || '');
    formData.append('total', applyPermit.total?.toString() || '');
    formData.append('additionalInput1', applyPermit.additionalInput1 || '');
    formData.append('additionalInput2', applyPermit.additionalInput2 || '');
    formData.append('additionalInput3', applyPermit.additionalInput3 || '');
    formData.append('additionalInput4', applyPermit.additionalInput4 || '');
    formData.append('additionalInput5', applyPermit.additionalInput5 || '');

    // Append the licenseDriver file to formData
    if (applyPermit.licenseDriver) {
      formData.append('licenseDriver', applyPermit.licenseDriver, applyPermit.licenseDriver.name);
    }

    // Append the proofReisdence file to formData
    if (applyPermit.proofReisdence) {
      formData.append('proofReisdence', applyPermit.proofReisdence, applyPermit.proofReisdence.name);
    }

    var urlPath = environment.apiPermitsURL + 'Application/apply';
    return this.http.post<PermitsResponse<number>>(urlPath, formData);
  }

  getPermitbyId(permitId: string): Observable<PermitsResponse<Permit>>{
    var urlPath = environment.apiPermitsURL + 'Permit/'+permitId;
    return this.http.get<PermitsResponse<Permit>>(urlPath);
  }

  getPermitsByUser(): Observable<PermitsResponse<Permit[]>>{
    var urlPath = environment.apiPermitsURL + 'Permit';
    return this.http.get<PermitsResponse<Permit[]>>(urlPath);
  }

  GetLastPermits(permitsNumber: number): Observable<PermitsResponse<Permit[]>>{
    var urlPath = environment.apiPermitsURL + 'Permit/last/'+permitsNumber;
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
    this.localStorageService.setItem('applyPermit',companyJsonString);
    this.permitSource.next(applyPermit);
  }

  getLocalApplyPermit(): ApplyPermit {
    let permitJsonString = this.localStorageService.getItem('applyPermit');
    if (!permitJsonString)
          return {};
    return JSON.parse(permitJsonString);
  }
  
  updatePermitLicensePlate(permitKey: number, licensePlate: string): Observable<PermitsResponse<number>>{
    var urlPath = environment.apiPermitsURL + 'Permit/'+permitKey+'/license-plate/'+licensePlate;
    return this.http.put<PermitsResponse<number>>(urlPath, null);
  }

}
