// src/app/Interceptors/ErrorInterceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  const router = inject(Router);

  // Check if the request has opted out of error toasts
  const skipErrorToastr = req.headers.get('X-Skip-Error-Toastr') === 'true';

  return next(req).pipe(
    catchError((error) => {
      if (!skipErrorToastr) {
        let message = 'Something went wrong.';

        const url = router.url;

        // Extract a meaningful message from the error response
        if (error?.error?.error) {
          message = error?.error.error; // For API responses with "error" field
        } else if (error?.error?.Exeception) {
          message = error?.error.Exeception;
        } else if (error?.Exeception) {
          message = error?.Exeception;
        }
        if (error?.error?.StatusCode == 500) {
          message = error?.error?.Message;
        }
        // Show error toast
        if (url !== '/home') {
          toastr.error(message, 'Error');
        }
        console.error(error?.error?.Exeception | error?.error?.Detailed)
      }
      return throwError(() => error);
    })
  );
};
