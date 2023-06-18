import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { CompanyService } from '../services/company.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
    constructor(private userService: AuthService, 
                private companyService: CompanyService, 
                private router: Router) {}
    async canActivate(): Promise<boolean> {
      if (this.userService.getLocalUser() != null) {
        return true;
      } else {
        var company = this.companyService.getLocalCompany();
      //  if(company?.externalCompanyId)
        var navigateRoute = company?.externalCompanyId? `${company?.externalCompanyId}/`:"";
        this.router.navigate([`/${navigateRoute}auth/` ]);
        return false;
      }
    }
}
   