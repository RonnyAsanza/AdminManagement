import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { PermitsResponse } from '../permits-response.model';
import { LoginRequest } from 'src/app/models/auth/login-request.model';
import { PortalUserViewModel, TokenViewModel } from 'src/app/models/auth/portal-user.model';
import { PortalUser } from 'src/app/models/portal-user.model';
import { LocalStorageService } from '../local-storage.service';
import { CompanyService } from '../company.service';
import { Router } from '@angular/router';
import { ChangePasswordViewModel } from 'src/app/models/auth/change-password.model';

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

  async logout() {
    var company = await this.companyService.getLocalCompany();
    this.localStorageService.clear();
    this.router.navigate(['/'+company.portalAlias+'/auth']);
  }

  refreshToken(user: PortalUserViewModel): Observable<PermitsResponse<TokenViewModel>> {
    console.log('refreshToken', user);
    var urlPath = environment.apiPermitsURL + 'Login/refresh-token';
    let body = {
      accessToken: user.token,
      refreshToken: user.refreshToken,
    };
    console.log("refreshToken", body);
    return this.http.post<PermitsResponse<TokenViewModel>>(urlPath, body);
}

  setLocalToken(token: string): void {
    this.localStorageService.setItem('token', token);
  }

  setLocalUser(user: PortalUserViewModel) {
    let userJsonString = JSON.stringify(user);
    this.localStorageService.setItem('user',userJsonString);
  }

  async getLocalUser(): Promise<PortalUserViewModel> {
    return await this.localStorageService.getObject('user');
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

  resetPassword(email: string, companyKey: number): Observable<PermitsResponse<number>>{
    var urlPath = environment.apiPermitsURL + 'PortalUser/'+ email + '/reset-password';
    return this.http.put<PermitsResponse<number>>(urlPath, companyKey);
  }

  changePassword(portalUserKey: string, changePassword: ChangePasswordViewModel): Observable<PermitsResponse<number>>{
    var urlPath = environment.apiPermitsURL + 'PortalUser/'+ portalUserKey + '/change-password';
    return this.http.put<PermitsResponse<number>>(urlPath, changePassword);
  }
}