import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { CompanyService } from '../services/company.service';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
    constructor(private userService: AuthService, 
                private companyService: CompanyService, 
                private router: Router) {}
    async canActivate(): Promise<boolean> {
      var user = await this.userService.getLocalUser();
      if (user?.portalUserKey != null) {
        return true;
      } else {
        var company = await this.companyService.getLocalCompany();
        var navigateRoute = company?.portalAlias? `${company?.portalAlias}/`:"";
        this.router.navigate([`/${navigateRoute}auth/` ]);
        return false;
      }
    }
}