import { Injector, Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';

import {  Observable, throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';
import { AuthService } from '../services/auth/auth.service';
@Injectable(
    {
        providedIn: 'root'
    }
)
export class HttpConfigInterceptor implements HttpInterceptor {
    private totalRequests = 0;
    private refreshingToken = false;
    private authService: AuthService;
    constructor(private injector: Injector, private loaderService: LoaderService) {
         this.authService = this.injector.get(AuthService);
      }
    // constructor(private loader: LoaderService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      this.totalRequests++;
      this.loaderService.show();
      request = this.addAuthToken(request);
      if (request.method === 'POST' || request.method === 'PUT') {

        if (!this.hasFileInRequestBody(request.body)) {
          request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
          request = request.clone({ headers: request.headers.set('accept', '*/*') });
        }
        
      }

      request = request.clone({ headers: request.headers.set('Cache-Control', 'no-cache') });
      request = request.clone({ headers: request.headers.set('Access-Control-Allow-Origin', '*') });

      return next.handle(request)
      .pipe(
          map((event: HttpEvent<any>) => {
                return event;
          }),
          catchError((error: HttpErrorResponse) => {
            switch (error.status) {
              case 401:
              case 403:
                return throwError("Access Denied – You don’t have permission to access");
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
      );
  }
    addAuthToken(request: HttpRequest<any>) {
        var  token: string = localStorage.getItem('token')!;
        if (!token) {
          return request;
        }

        let tokenExpiration = localStorage.getItem("tokenExpiration")!;
        const tokenExpirationDate = new Date(tokenExpiration);
        const currentUtcTime = new Date();
/*
        console.log("currentUtcTime", currentUtcTime);
        console.log("tokenExpirationDate", tokenExpirationDate);
*/
        if( currentUtcTime >= tokenExpirationDate) {
          if (!this.refreshingToken) {
            console.log('Token Expired... Initiating Token Refresh');           
            // Set the flag to indicate that a token refresh is in progress
            this.refreshingToken = true;
            this.authService.refreshToken().subscribe({
              next: (response) => {
                token = response.token!;
                localStorage.setItem('token', token);
                localStorage.setItem('tokenExpiration', response.expiration);

                this.refreshingToken = false;
              },
              error: (err) => {
                console.log(err);
              }
            });
          }
       }  

       return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
       });

      }

      private hasFileInRequestBody(body: any): boolean {
        return body instanceof FormData;
      }

}
