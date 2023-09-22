import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { PermitsResponse } from '../permits-response.model';
import { LoginRequest } from 'src/app/models/auth/login-request.model';
import { PortalUserViewModel } from 'src/app/models/auth/portal-user.model';
import { PortalUser } from 'src/app/models/portal-user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(loginRequest: LoginRequest): Observable<PermitsResponse<PortalUserViewModel>>{
    var urlPath = environment.apiPermitsURL + 'Login';
    return this.http.post<PermitsResponse<PortalUserViewModel>>(urlPath, loginRequest);
  }

  refreshToken() {
    var urlPath = environment.apiPermitsURL + 'Login/refresh-token';
    return  this.http.post<any>(urlPath, null)
}

  setLocalToken(token: string): void {
    localStorage.setItem('token', token);
  }

  setLocalUser(user: PortalUserViewModel) {
    let userJsonString = JSON.stringify(user);
    this.setLocalToken(user.token!);
    localStorage.setItem('tokenExpiration', JSON.stringify(user.expiration));
    localStorage.setItem('user',userJsonString);
  }

  getLocalToken(): string {
    return localStorage.getItem('token')!;
  }

  getLocalUser(): PortalUserViewModel {
    let userJsonString = localStorage.getItem('user');
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