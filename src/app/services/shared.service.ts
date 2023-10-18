import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Company } from '../models/company.model';

@Injectable({ providedIn: 'root' })
export class SahredService {
    private company = new Subject<Company>();
    saveCompany(company: Company) {
        this.company.next(company);
    }

    onCompanyChanged(): Observable<Company> {
        return this.company.asObservable();
    }
}