import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { PermitsResponse } from './permits-response.model';
import { environment } from 'src/environments/environment';
import { PermitCategoryViewModel } from '../models/permit-category.model';

@Injectable({
	providedIn: 'root',
})
export class PermitCategoryService {

	constructor(private http: HttpClient) { }

    getPermitCategories(companykey: number): Observable<PermitsResponse<PermitCategoryViewModel[]>>{
		var urlPath = environment.apiPermitsURL + 'PermitCategory/company/'+companykey;
		return this.http.get<PermitsResponse<PermitCategoryViewModel[]>>(urlPath);
	}
}