import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Permit } from '../models/permit.model';
import { PermitsResponse } from './permits-response.model';
import { ApplyPermit } from '../models/apply-permit.model';
import { LocalStorageService } from './local-storage.service';
import { PermitStatusViewModel } from '../models/permit-status.model';

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
    formData.append('zoneKey', applyPermit.zoneKey?.toString() || '');
    formData.append('permitTypeKey', applyPermit.permitTypeKey?.toString() || '');
    formData.append('zoneTypeKey', applyPermit.zoneTypeKey?.toString() || '');
    formData.append('tariffKey', applyPermit.tariffKey?.toString() || '');
    formData.append('startDateUtc', applyPermit.startDateUtc?.toString() || '');
    formData.append('expirationDateUtc', applyPermit.expirationDateUtc || '');
    formData.append('licensePlate', applyPermit.licensePlate || '');
    formData.append('quantity', applyPermit.quantity?.toString() || '');
    formData.append('unitPrice', applyPermit.price?.toString() || '');
    formData.append('price', applyPermit.subTotal?.toString() || '');
    formData.append('total', applyPermit.total?.toString() || '');
    formData.append('additionalInput1', applyPermit.additionalInput1 || '');
    formData.append('additionalInput2', applyPermit.additionalInput2 || '');
    formData.append('additionalInput3', applyPermit.additionalInput3 || '');
    formData.append('additionalInput4', applyPermit.additionalInput4 || '');
    formData.append('additionalInput5', applyPermit.additionalInput5 || '');
    formData.append('typeEnum', applyPermit.typeEnum?.toString() || '');
    
    applyPermit.requiredDocuments?.forEach((document, index) => {
      formData.append(`RequiredDocuments[${index}].RequiredDocumentKey`, document.requiredDocumentKey?.toString()??"");
      formData.append(`RequiredDocuments[${index}].DocumentTypeKey`, document.documentTypeKey?.toString()??"");
      formData.append(`RequiredDocuments[${index}].DocumentKey`, document.documentKey?.toString()??"");

      if (document.documentFile) {
        formData.append(`RequiredDocuments[${index}].DocumentFile`, document.documentFile, document.documentFile.name);
      }
    });
/*
    applyPermit?.taxesAndFees?.forEach((taxAndFee, index) => {
      formData.append(`TaxesAndFees[${index}].tariffTaxAndFeeKey`, taxAndFee.tariffTaxAndFeeKey?.toString()??"");
      formData.append(`TaxesAndFees[${index}].baseValue`, taxAndFee.baseValue?.toString()??"");
      formData.append(`TaxesAndFees[${index}].appliedValue`, taxAndFee.appliedValue?.toString()??"");
      formData.append(`TaxesAndFees[${index}].calculatedValue`, taxAndFee.calculatedValue?.toString()??"");
      formData.append(`TaxesAndFees[${index}].taxAndFeeValueType`, taxAndFee.taxAndFeeValueType?.toString() ??"");
    });
*/
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

  async getLocalApplyPermit(): Promise<ApplyPermit> {
    return await this.localStorageService.getObject('applyPermit');
  }

  updatePermitLicensePlate(permitKey: number, licensePlate: string): Observable<PermitsResponse<number>>{
    var urlPath = environment.apiPermitsURL + 'Permit/'+permitKey+'/license-plate/'+licensePlate;
    return this.http.put<PermitsResponse<number>>(urlPath, null);
  }

  getPermitStatus(): Observable<PermitsResponse<PermitStatusViewModel[]>>{
		var urlPath = environment.apiPermitsURL + 'PermitStatus';
		return this.http.get<PermitsResponse<PermitStatusViewModel[]>>(urlPath);
	}

}
