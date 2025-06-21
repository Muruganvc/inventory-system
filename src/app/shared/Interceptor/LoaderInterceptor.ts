import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';
export const LoaderInterceptor: HttpInterceptorFn = (req, next) => {
    const loader = inject(LoaderService);
    console.log('⏳ Interceptor triggered:', req.url);
    loader.show();
    return next(req).pipe(finalize(() => loader.hide()));
};
