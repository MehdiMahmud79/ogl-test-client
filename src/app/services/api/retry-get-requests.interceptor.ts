import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RetryGetRequestsInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(`Intercepting request: ${req.method} ${req.url}`);
    // Only retry GET requests
    if (req.method === 'GET') {
      return next.handle(req).pipe(
        retry(4), // Retry up to 10 times
        catchError((error: HttpErrorResponse) => {
          console.error(`GET request to ${req.url} failed after 20 retries:`, error);
          return throwError(() => error);
        })
      );
    }
    return next.handle(req);
  }
}
