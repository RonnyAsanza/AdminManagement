import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { PermitsResponse } from '../permits-response.model';
import { LoginRequest } from 'src/app/models/auth/login-request.model';
import { PortalUserViewModel } from 'src/app/models/auth/portal-user.model';
import { PortalUser } from 'src/app/models/portal-user.model';
import { LocalStorageService } from '../local-storage.service';
import { CompanyService } from '../company.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
    private localStorageService: LocalStorageService,
    private companyService: CompanyService,
    private router: Router) { }

  login(loginRequest: LoginRequest): Observable<PermitsResponse<PortalUserViewModel>>{
    var urlPath = environment.apiPermitsURL + 'Login';
    return this.http.post<PermitsResponse<PortalUserViewModel>>(urlPath, loginRequest);
  }

  logout() {
    var company = this.companyService.getLocalCompany();
    this.localStorageService.clear();
    this.router.navigate(['/'+company.portalAlias+'/auth']);
  }

  refreshToken() {
    var urlPath = environment.apiPermitsURL + 'Login/refresh-token';
    return  this.http.post<any>(urlPath, null)
}

  setLocalToken(token: string): void {
    this.localStorageService.setItem('token', token);
  }

  setLocalUser(user: PortalUserViewModel) {
    let userJsonString = JSON.stringify(user);
    this.setLocalToken(user.token!);
    this.localStorageService.setItem('tokenExpiration', JSON.stringify(user.expiration));
    this.localStorageService.setItem('user',userJsonString);
  }

  getLocalToken(): string {
    return this.localStorageService.getItem('token')!;
  }

  getLocalUser(): PortalUserViewModel {
    let userJsonString = this.localStorageService.getItem('user');
   if (userJsonString == 'undefined')
         return {};
    return JSON.parse(userJsonString!);
  }

  createPortalUser(portalUser: PortalUser): Observable<PermitsResponse<number>>{
    var urlPath = environment.apiPermitsURL + 'PortalUser/create';
    return this.http.post<PermitsResponse<number>>(urlPath, portalUser);
  }

  confirmEmail(portalUserKey: number, activationCode: string): Observable<PermitsResponse<number>>{
    let body = {
      PortalUserKey: portalUserKey,
      ActivationCode: activationCode,
    };
    var urlPath = environment.apiPermitsURL + 'PortalUser/confirm-email';
    return this.http.post<PermitsResponse<number>>(urlPath, body);
  }
}