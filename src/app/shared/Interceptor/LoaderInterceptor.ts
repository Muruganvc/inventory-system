import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';

export const LoaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(LoaderService);

  // Skip loader for health check endpoint
  if (req.url.includes('/health')) {
    return next(req); // Do not show loader, just forward the request
  }

  // Show loader for other requests
  loader.show();

  return next(req).pipe(finalize(() => loader.hide()));
};
