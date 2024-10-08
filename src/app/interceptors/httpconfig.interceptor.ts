import { Injector, Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';

import {  Observable, throwError } from 'rxjs';
import { map, catchError, finalize, switchMap, mergeMap } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';
import { AuthService } from '../services/auth/auth.service';
import { from, lastValueFrom } from "rxjs";
import { CompanyService } from '../services/company.service';
import { Capacitor } from '@capacitor/core';

@Injectable(
    {
        providedIn: 'root'
    }
)
export class HttpConfigInterceptor implements HttpInterceptor {
    private totalRequests = 0;
    private refreshingToken = false;
    private authService: AuthService;
    private companyService: CompanyService;
    constructor(private injector: Injector, private loaderService: LoaderService) {
         this.authService = this.injector.get(AuthService);
         this.companyService = this.injector.get(CompanyService);
      }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
      return from(this.handle(req, next))
    }
  
    async handle(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
      this.totalRequests++;
      this.loaderService.show();
      request = await this.addAuthToken(request);
      if (request.method === 'POST' || request.method === 'PUT') {

        if (!this.hasFileInRequestBody(request.body)) {
          request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
          request = request.clone({ headers: request.headers.set('accept', '*/*') });
        }
      }

      request = request.clone({ headers: request.headers.set('Cache-Control', 'no-cache') });
      request = request.clone({ headers: request.headers.set('Access-Control-Allow-Origin', '*') });
  
      return await lastValueFrom(next.handle(request)
          .pipe(
            map((event: HttpEvent<any>) => {
                  return event;
            }),
            catchError((error: HttpErrorResponse) => {
              switch (error.status) {
                case 401:
                case 403:
                  return this.handleUnauthorizedError(request, next);
                default:
                  return throwError(error.error.message);
              }
            }),
            finalize(() => {
              this.totalRequests--;
              if (this.totalRequests == 0) {
                this.loaderService.hide();
              }
            })
        )
      );
    }

  async addAuthToken(request: HttpRequest<any>) {
      const user = await this.authService.getLocalUser();
      const userCompany = await this.companyService.getLocalCompany();
      if (!user?.token) {
        return request;
      }
      const timeZone = userCompany?.defaultTimeZone || 'UTC';
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${user.token}`,
          TimeZone: timeZone,
        },
      });
  }
  
  checkIfClientIsFromMobile(): boolean {
    return Capacitor.isNativePlatform();
  }

  private handleUnauthorizedError(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isFromDeviceMobile = this.checkIfClientIsFromMobile();
    return from(this.authService.getLocalUser()).pipe(
      mergeMap(user => {
        if (user !== null && user.token !== null) {
          if (!this.refreshingToken && isFromDeviceMobile) {
              this.refreshingToken = true;
              return this.authService.refreshToken(user).pipe(
              mergeMap(async (response) => {
                if(response.succeeded ){  
                  user.token = response.data?.accessToken;
                  user.refreshToken = response.data?.refreshToken;
                  this.authService.setLocalUser(user);
                }
                const updatedRequest = this.addAuthToken(request);
                this.refreshingToken = false;
                return lastValueFrom(next.handle(await updatedRequest));
              }),
              catchError((err) => {
                console.error(err);
                return throwError('Access Denied – You don’t have permission to access');
              })
            );
          }
          else
          {
            return lastValueFrom(next.handle(request));
          }
        } else {
          return throwError(() => new Error('Access Denied – You don’t have permission to access'));
        }
      }),
      catchError((err) => {
        if (err instanceof HttpErrorResponse && err.status === 401 && !isFromDeviceMobile) {
          this.authService.logout();
        }
        return throwError(err);
      })
    );
  }
  
  private hasFileInRequestBody(body: any): boolean {
    return body instanceof FormData;
  }

}
