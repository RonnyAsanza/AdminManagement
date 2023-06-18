import { Injector, Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
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
    private loader : LoaderService;
    // private messageService: MessageService;
    constructor(private injector: Injector) {
        this.loader = this.injector.get(LoaderService);
        // this.messageService = this.injector.get(MessageService);
      }
    // constructor(private loader: LoaderService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      this.totalRequests++;
      this.loader.show();
      request = this.addAuthToken(request);
      request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
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
              this.loader.hide();
            }
          })
      );
  }
    addAuthToken(request: HttpRequest<any>) {
        const token: string = localStorage.getItem('token')!;
        if (!token) {
          return request;
        }

        return request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
}
