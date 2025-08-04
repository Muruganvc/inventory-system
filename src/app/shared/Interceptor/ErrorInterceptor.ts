// src/app/Interceptors/ErrorInterceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);

  // Check if the request has opted out of error toasts
  const skipErrorToastr = req.headers.get('X-Skip-Error-Toastr') === 'true';

  return next(req).pipe(
    catchError((error) => {
      if (!skipErrorToastr) {
        let message = 'Something went wrong.';

        // Extract a meaningful message from the error response
        if (error?.error?.error) {
          message = error.error.error; // For API responses with "error" field
        } else if (error?.error?.Exeception) {
          message = error.error.Exeception;
        } else if (error?.Exeception) {
          message = error.Exeception;
        }
        if(error.error.StatusCode == 500){
          message = error.error.Message;
        }
        // Show error toast
        toastr.error(message, 'Error');
        console.error(error.error.Exeception | error.error.Detailed)
      }
      return throwError(() => error);
    })
  );
};
