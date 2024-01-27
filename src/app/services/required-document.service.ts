import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { PermitsResponse } from './permits-response.model';
import {  RequiredDocumentViewModel } from '../models/required-document.model';
import { of } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class RequiredDocumentService {

	constructor(private http: HttpClient) { }

	getRequiredDocuments(companyKey: number, permitTypeKey: number, tariffKey: number, zoneKey: number): Observable<PermitsResponse<RequiredDocumentViewModel[]>>{
        if ( companyKey === 0 || permitTypeKey === 0 || zoneKey === 0 || tariffKey === 0) {
            return of({} as PermitsResponse<RequiredDocumentViewModel[]>);
        }

        var request = {
            companyKey : companyKey,
            permitTypeKey: permitTypeKey,
            tariffKey: tariffKey,
            zoneKey: zoneKey
        }
		var urlPath = environment.apiPermitsURL + 'RequiredDocument/required-documents';
		return this.http.post<PermitsResponse<RequiredDocumentViewModel[]>>(urlPath, request);
	}
}