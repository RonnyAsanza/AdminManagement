import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { PermitsResponse } from './permits-response.model';
import { environment } from 'src/environments/environment';
import { PermitCategoryViewModel } from '../models/permit-category.model';
import { ApiErrorViewModel } from '../models/api-error.model';
import { map } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class PermitCategoryService {

	constructor(private http: HttpClient) { }

    getPermitCategories(companykey: number): Observable<PermitsResponse<PermitCategoryViewModel[] | ApiErrorViewModel>>{
		var urlPath = environment.apiPermitsURL + 'PermitCategory/company/'+companykey;
		return this.http.get<PermitsResponse<PermitCategoryViewModel[] | ApiErrorViewModel>>(urlPath).pipe(map(response => {
			if(!response.succeeded){
			  return{succeeded: false, message: response.message, data:response.data} as PermitsResponse<ApiErrorViewModel>
			} return response;
		}));
	}
}