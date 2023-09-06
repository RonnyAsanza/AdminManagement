import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { PermitsResponse } from './permits-response.model';
import { PermitTypeViewModel } from '../models/permit-type.model';

@Injectable({
	providedIn: 'root',
})
export class PermitTypeService {

	constructor(private http: HttpClient) { }

    getPermitsTypeByCompanyKey(companykey: number): Observable<PermitsResponse<PermitTypeViewModel[]>>{
		var urlPath = environment.apiPermitsURL + 'PermitType/company/'+companykey;
		return this.http.get<PermitsResponse<PermitTypeViewModel[]>>(urlPath);
	}

}