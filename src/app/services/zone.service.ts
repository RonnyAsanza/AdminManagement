import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { ZoneViewModel } from '../models/zone.model';
import { PermitsResponse } from './permits-response.model';

@Injectable({
	providedIn: 'root',
})
export class ZoneService {

	constructor(private http: HttpClient) { }

	getZonesByCompany(companykey: number): Observable<PermitsResponse<ZoneViewModel[]>>{
		var urlPath = environment.apiPermitsURL + 'Zone/GetZonesByCompanyKey/'+companykey;
		return this.http.get<PermitsResponse<ZoneViewModel[]>>(urlPath);
	}

}