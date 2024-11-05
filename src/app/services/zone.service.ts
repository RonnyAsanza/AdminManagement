import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { ZoneViewModel } from '../models/zone.model';
import { PermitsResponse } from './permits-response.model';
import { ApiErrorViewModel } from '../models/api-error.model';
import { map } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ZoneService {

	constructor(private http: HttpClient) { }

	getZonesByCompany(companykey: number): Observable<PermitsResponse<ZoneViewModel[] | ApiErrorViewModel>>{
		var urlPath = environment.apiPermitsURL + 'Zone/company/'+companykey;
		return this.http.get<PermitsResponse<ZoneViewModel[] | ApiErrorViewModel>>(urlPath).pipe(map(response =>{
			if(!response.succeeded){
				return{succeeded: false, message: response.message, data:response.data} as PermitsResponse<ApiErrorViewModel>
			} return response;
		}));
	}

}