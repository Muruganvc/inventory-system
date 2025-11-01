// src/app/interceptors/ErrorInterceptor.ts
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { from, Observable } from 'rxjs';
import { lastValueFrom } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const toastr = inject(ToastrService);
  const router = inject(Router);
  const auth = inject(AuthService);

  const skipErrorToastr = req.headers.get('X-Skip-Error-Toastr') === 'true';

  // Wrap async logic inside an Observable
  return from(
    (async () => {
      try {
        // Convert the next handler to a promise so we can await it
        const response = await lastValueFrom(next(req));
        return response;
      } catch (error: any) {
        if (!skipErrorToastr) {
          let message = 'Something went wrong.';
          const url = router.url;

          if (error?.error?.error) {
            message = error.error.error;
          } else if (error?.error?.Exeception) {
            message = error.error.Exeception;
          } else if (error?.Exeception) {
            message = error.Exeception;
          }

          if (error?.error?.StatusCode === 500) {
            message = error.error.Message;
          }

          if (error?.error?.StatusCode === 401) {
            message = 'Session Expired, Please re-login';
            toastr.error(message, 'Error');
            auth.logout();
          }

          if (url !== '/home') {
            toastr.error(message, 'Error');
          }

          console.error(
            error?.error?.Exeception || error?.error?.Detailed || message
          );
        }

        throw error;
      }
    })()
  );
};
