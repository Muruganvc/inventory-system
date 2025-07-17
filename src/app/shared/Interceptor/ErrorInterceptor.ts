// src/app/Interceptors/ErrorInterceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);

  // Skip error toast if the request has a skip header
  const skipErrorToastr = req.headers.get('X-Skip-Error-Toastr') === 'true';

  return next(req).pipe(
    catchError((error) => {
      if (!skipErrorToastr) {
        let message = 'Something went wrong.';

        if (error?.error?.message) {
          message = error.error.message;
        } else if (error?.message) {
          message = error.message;
        }

        // toastr.error(message, 'Error');
        console.error(message);
      }

      return throwError(() => error);
    })
  );
};
